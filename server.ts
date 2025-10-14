import express from "express";
import expressWebsockets from "express-ws";
import { Hocuspocus } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";

// Configure Hocuspocus
const hocuspocus = new Hocuspocus({
  // ...
  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const res = await fetch(
          `http://localhost:3000/api/get-document/${documentName}`,
        );
        const data = await res.json();

        return new Promise((resolve) => {
          resolve(data.doc.data as any);
        });
      },
      store: async ({ documentName, state }) => {
        const res = await fetch(
          `http://localhost:3000/api/set-document/${documentName}/${encodeURI(state.toString())}`,
          {
            method: "POST",
          },
        );
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
