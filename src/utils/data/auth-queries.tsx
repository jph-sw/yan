import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getUsers, getUserSession } from "../auth-functions";
import { auth } from "../auth";
import { User } from "lucide-react";

export const useAuthQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...useAuthQueries.all, "user"],
      queryFn: () => getUserSession(),
      // queryFn: () => getUserId(),
    }),
  users: () =>
    queryOptions({
      queryKey: [...useAuthQueries.all, "users"],
      queryFn: () => getUsers(),
    }),
};
