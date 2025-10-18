import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db, errors, isDatabaseError } from "../db";
import { desc, eq } from "drizzle-orm";
import { collection, document } from "@/db/schema";
import z from "zod";
import { userRequiredMiddleware } from "../auth-middleware";
import { hasPermissions } from "../auth-functions";

export const getCollections = createServerFn({ method: "GET" })
  .middleware([userRequiredMiddleware])
  .handler(async () => {
    const collections = await db
      .select()
      .from(collection)
      .orderBy(desc(collection.createdAt));
    return collections;
  });

export const collectionsQuery = queryOptions({
  queryKey: ["collections"],
  queryFn: async () => {
    try {
      const collections = await getCollections();
      return collections;
    } catch (e) {
      return [];
    }
  },
});

export const createCollection = createServerFn({
  method: "POST",
})
  .middleware([userRequiredMiddleware])
  .inputValidator(
    z.object({
      name: z.string().min(1).max(100),
      icon: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const newCollection = await db
      .insert(collection)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        icon: data.icon,
        createdAt: new Date(),
      })
      .returning();
    return newCollection[0];
  });

export const deleteCollection = createServerFn({
  method: "POST",
})
  .middleware([userRequiredMiddleware])
  .inputValidator(
    z.object({ id: z.string().min(1, "Collection Id is required") }),
  )
  .handler(async ({ data, context }) => {
    const hasPermission = await hasPermissions({
      data: {
        collection: ["delete"],
        userId: context.userSession.user.id,
        role: context.userSession.user.role!,
      },
    });

    if (hasPermission) {
      try {
        await db.delete(document).where(eq(document.collectionId, data.id));
        await db.delete(collection).where(eq(collection.id, data.id));
      } catch (error) {
        if (isDatabaseError(error)) {
          console.log(error);
          return errors.CASCADING_ERROR;
        }
      }
    } else {
      return errors.UNAUTHORIZED;
    }
  });

export const getCollectionById = createServerFn({
  method: "GET",
})
  .middleware([userRequiredMiddleware])
  .inputValidator(
    z.object({
      collectionId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const collections = await db
      .select()
      .from(collection)
      .where(eq(collection.id, data.collectionId));
    return collections[0] || null;
  });

export const getCollectionByDocId = createServerFn({ method: "GET" })
  .middleware([userRequiredMiddleware])
  .inputValidator(z.object({ documentId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const docs = await db
      .select()
      .from(document)
      .where(eq(document.id, data.documentId))
      .limit(1);
    const doc = docs[0];

    const collection = await getCollectionById({
      data: { collectionId: doc.collectionId },
    });

    return collection;
  });

export const getCollectionByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["collection", id],
    queryFn: async ({ queryKey }) => {
      const collectionId = queryKey[1] as string;
      const collection = await getCollectionById({ data: { collectionId } });
      return collection;
    },
    enabled: !!id,
  });

export const getCollectionByDocIdQuery = (documentId: string) =>
  queryOptions({
    queryKey: ["collectionByDoc", documentId],
    queryFn: async ({ queryKey }) => {
      const docId = queryKey[1] as string;
      const collection = await getCollectionByDocId({
        data: { documentId: docId },
      });
      return collection;
    },
    enabled: !!documentId,
  });
