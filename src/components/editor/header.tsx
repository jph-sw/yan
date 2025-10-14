import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@tanstack/react-router";
import { FileIcon, NotebookTextIcon } from "lucide-react";
import { Button } from "../ui/button";

export function Header({
  collection,
  document,
  isEditMode,
  setIsEditMode,
}: {
  collection: {
    id: string;
    name: string;
    createdAt: Date | null;
  };
  document: {
    id: string;
    title: string;
    content: string;
    collectionId: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    createdBy: string | null;
    updatedBy: string | null;
  };
  isEditMode: boolean;
  setIsEditMode: (editMode: boolean) => void;
}) {
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
            onClick={() => setIsEditMode(false)}
            variant="default"
          >
            Save
          </Button>
        ) : (
          <Button
            size={"sm"}
            onClick={() => setIsEditMode(true)}
            variant={"outline"}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
