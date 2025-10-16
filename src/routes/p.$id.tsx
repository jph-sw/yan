import { getPublishedDocumentByIdQueryOptions } from "@/utils/data/documents";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "node_modules/@tanstack/react-query/build/modern/useSuspenseQuery";

export const Route = createFileRoute("/p/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    // context.queryClient.ensureQueryData(
    //   getPublishedDocumentByIdQueryOptions(params.id)
    // );
  },
});

function RouteComponent() {
  // const { data: document } = useSuspenseQuery(
  //   getPublishedDocumentByIdQueryOptions(Route.useParams().id)
  // );
  const { data: document } = useQuery(
    getPublishedDocumentByIdQueryOptions(Route.useParams().id)
  );

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      {document && (
        <div className="max-w-4xl w-full">
          <h1 className="text-2xl font-semibold">{document.title}</h1>
        </div>
      )}
    </div>
  );
}
