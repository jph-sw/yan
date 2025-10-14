import { document } from "@/db/schema";
import { db } from "@/utils/db";
import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/get-document/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const doc = await db
          .select()
          .from(document)
          .where(eq(document.id, params.id))
          .all();

        console.log("server wants", params.id, "\ncontent:", doc[0]);

        return new Response(JSON.stringify({ doc: doc[0].content }), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
    },
  },
});
