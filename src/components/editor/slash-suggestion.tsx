import { computePosition, flip, shift } from "@floating-ui/dom";
import { posToDOMRect } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import { Editor, Range } from "@tiptap/core";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  FileCode,
} from "lucide-react";

import SlashCommandList, { SlashCommandListRef } from "./slash-command-list";

interface CommandItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  command: (params: { editor: Editor; range: Range }) => void;
}

interface SuggestionProps {
  editor: Editor;
  range: Range;
  query: string;
  clientRect?: () => DOMRect | null;
}

const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to,
      ),
  };

  computePosition(virtualElement, element, {
    placement: "bottom-start",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = "max-content";
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  });
};

export default {
  items: ({ query }: { query: string }): CommandItem[] => {
    return [
      {
        title: "Heading 1",
        icon: Heading1,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 1 })
            .run();
        },
      },
      {
        title: "Heading 2",
        icon: Heading2,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 2 })
            .run();
        },
      },
      {
        title: "Heading 3",
        icon: Heading3,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 3 })
            .run();
        },
      },
      {
        title: "Bold",
        icon: Bold,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setMark("bold").run();
        },
      },
      {
        title: "Italic",
        icon: Italic,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setMark("italic").run();
        },
      },
      {
        title: "Code",
        icon: Code,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setMark("code").run();
        },
      },
      {
        title: "Bullet List",
        icon: List,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "Numbered List",
        icon: ListOrdered,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "Quote",
        icon: Quote,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setBlockquote().run();
        },
      },
      {
        title: "Code Block",
        icon: FileCode,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).setCodeBlock().run();
        },
      },
    ]
      .filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase()),
      )
      .slice(0, 10);
  },

  render: () => {
    let component: ReactRenderer<SlashCommandListRef> | null = null;

    return {
      onStart: (props: SuggestionProps & { items: CommandItem[] }) => {
        component = new ReactRenderer(SlashCommandList, {
          props: {
            items: props.items,
            command: (item: CommandItem) => {
              item.command({ editor: props.editor, range: props.range });
            },
          },
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        const element = component.element;
        element.style.position = "absolute";
        element.style.zIndex = "1000";

        document.body.appendChild(element);
        updatePosition(props.editor, element);
      },

      onUpdate: (props: SuggestionProps & { items: CommandItem[] }) => {
        if (!component) return;

        component.updateProps({
          items: props.items,
          command: (item: CommandItem) => {
            item.command({ editor: props.editor, range: props.range });
          },
        });

        if (!props.clientRect) {
          return;
        }

        updatePosition(props.editor, component.element);
      },

      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (!component?.ref) return false;

        if (props.event.key === "Escape") {
          component.destroy();
          return true;
        }

        return component.ref.onKeyDown(props);
      },

      onExit: () => {
        if (component) {
          component.destroy();
        }
      },
    };
  },
};
