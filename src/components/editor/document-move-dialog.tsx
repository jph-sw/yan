import { ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { MoveDocumentForm } from "../forms/move-document-form";
import { Document } from "@/utils/types";

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
      <DialogTrigger asChild>{children}</DialogTrigger>
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
