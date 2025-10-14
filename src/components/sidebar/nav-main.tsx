import { Link } from "@tanstack/react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { ChevronRight, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { CreateCollectionForm } from "./create-collection-form";
import { useState } from "react";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDocument } from "@/utils/data/documents";
import { User } from "better-auth";

export function NavMain({
  collections,
  user,
  documents,
}: {
  collections: {
    id: string;
    name: string;
    createdAt: Date | null;
  }[];
  documents: {
    id: string;
    title: string;
    createdAt: Date | null;
    collectionId: string | null;
    createdBy: string | null;
    updatedBy: string | null;
    content: string;
  }[];
  user: User;
}) {
  const queryClient = useQueryClient();

  const [isCreatingNewDocument, setIsCreatingNewDocument] = useState(false);

  const createDocumentMutation = useMutation({
    mutationFn: async (data: { collectionId: string; title: string }) => {
      const res = await createDocument({
        data: {
          title: data.title,
          collectionId: data.collectionId,
          createdBy: user.id,
        },
      });

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarMenu>
        {collections.map((collection) => (
          <Collapsible key={collection.name} asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={collection.name}>
                <Link to="/collection/$id" params={{ id: collection.id }}>
                  <span>{collection.name}</span>
                </Link>
              </SidebarMenuButton>
              <div className="absolute top-1.5 right-8 flex items-center">
                <button
                  onClick={() => setIsCreatingNewDocument(true)}
                  className="flex aspect-square w-5 items-center justify-center rounded-md p-0 hover:bg-sidebar-accent"
                >
                  <PlusIcon className="size-4" />
                </button>
              </div>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="data-[state=open]:rotate-90">
                  <ChevronRight />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {/* Future sub-items can go here */}
                  {isCreatingNewDocument && (
                    <SidebarMenuSubItem key={"new_item"}>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsCreatingNewDocument(false);
                          createDocumentMutation.mutate({
                            title: (e.target as any).title.value,
                            collectionId: collection.id,
                          });
                        }}
                      >
                        <SidebarMenuSubButton asChild>
                          <Input autoFocus name="title" />
                        </SidebarMenuSubButton>
                      </form>
                    </SidebarMenuSubItem>
                  )}
                  {documents
                    .filter((doc) => doc.collectionId === collection.id)
                    .map((doc) => (
                      <SidebarMenuSubItem key={doc.title}>
                        <SidebarMenuSubButton asChild>
                          <Link to="/doc/$id" params={{ id: doc.id }}>
                            <span>{doc.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <PlusIcon />
                <span>New collection</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>New collection</DialogHeader>
            <DialogDescription>
              Here you can create a new content collection
            </DialogDescription>
            {/* Form for creating a new collection would go here */}
            <CreateCollectionForm />
          </DialogContent>
        </Dialog>
      </SidebarMenu>
    </SidebarGroup>
  );
}
