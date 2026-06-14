import type { ReactElement } from "react";
import type { Document } from "@/utils/types";
import { MoveDocumentForm } from "../forms/move-document-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

export function DocumentMoveDialog({
	document,
	children,
	onSubmit,
	open,
	onOpenChange,
}: {
	document: Document;
	children: ReactElement;
	onSubmit: () => void;
	open: boolean;
	onOpenChange: () => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger render={children}></DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Move document</DialogTitle>
					<DialogDescription>Select collection</DialogDescription>
				</DialogHeader>
				<MoveDocumentForm onSubmit={onSubmit} document={document} />
			</DialogContent>
		</Dialog>
	);
}
