import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "../db";
import { document, favorite } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { queryOptions } from "@tanstack/react-query";
import { userRequiredMiddleware } from "../auth-middleware";

export const getFavorites = createServerFn({ method: "GET" })
  .middleware([userRequiredMiddleware])
  .inputValidator(z.object({ userId: z.string().min(1, "userId is required") }))
  .handler(async ({ data }) => {
    const favoriteDocuments = await db
      .select()
      .from(favorite)
      .innerJoin(document, eq(favorite.documentId, document.id))
      .where(eq(favorite.userId, data.userId));

    return favoriteDocuments;
  });

export const toggleFavoriteDocument = createServerFn({
  method: "POST",
})
  .middleware([userRequiredMiddleware])
  .inputValidator(
    z.object({
      documentId: z.string().min(1, "documentId is required"),
    }),
  )
  .handler(async ({ data, context }) => {
    const deleteResult = await db
      .delete(favorite)
      .where(
        and(
          eq(favorite.documentId, data.documentId),
          eq(favorite.userId, context.userSession.user.id),
        ),
      )
      .returning();

    if (deleteResult.length === 0) {
      const insertResult = await db
        .insert(favorite)
        .values({
          id: crypto.randomUUID(),
          userId: context.userSession.user.id,
          documentId: data.documentId,
        })
        .returning();

      return { action: "added", isFavorite: true, data: insertResult };
    } else {
      return { action: "removed", isFavorite: false, data: deleteResult };
    }
  });

export const isFavorite = createServerFn({ method: "GET" })
  .middleware([userRequiredMiddleware])
  .inputValidator(
    z.object({
      docId: z.string().min(1, "id is required"),
    }),
  )
  .handler(async ({ data, context }) => {
    const res = await db
      .select()
      .from(favorite)
      .where(
        and(
          eq(favorite.documentId, data.docId),
          eq(favorite.userId, context.userSession.user.id),
        ),
      )
      .get();

    if (res) {
      return true;
    } else {
      return false;
    }
  });

export const isFavoriteQuery = (docId: string) =>
  queryOptions({
    queryKey: ["isFavorite", docId],
    queryFn: async () => {
      return await isFavorite({ data: { docId } });
    },
  });

export const getFavoritesQuery = (userId: string) =>
  queryOptions({
    queryKey: ["favorite", userId],
    queryFn: async () => {
      return await getFavorites({ data: { userId } });
    },
  });
