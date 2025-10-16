import { collection, document } from "@/db/schema";

const collectiontype = collection.$inferSelect;
const documenttype = document.$inferSelect;

export type Document = typeof documenttype;
export type Collection = typeof collectiontype;
