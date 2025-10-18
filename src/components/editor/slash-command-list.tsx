import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { cn } from "@/lib/utils";

interface Item {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  [key: string]: any;
}

interface SlashCommandListProps {
  items: Item[];
  command: (item: Item) => void;
}

export interface SlashCommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const SlashCommandList = forwardRef<SlashCommandListRef, SlashCommandListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    const upHandler = () => {
      setSelectedIndex(
        (prevIndex) => (prevIndex + items.length - 1) % items.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    };

    const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    };

    useImperativeHandle(ref, () => ({
      onKeyDown,
    }));

    return (
      <div className="w-60 max-h-80 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
        {items.length > 0 ? (
          items.map((item, index) => (
            <button
              key={index}
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                index === selectedIndex && "bg-accent text-accent-foreground",
              )}
              onClick={() => selectItem(index)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </button>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No result
          </div>
        )}
      </div>
    );
  },
);

SlashCommandList.displayName = "SlashCommandList";

export default SlashCommandList;
