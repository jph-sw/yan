import { document } from "@/db/schema";
import { db } from "@/utils/db";
import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/set-document/$id")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const buffer = await request.arrayBuffer();
        const state = Buffer.from(buffer).toString("base64");

        console.log("Updating document", params.id, " with\n", state);

        await db
          .update(document)
          .set({ content: state })
          .where(eq(document.id, params.id));
        return new Response("");
      },
    },
  },
});
