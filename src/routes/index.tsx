import { getPublishedDocumentsQueryOptions } from "@/utils/data/documents";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(getPublishedDocumentsQueryOptions);
  },
});

function Home() {
  const { data: documents } = useSuspenseQuery(
    getPublishedDocumentsQueryOptions
  );

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <div className="mt-4 space-y-2">
          {documents && documents.length > 0 ? (
            documents.map((doc) => (
              <Link
                to="/p/$id"
                params={{ id: doc.id }}
                key={doc.id}
                className="flex justify-between hover:border-b"
              >
                <span>{doc.title}</span>
                <p className="text-sm text-gray-500">
                  Last updated: {doc.updatedAt?.toLocaleString()}
                </p>
              </Link>
            ))
          ) : (
            <p>No published documents available.</p>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
