import { queryOptions } from "@tanstack/react-query";
import { getUserSession } from "../auth-functions";
import { getUsers } from "./documents";

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
