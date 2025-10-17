import { collectionsQuery } from "@/utils/data/collections";
import { useAppForm } from "@/utils/form";
import { Collection, Document } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "../ui/sidebar";
import { Button } from "../ui/button";
import { updateDocumentCollectionId } from "@/utils/data/documents";

export function MoveDocumentForm({
  document,
  onSubmit,
}: {
  document: Document;
  onSubmit: () => void;
}) {
  const { data: collections, isPending } = useQuery(collectionsQuery);

  const [selectedCollection, setSelectedCollection] = useState<Collection>();

  const form = useAppForm({
    defaultValues: document,
    onSubmit: async () => {
      if (selectedCollection) {
        await updateDocumentCollectionId({
          data: { docId: document.id, collectionId: selectedCollection.id },
        });
        onSubmit();
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {isPending &&
        [1, 2, 3].map((idx) => (
          <div key={idx}>
            <Skeleton className="w-full h-5" />
          </div>
        ))}
      <div className="grid gap-1">
        {collections?.map((collection) => (
          <SidebarMenuButton
            type="button"
            role="checkbox"
            onClick={() => setSelectedCollection(collection)}
            className={cn(
              selectedCollection?.id === collection.id && "bg-muted border",
              "cursor-pointer",
            )}
            disabled={collection.id === document.collectionId}
          >
            {collection.name}
          </SidebarMenuButton>
        ))}
      </div>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <>
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Move document"}
            </Button>
          </>
        )}
      />
    </form>
  );
}
