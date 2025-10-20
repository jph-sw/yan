import { computePosition, flip, shift } from "@floating-ui/dom";
import { posToDOMRect } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import type { SuggestionProps } from "@tiptap/suggestion";
import type { User } from "better-auth";
import MentionList, { type MentionListRef } from "./mention-list";

interface MentionUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const convertToMentionUser = (user: User): MentionUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.image || undefined,
});

const filterUsers = (users: MentionUser[], query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery),
    )
    .slice(0, 10);
};

const updatePopoverPosition = (
  editor: SuggestionProps["editor"],
  element: HTMLElement,
) => {
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
    Object.assign(element.style, {
      width: "max-content",
      position: strategy,
      left: `${x}px`,
      top: `${y}px`,
    });
  });
};

export const createMentionSuggestion = (users: User[]) => {
  const mentionUsers = users.map(convertToMentionUser);

  return {
    items: ({ query }: { query: string }) => {
      return filterUsers(mentionUsers, query);
    },

    render: () => {
      let component: ReactRenderer<MentionListRef> | null = null;

      const insertMention = (props: SuggestionProps, item: MentionUser) => {
        props.editor
          .chain()
          .focus()
          .deleteRange(props.range)
          .insertContent({
            type: "mention",
            attrs: {
              id: item.id,
              label: item.name,
            },
          })
          .run();
      };

      return {
        onStart: (props: SuggestionProps) => {
          component = new ReactRenderer(MentionList, {
            props: {
              items: props.items,
              command: (item: MentionUser) => insertMention(props, item),
            },
            editor: props.editor,
          });

          if (!props.clientRect) return;

          const element = component.element;
          element.style.position = "absolute";
          element.style.zIndex = "1000";

          document.body.appendChild(element);
          updatePopoverPosition(props.editor, element);
        },

        onUpdate: (props: SuggestionProps) => {
          if (!component) return;

          component.updateProps({
            items: props.items,
            command: (item: MentionUser) => insertMention(props, item),
          });

          if (props.clientRect) {
            updatePopoverPosition(props.editor, component.element);
          }
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
          component?.destroy();
        },
      };
    },
  };
};
