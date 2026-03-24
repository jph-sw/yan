import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	beforeLoad: ({ context }) => {
		if (!context.userSession) {
			throw redirect({
				to: "/login",
			});
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return <Outlet />;
}
