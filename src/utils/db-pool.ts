import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

interface DbConnection {
  client: ReturnType<typeof createClient>;
  db: ReturnType<typeof drizzle>;
  inUse: boolean;
  lastUsed: number;
}

class DatabasePool {
  private connections: DbConnection[] = [];
  private readonly maxConnections: number;
  private readonly connectionTimeout: number;
  private readonly dbUrl: string;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxConnections = 5, connectionTimeout = 30000) {
    this.maxConnections = maxConnections;
    this.connectionTimeout = connectionTimeout;
    this.dbUrl = process.env.DATABASE_URL || "file:./data/local.db";

    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleConnections();
    }, 60000); // Clean up every minute
  }

  private createConnection(): DbConnection {
    const client = createClient({
      url: this.dbUrl,
    });

    const db = drizzle(client);

    return {
      client,
      db,
      inUse: false,
      lastUsed: Date.now(),
    };
  }

  private async initializeConnection(connection: DbConnection): Promise<void> {
    try {
      await connection.client.execute("PRAGMA journal_mode=WAL;");
      await connection.client.execute("PRAGMA synchronous=NORMAL;");
      await connection.client.execute("PRAGMA cache_size=1000000;");
      await connection.client.execute("PRAGMA foreign_keys=true;");
      await connection.client.execute("PRAGMA temp_store=memory;");
      await connection.client.execute("PRAGMA busy_timeout=30000;");
    } catch (error) {
      console.error("Failed to initialize database connection:", error);
      throw error;
    }
  }

  async getConnection(): Promise<{
    db: ReturnType<typeof drizzle>;
    release: () => void;
  }> {
    let connection = this.connections.find((conn) => !conn.inUse);

    if (!connection) {
      if (this.connections.length < this.maxConnections) {
        // Create a new connection
        connection = this.createConnection();
        await this.initializeConnection(connection);
        this.connections.push(connection);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return this.getConnection(); // Retry
      }
    }

    connection.inUse = true;
    connection.lastUsed = Date.now();

    const release = () => {
      connection!.inUse = false;
      connection!.lastUsed = Date.now();
    };

    return { db: connection.db, release };
  }

  private cleanupStaleConnections(): void {
    const now = Date.now();
    const staleConnections = this.connections.filter(
      (conn) => !conn.inUse && now - conn.lastUsed > this.connectionTimeout,
    );

    staleConnections.forEach((conn) => {
      try {
        conn.client.close();
      } catch (error) {
        console.error("Error closing stale connection:", error);
      }
    });

    this.connections = this.connections.filter(
      (conn) => !staleConnections.includes(conn),
    );

    if (staleConnections.length > 0) {
      console.log(
        `Cleaned up ${staleConnections.length} stale database connections`,
      );
    }
  }

  async closeAll(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    await Promise.all(
      this.connections.map(async (conn) => {
        try {
          conn.client.close();
        } catch (error) {
          console.error("Error closing database connection:", error);
        }
      }),
    );

    this.connections = [];
    console.log("All database connections closed");
  }

  getStats(): { total: number; inUse: number; available: number } {
    const total = this.connections.length;
    const inUse = this.connections.filter((conn) => conn.inUse).length;
    const available = total - inUse;

    return { total, inUse, available };
  }
}

export const dbPool = new DatabasePool();

export async function withDatabase<T>(
  operation: (db: ReturnType<typeof drizzle>) => Promise<T>,
): Promise<T> {
  const { db, release } = await dbPool.getConnection();
  try {
    return await operation(db);
  } finally {
    release();
  }
}

process.on("SIGINT", async () => {
  console.log("Shutting down database pool...");
  await dbPool.closeAll();
});

process.on("SIGTERM", async () => {
  console.log("Shutting down database pool...");
  await dbPool.closeAll();
});
