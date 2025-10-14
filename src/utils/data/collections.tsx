import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { desc, eq } from "drizzle-orm";
import { collection, document } from "@/db/schema";
import z from "zod";
import { d } from "node_modules/drizzle-kit/index-BAUrj6Ib.mjs";

export const getCollections = createServerFn({ method: "GET" }).handler(
  async () => {
    const collections = await db
      .select()
      .from(collection)
      .orderBy(desc(collection.createdAt));
    return collections;
  },
);

export const collectionsQuery = queryOptions({
  queryKey: ["collections"],
  queryFn: async () => {
    const collections = await getCollections();
    return collections;
  },
});

export const createCollection = createServerFn({
  method: "POST",
})
  .inputValidator(
    z.object({
      name: z.string().min(1).max(100),
    }),
  )
  .handler(async ({ data }) => {
    console.log("Creating collection with name:", data.name);

    const newCollection = await db
      .insert(collection)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        createdAt: new Date(),
      })
      .returning();
    return newCollection[0];
  });

export const getCollectionById = createServerFn({
  method: "GET",
})
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
