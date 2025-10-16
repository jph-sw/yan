import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { User } from "better-auth";
import { useEffect, useMemo } from "react";
import {
  Slash,
  SlashCmd,
  SlashCmdProvider,
  enableKeyboardNavigation,
} from "@harshtalks/slash-tiptap";
import { suggestions } from "./slash-command";
import { Placeholder } from "@tiptap/extensions";
import { TableKit } from "@tiptap/extension-table";
import { Markdown } from "@tiptap/markdown";
import { Button } from "../ui/button";
import { getRandomColor } from "@/lib/utils";
import FileHandler from "@tiptap/extension-file-handler";
import Image from "@tiptap/extension-image";

function useHocuspocus(documentId: string) {
  return useMemo(
    () =>
      new HocuspocusProvider({
        url: process.env.WS_URL || "ws://127.0.0.1:1234/collaboration",
        name: documentId,
      }),
    [documentId]
  );
}

export function Editor({
  document,
  user,
  isEditMode,
  setIsEditMode,
}: {
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
  user: User;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
}) {
  const provider = useHocuspocus(document.id);

  const editor = useEditor({
    editable: false,
    onUpdate(props) {
      setIsEditMode(props.editor.isEditable);
    },
    immediatelyRender: false,
    extensions: [
      Markdown,
      Image,
      Slash.configure({
        suggestion: {
          items: () => suggestions,
        },
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
    <div
      className="prose dark:prose-invert
          prose-table:w-full prose-table:outline prose-table:overflow-hidden prose-table:rounded-lg
          prose-thead:bg-muted
          prose-th:h-10 prose-th:px-6 prose-th:[&:not(:last-child)]:border-e prose-th:py-3 prose-th:font-medium prose-th:text-foreground prose-th:border-border
          prose-tr:border-b-2 prose-tr:border-border prose-tr:hover:bg-muted/50 prose-tr:transition-colors
          prose-td:p-4 prose-td:[&:not(:last-child)]:border-e
 prose-td:align-middle [&_td_p]:m-0 [&_th_p]:m-0"
    >
      <SlashCmdProvider>
        <EditorContent editor={editor} />
        <SlashCmd.Root editor={editor}>
          <SlashCmd.Cmd className="bg-secondary p-1 rounded-md w-50">
            <SlashCmd.Empty>No commands available</SlashCmd.Empty>
            <SlashCmd.List className="max-h-[300px] overflow-y-auto">
              {suggestions.map((item, index) => {
                return (
                  <SlashCmd.Item
                    value={item.title}
                    onCommand={(val) => {
                      item.command(val);
                    }}
                    key={item.title}
                    className="w-full rounded hover:bg-background focus:bg-background data-[selected=true]:bg-background outline-none px-2 py-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-sm">{item.title}</span>
                    </div>
                  </SlashCmd.Item>
                );
              })}
            </SlashCmd.List>
          </SlashCmd.Cmd>
        </SlashCmd.Root>
      </SlashCmdProvider>
    </div>
  );
}
