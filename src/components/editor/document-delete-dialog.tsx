import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { toast } from "sonner";
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
import { deleteDocument } from "@/utils/data/documents";
import type { Document } from "@/utils/types";

export function DocumentDeleteDialog({
	document,
	children,
	onCancel,
	open,
	onOpenChange,
}: {
	document: Document;
	children: ReactElement;
	onCancel?: () => void;
	open: boolean;
	onOpenChange: () => void;
}) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger render={
        children
			}></AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							const res = await deleteDocument({ data: { id: document.id } });

							if (res?.message) {
								toast.error(res?.message);
							} else {
								queryClient.invalidateQueries({ queryKey: ["documents"] });
								navigate({
									to: "/collection/$id",
									params: { id: document.collectionId },
								});
								toast.success("Successfully deleted document");
							}
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
