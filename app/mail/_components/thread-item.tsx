import { Badge } from "@/components/ui/badge";
import UseThreads from "@/hooks/use-threads";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import React, { ComponentProps } from "react";

type Props = {
  thread: any;
};

export default function ThreadItem({ thread }: Props) {
  const { threadId, setThreadId } = UseThreads();

  function getBadgeVariantFromLabel(
    label: string
  ): ComponentProps<typeof Badge>["variant"] {
    if (["work"].includes(label.toLowerCase())) {
      return "default";
    }

    return "secondary";
  }

  return (
    <button
      key={thread.id}
      onClick={() => {
        setThreadId(thread.id);
      }}
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all relative hover:cursor-pointer",
        thread.id === threadId && "bg-accent"
      )}
    >
      <div className="flex flex-col w-full gap-2">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-bold">{thread.emails.at(-1)?.from.name}</div>
          </div>
          <div className={cn("ml-auto text-xs")}>
            {formatDistanceToNow(thread.emails.at(-1)?.sentAt ?? new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className="text-xs font-medium">{thread.subject}</div>
      </div>
      <div
        className="text-xs line-clamp-2 text-muted-foreground"
        dangerouslySetInnerHTML={{
          __html: thread.emails.at(-1)?.bodySnippet ?? "",
        }}
      ></div>
      {thread.emails.at(-1)?.sysLabels.length && (
        <div className="flex items-center gap-2">
          {thread.emails.at(-1)?.sysLabels.map((label: any) => (
            <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
              {label}
            </Badge>
          ))}
        </div>
      )}
    </button>
  );
}
