import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { collectionsQuery } from "@/utils/data/collections";
import { updateDocument } from "@/utils/data/documents";
import { useAppForm } from "@/utils/form";
import type { Collection, Document } from "@/utils/types";
import { Button } from "../ui/button";
import { SidebarMenuButton } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

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
				await updateDocument({
					data: { id: document.id, collectionId: selectedCollection.id },
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
