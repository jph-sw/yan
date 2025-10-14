import { queryOptions } from "@tanstack/react-query";
import { getUserSession } from "../auth-functions";

export const useAuthQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...useAuthQueries.all, "user"],
      queryFn: () => getUserSession(),
      // queryFn: () => getUserId(),
    }),
};
