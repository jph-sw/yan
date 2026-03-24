import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { and, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { account } from "@/db/schema";
import { validateDiscordUser } from "./auth-functions";
import { db } from "./db";
import { ac, admin, user } from "./permissions";

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
								requiredGuildId: process.env.REQUIRED_GUILD_ID ?? "",
								requiredRoleId: process.env.REQUIRED_ROLE_ID ?? "",
							},
						});

						if (isValid) {
							const adminIds =
								process.env.ADMIN_DISCORD_USER_IDS?.split(",") || [];
							if (adminIds.includes(accountRow.accountId ?? "")) {
								ctx.context.internalAdapter.updateUser(
									ctx.context.newSession.user.id,
									{
										role: "admin",
									},
								);
							}
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

	plugins: [
		adminPlugin({
			ac,
			roles: {
				admin,
				user,
			},
		}),
	],
});

export type User = typeof auth.$Infer.Session.user;
