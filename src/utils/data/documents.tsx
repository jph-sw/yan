import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "../db";
import { document } from "@/db/schema";
import { queryOptions } from "@tanstack/react-query";
import { and, eq } from "drizzle-orm";

const documentObject = z.object({
  id: z.uuid().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  collectionId: z.string().min(1, "Collection ID is required"),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export const createDocument = createServerFn({ method: "POST" })
  .inputValidator(documentObject)
  .handler(async ({ data }) => {
    const newDocument = await db
      .insert(document)
      .values({
        id: crypto.randomUUID(),
        title: data.title,
        content: data.content || "",
        collectionId: data.collectionId,
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date(),
        createdBy: data.createdBy || null,
        updatedBy: data.updatedBy || null,
      })
      .returning()
      .get();
    return newDocument;
  });

export const getDocuments = createServerFn({ method: "GET" }).handler(
  async () => {
    const documents = await db.select().from(document).all();
    return documents;
  },
);

export const getDocumentById = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      id: z.string().min(1, "Document ID is required"),
    }),
  )
  .handler(async ({ data }) => {
    const doc = await db
      .select()
      .from(document)
      .where(eq(document.id, data.id))
      .get();
    return doc;
  });

export const getDocumentsByCollectionId = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({ collectionId: z.string().min(1, "Collection ID is required") }),
  )
  .handler(async ({ data }) => {
    const docs = await db
      .select()
      .from(document)
      .where(eq(document.collectionId, data.collectionId))
      .all();
    return docs;
  });

export const getDocumentsByUserId = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({ userId: z.string().min(1, "User ID is required") }),
  )
  .handler(async ({ data }) => {
    const docs = await db
      .select()
      .from(document)
      .where(eq(document.createdBy, data.userId))
      .all();
    return docs;
  });

export const publishDocument = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1, "Document ID is required"),
      published: z.boolean().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const updatedDoc = await db
      .update(document)
      .set({ published: data.published })
      .where(eq(document.id, data.id))
      .returning()
      .get();
    return updatedDoc;
  });

export const getPublishedDocuments = createServerFn({ method: "GET" }).handler(
  async () => {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.published, true))
      .all();
    return documents;
  },
);

export const getPublishedDocumentById = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      id: z.string().min(1, "Document ID is required"),
    }),
  )
  .handler(async ({ data }) => {
    const doc = await db
      .select()
      .from(document)
      .where(and(eq(document.id, data.id), eq(document.published, true)))
      .get();
    return doc;
  });

export const updateDocumentHtmlContent = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1, "Document ID is required"),
      htmlContent: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const doc = await db
      .update(document)
      .set({
        htmlContent: data.htmlContent,
      })
      .where(eq(document.id, data.id))
      .returning()
      .get();

    return doc;
  });

export const getPublishedDocumentByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["published-document", id],
    queryFn: async () => {
      return await getPublishedDocumentById({ data: { id } });
    },
    enabled: !!id,
  });

export const getPublishedDocumentsQueryOptions = queryOptions({
  queryKey: ["documents", "published"],
  queryFn: async () => {
    return await getPublishedDocuments();
  },
});

export const getDocumentsByUserIdQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["documents", "user", userId],
    queryFn: async () => {
      return await getDocumentsByUserId({ data: { userId } });
    },
    enabled: !!userId,
  });

export const getDocumentsByCollectionIdQueryOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ["documents", collectionId],
    queryFn: async () => {
      return await getDocumentsByCollectionId({ data: { collectionId } });
    },
    enabled: !!collectionId,
  });

export const documentsQueryOptions = queryOptions({
  queryKey: ["documents"],
  queryFn: async () => {
    return await getDocuments();
  },
});

export const documentByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["document", id],
    queryFn: async () => {
      return await getDocumentById({ data: { id } });
    },
    enabled: !!id,
  });
