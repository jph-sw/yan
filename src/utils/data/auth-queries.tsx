import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getUsers, getUserSession } from "../auth-functions";
import { auth } from "../auth";
import { User } from "lucide-react";

export const useAuthQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...useAuthQueries.all, "user"],
      queryFn: async () => {
        try {
          return await getUserSession();
        } catch (error) {
          console.error("Error fetching user session:", error);
          return null;
        }
      },
    }),
  users: () =>
    queryOptions({
      queryKey: [...useAuthQueries.all, "users"],
      queryFn: () => getUsers(),
    }),
};
