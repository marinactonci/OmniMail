import UseThreads from "@/hooks/use-threads";
import { format } from "date-fns";
import ThreadItem from "./thread-item";
import React, { useEffect, useState, useRef } from "react";

interface Props {
  searchQuery?: string;
}

export default function ThreadList({ searchQuery = "" }: Props) {
  const { threads, setThreadId, threadId } = UseThreads();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const threadsRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

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

  // Only update focusedIndex when threads or threadId changes
  useEffect(() => {
    if (!flatThreads.length) return;

    const currentIndex = threadId ? flatThreads.findIndex(thread => thread.id === threadId) : -1;
    setFocusedIndex(currentIndex !== -1 ? currentIndex : 0);
  }, [flatThreads, threadId]);

  // First thread selection on mount
  useEffect(() => {
    if (isInitialMount.current && flatThreads.length && !threadId) {
      setThreadId(flatThreads[0].id);
      isInitialMount.current = false;
    }
  }, [flatThreads, threadId, setThreadId]);

  // Keyboard navigation for threads
  const handleThreadNavigation = React.useCallback((direction: 'up' | 'down') => {
    if (!flatThreads.length) return;

    let newIndex;
    if (focusedIndex === -1) {
      if (direction === 'down') {
        newIndex = 0; // Start from the first thread
      } else { // direction === 'up'
        newIndex = flatThreads.length - 1; // Start from the last thread
      }
    } else {
      newIndex = direction === 'down'
        ? Math.min(focusedIndex + 1, flatThreads.length - 1)
        : Math.max(focusedIndex - 1, 0);
    }

    setFocusedIndex(newIndex);
    if (flatThreads[newIndex]) { // Check if thread exists at newIndex
        setThreadId(flatThreads[newIndex].id);
    }
  }, [flatThreads, focusedIndex, setFocusedIndex, setThreadId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      // Ignore key events if an input, textarea, select, or contentEditable element is focused
      if (activeEl instanceof HTMLElement &&
          (activeEl.tagName === 'INPUT' ||
           activeEl.tagName === 'TEXTAREA' ||
           activeEl.tagName === 'SELECT' ||
           activeEl.isContentEditable)
         ) {
        return;
      }

      if (e.key === 'j' || e.key === 'k') {
        e.preventDefault(); // Prevent default browser behavior (e.g., scrolling)
        handleThreadNavigation(e.key === 'j' ? 'down' : 'up');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Cleanup: remove event listener when the component unmounts
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleThreadNavigation]);

  // Reset focused index when search query changes
  useEffect(() => {
    setFocusedIndex(-1);
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
          {`No threads found for "${searchQuery}"˛`}
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
