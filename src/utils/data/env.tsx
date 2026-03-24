import { createServerFn } from "@tanstack/react-start";

export const getWsUrl = createServerFn({ method: "GET" }).handler(async () => {
	return process.env.WS_URL;
});
