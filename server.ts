import express from "express";
import expressWebsockets from "express-ws";
import { Hocuspocus } from "@hocuspocus/server";
import { db } from "@/utils/db";
import { document } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Database } from "@hocuspocus/extension-database";

// Configure Hocuspocus
const hocuspocus = new Hocuspocus({
  // ...
  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const res = await db
          .select()
          .from(document)
          .where(eq(document.id, documentName));
        return new Promise((resolve, reject) => {
          if (res.length > 0) {
            resolve(res[0].content as any);
          }
        });
      },
      store: async ({ documentName, state }) => {
        await db
          .update(document)
          .set({ content: state as any })
          .where(eq(document.id, documentName));
      },
    }),
  ],
});

// Setup your express instance using the express-ws extension
const { app } = expressWebsockets(express());

// Add a websocket route for Hocuspocus
// You can set any contextual data like in the onConnect hook
// and pass it to the handleConnection method.
app.ws("/collaboration", (websocket, request) => {
  hocuspocus.handleConnection(websocket, request);
});

// Start the server
app.listen(1234, () => console.log("Listening on http://127.0.0.1:1234"));
