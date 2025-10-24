import { CollaborativeEditor } from "@/components/editor/editor-collaborative";
import { Header } from "@/components/editor/header";
import { NotFound } from "@/components/NotFound";
import { useAuthQueries } from "@/utils/data/auth-queries";
import { getCollectionByDocIdQuery } from "@/utils/data/collections";
import {
  documentByIdQueryOptions,
  updateDocument,
} from "@/utils/data/documents";
import { getWsUrl } from "@/utils/data/env";
import { isFavoriteQuery } from "@/utils/data/favorites";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_auth/_pathlessLayout/doc/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const userSession = await context.queryClient.fetchQuery(
      useAuthQueries.user(),
    );

    const users = await context.queryClient.fetchQuery(useAuthQueries.users());

    await context.queryClient.ensureQueryData(
      documentByIdQueryOptions(params.id),
    );
    await context.queryClient.ensureQueryData(
      getCollectionByDocIdQuery(params.id),
    );
    await context.queryClient.ensureQueryData(isFavoriteQuery(params.id));

    const wsUrl = await getWsUrl();

    return {
      user: userSession?.user,
      users: users,
      wsUrl: wsUrl,
    };
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { user, users, wsUrl } = Route.useLoaderData();

  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  const { data: document } = useSuspenseQuery(
    documentByIdQueryOptions(params.id),
  );

  const { data: collection } = useSuspenseQuery(
    getCollectionByDocIdQuery(params.id),
  );

  const { data: isFavorite } = useSuspenseQuery(isFavoriteQuery(params.id));

  const editModeChanged = async () => {
    setIsEditMode(!isEditMode);
    await updateDocument({
      data: { id: params.id, htmlContent },
    });

    queryClient.invalidateQueries({ queryKey: ["document"] });
    queryClient.invalidateQueries({ queryKey: ["documents"] });
  };

  return (
    <div className="w-full flex flex-col items-center py-4">
      <Header
        document={document!}
        collection={collection}
        isEditMode={isEditMode}
        editModeChanged={editModeChanged}
        isFavorite={isFavorite}
      />
      {document ? (
        <div className="w-full px-4 mt-4">
          <div className="grid grid-cols-8 mb-4">
            <div className="col-span-2 min-w-full" />
            <div id="content" className="text-xl col-span-4">
              {document.title}
            </div>
            <div className="col-span-2" />
          </div>
          <CollaborativeEditor
            key={document.id}
            document={document}
            user={user!}
            users={users}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            editModeChanged={editModeChanged}
            setHtmlContent={setHtmlContent}
            wsUrl={wsUrl}
          />
          <div className="col-span-2" />
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
