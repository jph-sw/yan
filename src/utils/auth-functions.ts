import { createServerFn } from "@tanstack/react-start";
import { auth } from "./auth";
import { getRequestHeaders } from "@tanstack/react-start/server";

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
