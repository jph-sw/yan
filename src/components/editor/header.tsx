import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@tanstack/react-router";
import {
  EllipsisVerticalIcon,
  FileIcon,
  NotebookTextIcon,
  UploadIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Collection, Document } from "@/utils/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { publishDocument } from "@/utils/data/documents";
import { useQueryClient } from "@tanstack/react-query";

export function Header({
  collection,
  document,
  isEditMode,
  editModeChanged,
}: {
  collection: Collection;
  document: Document;
  isEditMode: boolean;
  editModeChanged: () => void;
}) {
  const queryClient = useQueryClient();

  const togglePublish = async () => {
    await publishDocument({
      data: { id: document.id, published: !document.published },
    });
    queryClient.invalidateQueries({ queryKey: ["document", document.id] });
  };

  return (
    <div className="w-full flex justify-between px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/home">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to="/collection/$id"
                params={{ id: collection.id }}
                className="flex items-center gap-1"
              >
                <NotebookTextIcon className="h-4 w-4" />
                {collection.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1">
              <FileIcon className="h-4 w-4" />
              {document.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-2">
        {isEditMode ? (
          <Button
            size={"sm"}
            onClick={() => editModeChanged()}
            variant="default"
          >
            Done
          </Button>
        ) : (
          <Button
            size={"sm"}
            onClick={() => editModeChanged()}
            variant={"outline"}
          >
            Edit
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant={"outline"}>
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-50">
            <DropdownMenuLabel>Document</DropdownMenuLabel>
            <DropdownMenuItem
              className={cn(document.published && "bg-muted")}
              onClick={(e) => {
                e.preventDefault();
                togglePublish();
              }}
            >
              {document.published ? "Unpublish" : "Publish"}
              <UploadIcon className="ml-auto" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>{" "}
      </div>
    </div>
  );
}
