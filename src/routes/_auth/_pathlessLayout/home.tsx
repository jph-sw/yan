import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthQueries } from "@/utils/data/auth-queries";
import { getDocumentsByUserIdQueryOptions } from "@/utils/data/documents";
import { getFavoritesQuery } from "@/utils/data/favorites";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_auth/_pathlessLayout/home")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const userSession = await context.queryClient.fetchQuery(
      useAuthQueries.user(),
    );

    context.queryClient.ensureQueryData(
      getDocumentsByUserIdQueryOptions(userSession?.user.id!),
    );

    context.queryClient.ensureQueryData(
      getFavoritesQuery(userSession?.user.id!),
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

  const { data: favorites } = useSuspenseQuery(getFavoritesQuery(user?.id!));

  return (
    <div className="w-full pt-24 flex justify-center">
      <div className="max-w-6xl w-full">
        <div className="mb-8 px-4 border-b pb-2">
          <h1 className="text-3xl font-semibold">Home</h1>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold px-4 mb-4">Favorites</h2>
            <div>
              {favorites.slice(0, 10).map((favorite) => (
                <div key={favorite.document.id}>
                  <Link
                    to="/doc/$id"
                    params={{ id: favorite.document.id }}
                    key={favorite.document.id}
                  >
                    <div className="hover:bg-muted hover:rounded-md p-4">
                      <h2 className="text-xl">{favorite.document.title}</h2>
                      <p className="text-sm text-gray-500">
                        Created at:{" "}
                        {favorite.document.createdAt?.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold px-4 mb-4">Created by me</h2>
            <div>
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
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
