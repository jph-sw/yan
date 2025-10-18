import { Extension, Editor, Range } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import slashSuggestion from "./slash-suggestion";

export default Extension.create({
  name: "commands",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        ...slashSuggestion,
      }),
    ];
  },
});
