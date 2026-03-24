import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuthQueries } from "@/utils/data/auth-queries";
import { collectionsQuery } from "@/utils/data/collections";
import { documentsQueryOptions } from "@/utils/data/documents";

export const Route = createFileRoute("/_auth/_pathlessLayout")({
	component: RouteComponent,
	loader: async ({ context }) => {
		try {
			const userSession = await context.queryClient.fetchQuery(
				useAuthQueries.user(),
			);

			await context.queryClient.ensureQueryData(collectionsQuery);
			await context.queryClient.ensureQueryData(documentsQueryOptions);

			return {
				user: userSession?.user,
			};
		} catch (error) {
			console.error("Error loading auth layout data:", error);
			// Re-throw to let TanStack Router handle it
			throw error;
		}
	},
});

function RouteComponent() {
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	if (!user) {
		throw navigate({ to: "/login" });
	}

	const { data: collections } = useSuspenseQuery(collectionsQuery);
	const { data: documents } = useSuspenseQuery(documentsQueryOptions);

	return (
		<SidebarProvider>
			<AppSidebar collections={collections} user={user} documents={documents} />
			<main className="flex h-full flex-1 flex-col">
				<Outlet />
				<Toaster />
			</main>
		</SidebarProvider>
	);
}
