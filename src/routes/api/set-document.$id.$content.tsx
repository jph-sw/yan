import { document } from "@/db/schema";
import { db } from "@/utils/db";
import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/set-document/$id/$content")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        await db
          .update(document)
          .set({ content: params.content })
          .where(eq(document.id, params.id));
        return new Response("");
      },
    },
  },
});
