import { cn } from "@/lib/utils";
import { TextSelection } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";

interface ToCItemData {
  id: string;
  level: number;
  textContent: string;
  isActive?: boolean;
  isScrolledOver?: boolean;
  itemIndex: number;
}

interface ToCItemProps {
  item: ToCItemData;
  onItemClick: (e: React.MouseEvent, id: string) => void;
  index: number;
}

interface ToCProps {
  items: ToCItemData[];
  editor: Editor | null;
}

export const ToCItem = ({ item, onItemClick }: ToCItemProps) => {
  return (
    <div
      className={cn(
        item.isActive && !item.isScrolledOver && "underline",
        item.isScrolledOver && "underline",
        "hover:underline",
      )}
      style={{
        paddingLeft: `${item.level}em`,
      }}
    >
      <a
        href={`#${item.id}`}
        onClick={(e) => onItemClick(e, item.id)}
        data-item-index={item.itemIndex}
      >
        {item.textContent}
      </a>
    </div>
  );
};

export const ToCEmptyState = () => {
  return (
    <div className="empty-state">
      <p>Start editing your document to see the outline.</p>
    </div>
  );
};

export const ToC = ({ items = [], editor }: ToCProps) => {
  if (items.length === 0) {
    return <ToCEmptyState />;
  }

  const onItemClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`);
      if (!element) return;
      const pos = editor.view.posAtDOM(element, 0);

      // set focus
      const tr = editor.view.state.tr;

      tr.setSelection(new TextSelection(tr.doc.resolve(pos)));

      editor.view.dispatch(tr);

      editor.view.focus();

      // eslint-disable-next-line
      if (history.pushState) {
        // eslint-disable-next-line
        history.pushState(null, "", `#${id}`);
      }

      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="ms-12 min-w-24">
      {items.map((item, i) => (
        <ToCItem
          onItemClick={onItemClick}
          key={item.id}
          item={item}
          index={i + 1}
        />
      ))}
    </div>
  );
};
