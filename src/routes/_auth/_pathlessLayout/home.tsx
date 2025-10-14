import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthQueries } from "@/utils/data/auth-queries";
import { getDocumentsByUserIdQueryOptions } from "@/utils/data/documents";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_pathlessLayout/home")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const userSession = await context.queryClient.fetchQuery(
      useAuthQueries.user(),
    );

    context.queryClient.ensureQueryData(
      getDocumentsByUserIdQueryOptions(userSession?.user.id!),
    );

    return {
      user: userSession?.user,
    };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();
  const { data: myDocuments } = useSuspenseQuery(
    getDocumentsByUserIdQueryOptions(user?.id!),
  );

  return (
    <div className="w-full pt-24 flex justify-center">
      <div className="max-w-4xl w-full">
        <div className="mb-4 px-4">
          <h1 className="text-3xl font-semibold">Home</h1>
        </div>
        <div>
          <Tabs defaultValue={"mine"}>
            <TabsList className="mx-4">
              <TabsTrigger value="mine">Created by me</TabsTrigger>
            </TabsList>
            <TabsContent value="mine">
              {myDocuments.length === 0
                ? ""
                : myDocuments.map((doc) => (
                    <Link to="/doc/$id" params={{ id: doc.id }} key={doc.id}>
                      <div className="hover:bg-muted hover:rounded-md p-4">
                        <h2 className="text-xl">{doc.title}</h2>
                        <p className="text-sm text-gray-500">
                          Created at: {doc.createdAt?.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
