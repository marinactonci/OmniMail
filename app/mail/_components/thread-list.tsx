import UseThreads from "@/hooks/use-threads";
import { format } from "date-fns";
import ThreadItem from "./thread-item";
import React from "react";

interface Props {
  searchQuery?: string;
}

export default function ThreadList({ searchQuery = "" }: Props) {
  const { threads } = UseThreads();

  const filteredThreads = threads?.filter((thread) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();

    // Search in subject
    if (thread.subject?.toLowerCase().includes(searchLower)) return true;

    // Search in email body & body snippets
    if (thread.emails.some(email =>
      email.bodySnippet?.toLowerCase().includes(searchLower) ||
      email.body?.toLowerCase().includes(searchLower)
    )) return true;

    // Search in sender names and email addresses
    if (thread.emails.some(email =>
      email.from?.name?.toLowerCase().includes(searchLower) ||
      email.from?.address?.toLowerCase().includes(searchLower)
    )) return true;

    return false;
  });

  const groupedThreads = filteredThreads?.reduce((acc, thread) => {
    const date = format(
      thread.emails[0]?.sentAt ?? new Date(),
      "MMMM dd, yyyy"
    );
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(thread);
    return acc;
  }, {} as Record<string, typeof filteredThreads>);

  return (
    <div className="max-w-full overflow-y-scroll h-[calc(100vh-52px-125px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {Object.entries(groupedThreads ?? {}).map(([date, threads]) => {
          return (
            <React.Fragment key={date}>
              <div className="text-xs font-medium text-muted-foreground mt-5 first:mt-0">
                {date}
              </div>
              {threads.map((thread) => (
                <ThreadItem key={thread.id} thread={thread} />
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
