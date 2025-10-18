import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { User } from "better-auth";
import { memo, useEffect, useMemo, useState } from "react";
import {
  Slash,
  SlashCmd,
  SlashCmdProvider,
  enableKeyboardNavigation,
} from "@harshtalks/slash-tiptap";
import { Placeholder } from "@tiptap/extensions";
import { TableKit } from "@tiptap/extension-table";
import { Markdown } from "@tiptap/markdown";
import { getRandomColor } from "@/lib/utils";
import FileHandler from "@tiptap/extension-file-handler";
import Image from "@tiptap/extension-image";
import { Document } from "@/utils/types";
import {
  getHierarchicalIndexes,
  TableOfContentData,
  TableOfContents,
} from "@tiptap/extension-table-of-contents";
import { ToC } from "./table-of-contents";
import Commands from "./slash-command";
import slashSuggestion from "./slash-suggestion";

const MemorizedToC = memo(ToC);

function useHocuspocus(documentId: string) {
  return useMemo(
    () =>
      new HocuspocusProvider({
        url: process.env.WS_URL || "ws://localhost:1234",
        name: documentId,
      }),
    [documentId],
  );
}

export function Editor({
  document,
  user,
  isEditMode,
  setIsEditMode,
  setMdContent,
}: {
  document: Document;
  user: User;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  setMdContent: (content: string) => void;
}) {
  const provider = useHocuspocus(document.id);
  const [items, setItems] = useState<TableOfContentData>(
    [] as TableOfContentData,
  );

  const editor = useEditor({
    editable: false,
    onUpdate(props) {
      setIsEditMode(props.editor.isEditable);
      setMdContent(editor?.getHTML() || "");
    },
    immediatelyRender: false,
    extensions: [
      Markdown,
      Image,
      Commands.configure({
        slashSuggestion,
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      Placeholder.configure({
        placeholder: "Press / to see available commands",
      }),
      StarterKit.configure({}),
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCaret.configure({
        provider: provider,
        user: {
          name: user.name,
          color: getRandomColor(),
        },
      }),
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              console.log(htmlContent); // eslint-disable-line no-console
              return false;
            }

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setItems(content);
        },
      }),
    ],
    editorProps: {
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v),
      },
    },
  });

  useEffect(() => {
    editor?.setOptions({ editable: isEditMode || false });

    if (!isEditMode) {
      editor?.commands.focus("end");
    }
  }, [isEditMode, editor]);

  return (
    <div className="grid grid-cols-8">
      <div className="col-span-2" />
      <div
        className="col-span-4 min-w-full prose dark:prose-invert
          prose-table:w-full prose-table:outline prose-table:overflow-hidden prose-table:rounded-lg
          prose-thead:bg-muted
          prose-th:h-10 prose-th:px-6 prose-th:[&:not(:last-child)]:border-e prose-th:py-3 prose-th:font-medium prose-th:text-foreground prose-th:border-border
          prose-tr:border-b-2 prose-tr:border-border prose-tr:hover:bg-muted/50 prose-tr:transition-colors
          prose-td:p-4 prose-td:[&:not(:last-child)]:border-e
 prose-td:align-middle [&_td_p]:m-0 [&_th_p]:m-0"
      >
        <EditorContent editor={editor} />
      </div>
      <div className="col-span-2">
        <MemorizedToC editor={editor} items={items} />
      </div>
    </div>
  );
}
