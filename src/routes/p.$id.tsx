import { getPublishedDocumentByIdQueryOptions } from "@/utils/data/documents";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "node_modules/@tanstack/react-query/build/modern/useSuspenseQuery";

export const Route = createFileRoute("/p/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: document } = useQuery(
    getPublishedDocumentByIdQueryOptions(Route.useParams().id),
  );

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      {document && (
        <div className="max-w-4xl w-full">
          <h1 className="text-2xl font-semibold">{document.title}</h1>
          <div
            className="prose dark:prose-invert
              prose-table:w-full prose-table:outline prose-table:overflow-hidden prose-table:rounded-lg
              prose-thead:bg-muted
              prose-th:h-10 prose-th:px-6 prose-th:[&:not(:last-child)]:border-e prose-th:py-3 prose-th:font-medium prose-th:text-foreground prose-th:border-border
              prose-tr:border-b-2 prose-tr:border-border prose-tr:hover:bg-muted/50 prose-tr:transition-colors
              prose-td:p-4 prose-td:[&:not(:last-child)]:border-e
     prose-td:align-middle [&_td_p]:m-0 [&_th_p]:m-0"
          >
            <div
              dangerouslySetInnerHTML={{ __html: document.htmlContent || "" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
