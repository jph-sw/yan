import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { desc } from "drizzle-orm";
import { collection } from "@/db/schema";
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
      .values({ id: crypto.randomUUID(), name: data.name })
      .returning();
    return newCollection[0];
  });
