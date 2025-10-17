import { betterAuth } from "better-auth";
import { db } from "./db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";
import { admin } from "better-auth/plugins/admin";
import { createAuthMiddleware } from "better-auth/api";
import { account } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { validateDiscordUser } from "./auth-functions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),
  rateLimit: { enabled: false },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.includes("callback")) {
        if (ctx.context.newSession) {
          const accountRow = await db
            .select()
            .from(account)
            .where(
              and(
                eq(account.providerId, "discord"),
                eq(account.userId, ctx.context.newSession.user.id),
              ),
            )
            .get();

          if (accountRow) {
            const isValid: boolean = await validateDiscordUser({
              data: {
                accessToken: accountRow.accessToken || "",
                requiredGuildId: process.env.REQUIRED_GUILD_ID!,
                requiredRoleId: process.env.REQUIRED_ROLE_ID!,
              },
            });

            if (isValid) {
              console.log("can access");
            } else {
              ctx.context.internalAdapter.deleteUser(
                ctx.context.newSession.user.id,
              );
              ctx.redirect("/error?code=no_role");
            }
          }
        }
      }
    }),
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      scope: ["identify", "guilds", "guilds.members.read"],
    },
  },

  plugins: [admin()],
});
