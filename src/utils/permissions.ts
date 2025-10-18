import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";
import z from "zod";

const statement = {
  ...defaultStatements,

  collection: ["create", "delete"],
} as const;

export const statementSchema = z
  .object({
    collection: z.array(z.enum(["create", "delete"])).optional(),
  })
  .catchall(z.array(z.string()).optional())
  .partial();

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  collection: ["create"],
  ...userAc.statements,
});
export const admin = ac.newRole({
  collection: ["create", "delete"],
  ...adminAc.statements,
});
