import UseThreads from "@/hooks/use-threads";
import { format } from "date-fns";
import ThreadItem from "./thread-item";
import React from "react";

export default function ThreadList() {
  const { threads } = UseThreads();

  const groupedThreads = threads?.reduce((acc, thread) => {
    const date = format(
      thread.emails[0]?.sentAt ?? new Date(),
      "MMMM dd, yyyy"
    );
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(thread);
    return acc;
  }, {} as Record<string, typeof threads>);

  return (
    <div className="max-w-full overflow-y-scroll h-[calc(100vh-52px-100px)]">
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
