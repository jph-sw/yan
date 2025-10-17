import { Editor } from "@/components/editor/editor";
import { Header } from "@/components/editor/header";
import { NotFound } from "@/components/NotFound";
import { useAuthQueries } from "@/utils/data/auth-queries";
import { getCollectionByDocIdQuery } from "@/utils/data/collections";
import {
  documentByIdQueryOptions,
  updateDocumentHtmlContent,
} from "@/utils/data/documents";
import { isFavoriteQuery } from "@/utils/data/favorites";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_auth/_pathlessLayout/doc/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const userSession = await context.queryClient.fetchQuery(
      useAuthQueries.user(),
    );

    context.queryClient.ensureQueryData(documentByIdQueryOptions(params.id));
    context.queryClient.ensureQueryData(getCollectionByDocIdQuery(params.id));
    context.queryClient.ensureQueryData(isFavoriteQuery(params.id));

    return {
      user: userSession?.user,
    };
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { user } = Route.useLoaderData();

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
  };

  useEffect(() => {
    const save = async () => {
      const res = updateDocumentHtmlContent({
        data: { id: params.id, htmlContent: htmlContent },
      });
    };

    save().catch(console.error);
  }, [htmlContent]);

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
          <Editor
            key={document.id}
            document={document}
            user={user!}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            setMdContent={setHtmlContent}
          />
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
