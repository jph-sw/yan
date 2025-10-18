import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteCollection,
  getCollectionByIdQuery,
} from "@/utils/data/collections";
import { getDocumentsByCollectionIdQueryOptions } from "@/utils/data/documents";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { EllipsisVerticalIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const { data: documents } = useSuspenseQuery(
    getDocumentsByCollectionIdQueryOptions(params.id),
  );
  const { data: collection } = useSuspenseQuery(
    getCollectionByIdQuery(params.id),
  );
  return (
    <div className="w-full flex justify-center pt-24">
      <div className="max-w-4xl w-full">
        <div className="mb-4 px-4 flex justify-between">
          <div>
            <h1 className="text-2xl">{collection.name}</h1>
            <span className="text-muted-foreground text-sm">
              {collection.createdAt?.toLocaleString()}
            </span>
          </div>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Manage collection</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem variant={"destructive"}>
                      Delete collection
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  collection and all containing documents
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant={"destructive"}
                    onClick={async () => {
                      const res = await deleteCollection({
                        data: { id: collection.id },
                      });
                      if (res?.message) {
                        toast.error(res.message);
                      } else {
                        queryClient.invalidateQueries({
                          queryKey: ["collections"],
                        });
                        queryClient.invalidateQueries({
                          queryKey: ["documents"],
                        });
                        queryClient.invalidateQueries({
                          queryKey: ["favorites"],
                        });
                        navigate({ to: "/home" });
                      }
                    }}
                  >
                    Continue
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
