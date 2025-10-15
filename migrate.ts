// src/db/migrate.ts
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";

const runMigrations = async () => {
  const client = createClient({
    url: process.env.DATABASE_URL || "file:./data/local.db",
  });

  const db = drizzle(client);

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations completed!");

  client.close();
};

runMigrations().catch((err) => {
  console.error("Migration failed!", err);
  process.exit(1);
});
