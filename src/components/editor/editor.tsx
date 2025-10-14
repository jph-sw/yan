import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { User } from "better-auth";
import { useEffect } from "react";

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
  const provider = new HocuspocusProvider({
    url: "ws://127.0.0.1:1234/collaboration",
    name: document.id,
  });

  const editor = useEditor({
    editable: false,
    onUpdate(props) {
      setIsEditMode(props.editor.isEditable);
    },
    extensions: [
      StarterKit.configure({}),
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCaret.configure({
        provider: provider,
        user: {
          name: user.name,
          color: "#f783ac",
        },
      }),
    ],
  });

  useEffect(() => {
    editor?.setOptions({ editable: isEditMode || false });

    if (!isEditMode) {
      editor?.commands.focus("end");
    }
  }, [isEditMode, editor]);

  return (
    <div className="prose  dark:prose-invert">
      <EditorContent editor={editor} />
    </div>
  );
}
