import { Editor } from "@/components/editor/editor";
import { Header } from "@/components/editor/header";
import { NotFound } from "@/components/NotFound";
import { useAuthQueries } from "@/utils/data/auth-queries";
import { getCollectionByDocIdQuery } from "@/utils/data/collections";
import { documentByIdQueryOptions } from "@/utils/data/documents";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_auth/_pathlessLayout/doc/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const userSession = await context.queryClient.fetchQuery(
      useAuthQueries.user()
    );

    context.queryClient.ensureQueryData(documentByIdQueryOptions(params.id));
    context.queryClient.ensureQueryData(getCollectionByDocIdQuery(params.id));

    return {
      user: userSession?.user,
    };
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { user } = Route.useLoaderData();

  const [isEditMode, setIsEditMode] = useState(false);

  const { data: document } = useSuspenseQuery(
    documentByIdQueryOptions(params.id)
  );

  const { data: collection } = useSuspenseQuery(
    getCollectionByDocIdQuery(params.id)
  );

  return (
    <div className="w-full flex flex-col items-center py-4">
      <Header
        document={document!}
        collection={collection}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />
      {document ? (
        <div className="max-w-5xl w-full px-4 mt-4">
          <div id="content">{document.title}</div>
          <Editor
            key={document.id}
            document={document}
            user={user!}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
