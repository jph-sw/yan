import { NotFound } from "@/components/NotFound";
import { documentByIdQueryOptions } from "@/utils/data/documents";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_pathlessLayout/doc/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    context.queryClient.ensureQueryData(documentByIdQueryOptions(params.id));
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { data: document } = useSuspenseQuery(
    documentByIdQueryOptions(params.id),
  );
  return <div>{document ? <div>{document.title}</div> : <NotFound />}</div>;
}
