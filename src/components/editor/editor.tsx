import type { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import FileHandler from "@tiptap/extension-file-handler";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import { TableKit } from "@tiptap/extension-table";
import {
	getHierarchicalIndexes,
	type TableOfContentData,
	TableOfContents,
} from "@tiptap/extension-table-of-contents";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { User } from "better-auth";
import { memo, useEffect, useRef, useState } from "react";
import { getRandomColor } from "@/lib/utils";
import { createMentionSuggestion } from "./mention-suggestion";
import Commands from "./slash-command";
import slashSuggestion from "./slash-suggestion";
import { ToC } from "./table-of-contents";

const MemorizedToC = memo(ToC);

export function Editor({
	user,
	users,
	isEditMode,
	setIsEditMode,
	editModeChanged,
	setHtmlContent,
	provider,
}: {
	user: User;
	users: User[];
	isEditMode: boolean;
	setIsEditMode: (isEditMode: boolean) => void;
	editModeChanged: () => void;
	setHtmlContent: (content: string) => void;
	provider: HocuspocusProvider;
}) {
	const [items, setItems] = useState<TableOfContentData>(
		[] as TableOfContentData,
	);

	const editModeChangedRef = useRef(editModeChanged);

	useEffect(() => {
		editModeChangedRef.current = editModeChanged;
	}, [editModeChanged]);

	const editor = useEditor({
		editable: false,
		onUpdate(props) {
			setIsEditMode(props.editor.isEditable);
			setHtmlContent(editor?.getHTML() || "");
		},
		immediatelyRender: false,
		extensions: [
			Markdown.extend({
				addKeyboardShortcuts() {
					return {
						"Mod-s": () => {
							editModeChangedRef.current();
							return true;
						},
					};
				},
			}),
			Image,
			Mention.configure({
				HTMLAttributes: {
					class: "mention",
				},
				renderHTML({ node }) {
					return [
						"span",
						{
							class: "mention",
							"data-type": "mention",
							"data-id": node.attrs.id,
							"data-label": node.attrs.label,
						},
						`@${node.attrs.label}`,
					];
				},
				suggestion: createMentionSuggestion(users),
			}),
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
				onPaste: (currentEditor, files) => {
					files.forEach((file) => {
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
