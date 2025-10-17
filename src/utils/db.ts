import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// Create the libSQL client with WAL mode enabled for concurrent access
const client = createClient({
  url: process.env.DATABASE_URL || "file:./data/local.db",
});

export const db = drizzle(client);

export async function enableWALMode() {
  try {
    await client.execute("PRAGMA journal_mode=WAL;");
    await client.execute("PRAGMA synchronous=NORMAL;");
    await client.execute("PRAGMA cache_size=1000000;");
    await client.execute("PRAGMA foreign_keys=true;");
    await client.execute("PRAGMA temp_store=memory;");
    console.log("SQLite WAL mode enabled successfully");
  } catch (error) {
    console.error("Failed to enable WAL mode:", error);
    throw error;
  }
}

export async function optimizeDatabaseSettings() {
  try {
    await client.execute("PRAGMA busy_timeout=30000;");
    await client.execute("PRAGMA optimize;");
    console.log("Database settings optimized");
  } catch (error) {
    console.error("Failed to optimize database settings:", error);
  }
}

export async function closeDatabase() {
  try {
    client.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database:", error);
  }
}
