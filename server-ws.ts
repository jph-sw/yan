import { document } from "@/db/schema";
import { db } from "@/utils/db";
import { Server } from "@hocuspocus/server";
import { eq } from "drizzle-orm";
import { Database } from "@hocuspocus/extension-database";

const server = new Server({
  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        return new Promise(async (resolve, reject) => {
          const doc = await db
            .select()
            .from(document)
            .where(eq(document.id, documentName))
            .get();

          console.log("Fetched document:", doc?.content);
          if (doc) {
            resolve(doc.content as Uint8Array);
          } else {
            resolve(null);
          }
        });
      },
      store: async ({ documentName, state }) => {
        await db
          .update(document)
          .set({
            content: state,
          })
          .where(eq(document.id, documentName));
      },
    }),
  ],
});

server.listen(1234);
