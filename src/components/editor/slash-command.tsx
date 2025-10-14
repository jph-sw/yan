import {
  createSuggestionsItems,
  enableKeyboardNavigation,
} from "@harshtalks/slash-tiptap";
import {
  Heading1,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Bold,
  Italic,
  Link,
  Image,
  Table,
  StrikethroughIcon,
} from "lucide-react";

export const suggestions = createSuggestionsItems([
  {
    title: "Heading 1",
    icon: <Heading1 className="w-4 h-4" />,
    searchTerms: ["h1", "header", "heading", "large"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 1 })
        .run();
    },
  },
  {
    title: "Heading 2",
    icon: <Heading2 className="w-4 h-4" />,
    searchTerms: ["h2", "header", "heading", "medium"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    icon: <Heading3 className="w-4 h-4" />,
    searchTerms: ["h3", "header", "heading", "small"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 3 })
        .run();
    },
  },
  {
    title: "Text",
    icon: <Type className="w-4 h-4" />,
    searchTerms: ["paragraph", "text", "normal"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "Bullet List",
    icon: <List className="w-4 h-4" />,
    searchTerms: ["unordered", "point", "bullets"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Ordered List",
    icon: <ListOrdered className="w-4 h-4" />,
    searchTerms: ["ordered", "number", "numbered"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    icon: <Quote className="w-4 h-4" />,
    searchTerms: ["blockquote", "cite", "quotation"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    icon: <Code2 className="w-4 h-4" />,
    searchTerms: ["codeblock", "fence", "pre"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "Horizontal Rule",
    icon: <Minus className="w-4 h-4" />,
    searchTerms: ["divider", "hr", "line", "break"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: "Bold",
    icon: <Bold className="w-4 h-4" />,
    searchTerms: ["strong", "heavy", "b"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBold().run();
    },
  },
  {
    title: "Italic",
    icon: <Italic className="w-4 h-4" />,
    searchTerms: ["em", "emphasis", "i"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleItalic().run();
    },
  },
  {
    title: "Strike",
    icon: <StrikethroughIcon className="w-4 h-4" />,
    searchTerms: ["strikethrough", "delete", "remove"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleStrike().run();
    },
  },
  {
    title: "Table",
    icon: <Table className="w-4 h-4" />,
    searchTerms: ["table", "grid", "spreadsheet"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
]);
