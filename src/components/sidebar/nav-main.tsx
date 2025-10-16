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
import { ChevronRight, LucideIcon, LucideProps, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { CreateCollectionForm } from "./create-collection-form";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDocument } from "@/utils/data/documents";
import { User } from "better-auth";
import { Collection, Document } from "@/utils/types";

const STORAGE_KEY = "doitwrite-collection-states";

function loadCollectionStates(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Error loading collection states:", error);
    return {};
  }
}

function saveCollectionStates(states: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch (error) {
    console.error("Error saving collection states:", error);
  }
}

export function NavMain({
  collections,
  user,
  documents,
}: {
  collections: Collection[];
  documents: Document[];
  user: User;
}) {
  const queryClient = useQueryClient();
  const [isCreatingNewDocument, setIsCreatingNewDocument] = useState(false);
  const [isCreatingNewCollection, setIsCreatingNewCollection] = useState(false);
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedStates = loadCollectionStates();
    setOpenStates(savedStates);
  }, []);

  useEffect(() => {
    saveCollectionStates(openStates);
  }, [openStates]);

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
          <Collapsible
            key={collection.id}
            asChild
            open={openStates[collection.id] ?? false}
            onOpenChange={(open) => {
              setOpenStates((prev) => ({
                ...prev,
                [collection.id]: open,
              }));
            }}
          >
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={collection.name}>
                <Link to="/collection/$id" params={{ id: collection.id }}>
                  <span>{collection.name}</span>
                </Link>
              </SidebarMenuButton>
              <div className="absolute top-1.5 right-8 flex items-center">
                <button
                  onClick={() => {
                    setIsCreatingNewDocument(true);
                    setOpenStates((prev) => ({
                      ...prev,
                      [collection.id]: true,
                    }));
                  }}
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
                      <SidebarMenuSubItem key={doc.id}>
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
        <Dialog
          open={isCreatingNewCollection}
          onOpenChange={() =>
            setIsCreatingNewCollection(!isCreatingNewCollection)
          }
        >
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
            <CreateCollectionForm
              closeDialog={() => setIsCreatingNewCollection(false)}
            />
          </DialogContent>
        </Dialog>
      </SidebarMenu>
    </SidebarGroup>
  );
}
