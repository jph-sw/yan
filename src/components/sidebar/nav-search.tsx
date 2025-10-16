import { Collection, Document } from "@/utils/types";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { SearchIcon } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useMemo } from "react";
import Fuse from "fuse.js";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export function NavSearch({
  collections,
  documents,
}: {
  collections: Collection[];
  documents: Document[];
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setActiveIndex(0);
    } else {
      setSearch("");
    }
  }, [open]);

  const docFuse = useMemo(
    () =>
      new Fuse(documents, {
        keys: ["title"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [documents]
  );
  const colFuse = useMemo(
    () =>
      new Fuse(collections, {
        keys: ["name"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [collections]
  );

  const filteredDocuments = search.trim()
    ? docFuse.search(search).map((r) => r.item)
    : documents;
  const filteredCollections = search.trim()
    ? colFuse.search(search).map((r) => r.item)
    : collections;

  const results = [
    ...filteredDocuments.map((doc) => ({
      type: "doc" as const,
      id: doc.id,
      label: doc.title,
      to: "/doc/$id",
      params: { id: doc.id },
    })),
    ...filteredCollections.map((col) => ({
      type: "collection" as const,
      id: col.id,
      label: col.name,
      to: "/collection/$id",
      params: { id: col.id },
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
      scrollToActive();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
      scrollToActive();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) {
        navigate({
          to: results[activeIndex].to,
          params: results[activeIndex].params,
        });
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const scrollToActive = () => {
    setTimeout(() => {
      const el = resultsRef.current?.querySelector(
        `[data-idx='${activeIndex}']`
      ) as HTMLElement | null;
      el?.scrollIntoView({ block: "nearest" });
    }, 10);
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => setOpen(true)}>
          <SearchIcon />
          Search
        </SidebarMenuButton>
      </SidebarMenuItem>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput
            ref={inputRef}
            placeholder="Search documents and collections..."
            value={search}
            onValueChange={setSearch}
            onKeyDown={handleKeyDown}
          />
          <ScrollArea ref={resultsRef} className="h-70">
            <CommandList className="overflow-hidden">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Documents">
                {filteredDocuments.map((doc, idx) => {
                  const globalIdx = idx;
                  return (
                    <CommandItem
                      key={`doc-${doc.id}`}
                      id={`doc-${doc.id}`}
                      data-idx={globalIdx}
                      className={
                        activeIndex === globalIdx
                          ? "py-1 bg-accent text-accent-foreground"
                          : "py-1"
                      }
                      asChild
                      style={{ paddingBlock: "0.4rem" }}
                      onMouseEnter={() => setActiveIndex(globalIdx)}
                      onSelect={() => {
                        navigate({ to: "/doc/$id", params: { id: doc.id } });
                        setOpen(false);
                      }}
                    >
                      <Link to={"/doc/$id"} params={{ id: doc.id }}>
                        {doc.title}
                      </Link>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandGroup heading="Collections">
                {filteredCollections.map((col, idx) => {
                  const globalIdx = filteredDocuments.length + idx;
                  return (
                    <CommandItem
                      key={`collection-${col.id}`}
                      id={`collection-${col.id}`}
                      data-idx={globalIdx}
                      className={
                        activeIndex === globalIdx
                          ? "py-1 bg-accent text-accent-foreground"
                          : "py-1"
                      }
                      asChild
                      style={{ paddingBlock: "0.4rem" }}
                      onMouseEnter={() => setActiveIndex(globalIdx)}
                      onSelect={() => {
                        navigate({
                          to: "/collection/$id",
                          params: { id: col.id },
                        });
                        setOpen(false);
                      }}
                    >
                      <Link to={"/collection/$id"} params={{ id: col.id }}>
                        {col.name}
                      </Link>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <ScrollBar orientation="vertical" />
            </CommandList>
          </ScrollArea>
        </Command>
      </CommandDialog>
    </>
  );
}
