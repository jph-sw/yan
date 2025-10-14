import { getCollectionByIdQuery } from "@/utils/data/collections";
import { getDocumentsByCollectionIdQueryOptions } from "@/utils/data/documents";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_pathlessLayout/collection/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    context.queryClient.ensureQueryData(getCollectionByIdQuery(params.id));
    context.queryClient.ensureQueryData(
      getDocumentsByCollectionIdQueryOptions(params.id),
    );
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { data: documents } = useSuspenseQuery(
    getDocumentsByCollectionIdQueryOptions(params.id),
  );
  const { data: collection } = useSuspenseQuery(
    getCollectionByIdQuery(params.id),
  );
  return (
    <div className="w-full flex justify-center pt-24">
      <div className="max-w-4xl w-full">
        <div className="mb-4 px-4">
          <h1 className="text-2xl">{collection.name}</h1>
          <span className="text-muted-foreground text-sm">
            {collection.createdAt?.toLocaleString()}
          </span>
        </div>
        <div>
          {documents.map((doc) => (
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
    </div>
  );
}
