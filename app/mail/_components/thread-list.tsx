import UseThreads from "@/hooks/use-threads";
import { format } from "date-fns";
import ThreadItem from "./thread-item";
import React, { useEffect, useState, useRef, useCallback } from "react";

interface Props {
  searchQuery?: string;
}

export default function ThreadList({ searchQuery = "" }: Props) {
  const { threads, setThreadId } = UseThreads();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const threadsRef = useRef<HTMLDivElement>(null);
  const lastSelectedId = useRef<string | null>(null);

  const filteredThreads = threads?.filter((thread) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    if (thread.subject?.toLowerCase().includes(searchLower)) return true;
    if (thread.emails.some((email) =>
      email.bodySnippet?.toLowerCase().includes(searchLower) ||
      email.body?.toLowerCase().includes(searchLower)
    )) return true;
    if (thread.emails.some((email) =>
      email.from?.name?.toLowerCase().includes(searchLower) ||
      email.from?.address?.toLowerCase().includes(searchLower)
    )) return true;
    return false;
  });

  const flatThreads = Object.values(filteredThreads ?? {}).flat();

  // Effect to handle thread selection after focus index changes
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < flatThreads.length) {
      const thread = flatThreads[focusedIndex];
      if (thread && thread.id !== lastSelectedId.current) {
        lastSelectedId.current = thread.id;
        setThreadId(thread.id);
        const threadElements = threadsRef.current?.querySelectorAll('button');
        threadElements?.[focusedIndex]?.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, flatThreads, setThreadId]);

  const handleThreadNavigation = useCallback((direction: 'up' | 'down') => {
    if (!flatThreads.length) return;

    setFocusedIndex(prev => {
      const newIndex = direction === 'down'
        ? Math.min(prev + 1, flatThreads.length - 1)
        : Math.max(prev - 1, 0);
      return newIndex;
    });
  }, [flatThreads]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'j' || e.key === 'k') {
        e.preventDefault();
        handleThreadNavigation(e.key === 'j' ? 'down' : 'up');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleThreadNavigation]);

  // Reset focused index when search query changes
  useEffect(() => {
    setFocusedIndex(-1);
    lastSelectedId.current = null;
  }, [searchQuery]);

  const groupedThreads = filteredThreads?.reduce((acc, thread) => {
    const date = format(thread.emails[0]?.sentAt ?? new Date(), "MMMM dd, yyyy");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(thread);
    return acc;
  }, {} as Record<string, typeof filteredThreads>);

  if (!threads?.length) {
    return (
      <div className="flex items-center justify-center h-full pt-12">
        <p className="text-sm text-muted-foreground">No threads found</p>
      </div>
    );
  }

  if (threads && !filteredThreads?.length) {
    return (
      <div className="flex items-center justify-center h-full pt-12">
        <p className="text-sm text-muted-foreground">
          No threads found for "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-y-scroll h-[calc(100vh-52px-125px)]">
      <div ref={threadsRef} className="flex flex-col gap-2 p-4 pt-0">
        {Object.entries(groupedThreads ?? {}).map(([date, threads]) => {
          return (
            <React.Fragment key={date}>
              <div className="text-xs font-medium text-muted-foreground mt-5 first:mt-0">
                {date}
              </div>
              {threads.map((thread) => (
                <ThreadItem
                  key={thread.id}
                  thread={thread}
                />
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
