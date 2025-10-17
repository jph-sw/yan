import { document } from "@/db/schema";
import { db, enableWALMode, optimizeDatabaseSettings } from "@/utils/db";
import { Server } from "@hocuspocus/server";
import { eq } from "drizzle-orm";
import { Database } from "@hocuspocus/extension-database";

async function startServer() {
  await enableWALMode();
  await optimizeDatabaseSettings();

  const retryDatabaseOperation = async <T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delay = 100,
  ): Promise<T> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        const isLockError =
          error.message?.includes("database is locked") ||
          error.message?.includes("SQLITE_BUSY");

        if (isLockError && attempt < maxRetries) {
          console.warn(
            `Database lock detected, retry ${attempt}/${maxRetries} in ${delay}ms`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries exceeded");
  };

  const server = new Server({
    extensions: [
      new Database({
        fetch: async ({ documentName }) => {
          return new Promise(async (resolve, reject) => {
            try {
              const doc = await retryDatabaseOperation(async () => {
                return await db
                  .select()
                  .from(document)
                  .where(eq(document.id, documentName))
                  .get();
              });

              console.log(
                "Fetched document:",
                documentName,
                doc ? "found" : "not found",
              );
              if (doc) {
                resolve(doc.content as unknown as Uint8Array);
              } else {
                resolve(null);
              }
            } catch (error) {
              console.error("Failed to fetch document:", documentName, error);
              reject(error);
            }
          });
        },
        store: async ({ documentName, state }) => {
          try {
            console.log("Saving document:", documentName);
            await retryDatabaseOperation(async () => {
              return await db
                .update(document)
                .set({
                  content: state as unknown as string,
                })
                .where(eq(document.id, documentName));
            });
            console.log("Document saved successfully:", documentName);
          } catch (error) {
            console.error("Failed to save document:", documentName, error);
            throw error;
          }
        },
      }),
    ],
    port: 1234,
  });

  server.listen();
  console.log("WebSocket server started on port 1234");

  process.on("SIGINT", () => {
    console.log("Received SIGINT, shutting down gracefully...");
    server.destroy();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("Received SIGTERM, shutting down gracefully...");
    server.destroy();
    process.exit(0);
  });
}

startServer().catch((error) => {
  console.error("Failed to start WebSocket server:", error);
  process.exit(1);
});
