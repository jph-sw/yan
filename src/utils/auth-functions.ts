import { createServerFn } from "@tanstack/react-start";
import { auth } from "./auth";
import { getRequestHeaders } from "@tanstack/react-start/server";
import z from "zod";
import { statementSchema } from "./permissions";
import { userRequiredMiddleware } from "./auth-middleware";

export const getUserSession = createServerFn({
  method: "GET",
}).handler(async () => {
  const userSession = await auth.api.getSession({
    headers: getRequestHeaders(),
  });

  if (!userSession) {
    return null;
  }

  return {
    user: userSession.user,
    session: userSession.session,
  };
});

export const getUsers = createServerFn({
  method: "GET",
}).handler(async () => {
  const users = await auth.api.listUsers({
    query: {},
    headers: getRequestHeaders(),
  });
  return users;
});

export const validateDiscordUser = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      accessToken: z.string().min(1, "accessToken is required"),
      requiredGuildId: z.string().min(1, "requiredGuildId is required"),
      requiredRoleId: z.string().min(1, "requiredRoleId is required"),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const guildsResponse = await fetch(
        "https://discord.com/api/users/@me/guilds",
        {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        },
      );

      if (!guildsResponse.ok) return false;

      const guilds = await guildsResponse.json();
      const isMember = guilds.some((g: any) => g.id === data.requiredGuildId);

      if (!isMember) return false;

      const memberResponse = await fetch(
        `https://discord.com/api/users/@me/guilds/${data.requiredGuildId}/member`,
        {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        },
      );

      if (!memberResponse.ok) return false;

      const member = await memberResponse.json();
      return member.roles?.includes(data.requiredRoleId) || false;
    } catch (error) {
      console.error("Discord validation error:", error);
      return false;
    }
  });

export const hasPermissions = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      ...statementSchema.shape,
      userId: z.string(),
      role: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { userId, role, ...permissions } = data;

    const res = await auth.api.userHasPermission({
      body: {
        userId,
        role: role as "user" | "admin" | undefined,
        permissions,
      },
    });

    if (res.success) {
      return true;
    } else {
      return false;
    }
  });
