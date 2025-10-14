import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthQueries } from "@/utils/data/auth-queries";
import { collectionsQuery } from "@/utils/data/collections";
import { documentsQueryOptions } from "@/utils/data/documents";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_pathlessLayout")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const userSession = await context.queryClient.fetchQuery(
      useAuthQueries.user(),
    );

    context.queryClient.ensureQueryData(collectionsQuery);
    context.queryClient.ensureQueryData(documentsQueryOptions);

    return {
      user: userSession?.user,
    };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();

  const { data: collections } = useSuspenseQuery(collectionsQuery);
  const { data: documents } = useSuspenseQuery(documentsQueryOptions);

  return (
    <SidebarProvider>
      <AppSidebar
        collections={collections}
        user={user!}
        documents={documents}
      />
      <main className="flex h-full flex-1 flex-col">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
