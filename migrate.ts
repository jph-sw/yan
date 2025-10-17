// src/db/migrate.ts
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";

const runMigrations = async () => {
  const client = createClient({
    url: process.env.DATABASE_URL || "file:./data/local.db",
  });

  const db = drizzle(client);

  console.log("Enabling WAL mode and optimizing database settings...");
  try {
    await client.execute("PRAGMA journal_mode=WAL;");
    await client.execute("PRAGMA synchronous=NORMAL;");
    await client.execute("PRAGMA cache_size=1000000;");
    await client.execute("PRAGMA foreign_keys=true;");
    await client.execute("PRAGMA temp_store=memory;");
    await client.execute("PRAGMA busy_timeout=30000;");
    console.log("Database settings optimized successfully");
  } catch (error) {
    console.error("Failed to optimize database settings:", error);
    throw error;
  }

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations completed!");

  client.close();
};

runMigrations().catch((err) => {
  console.error("Migration failed!", err);
  process.exit(1);
});
