import { Separator } from "@/components/ui/separator";
import UseThreads from "@/hooks/use-threads";
import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import EmailDisplay from "./email-display";
import ReplyBox from "./reply-box";

export default function ThreadDisplay() {
  const { threadId, threads } = UseThreads();
  const thread = useMemo(() => threads?.find((t) => t.id === threadId), [threadId, threads]);

  // Memoize the email displays to prevent unnecessary re-renders
  const emailDisplays = useMemo(() => {
    if (!thread) return null;
    return thread.emails.map((email) => (
      <EmailDisplay key={email.id} email={email} />
    ));
  }, [thread]);

  const memoizedReplyBox = useMemo(() => <ReplyBox />, []);

  return (
    <div className="flex flex-col h-full">
      {thread ? (
        <>
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center p-4">
              <div className="flex items-center gap-4 text-sm">
                <Avatar>
                  <AvatarFallback>
                    {thread.emails[0]?.from?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                  <AvatarImage alt="Avatar" />
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold">
                    {thread.emails[0]?.from?.name}
                  </div>
                  <div className="text-xs line-clamp-1">
                    {thread.emails[0]?.subject}
                  </div>
                  <div className="text-xs line-clamp-1">
                    <span className="font-medium">Reply-To: </span>
                    {thread.emails[0]?.from?.address}
                  </div>
                </div>
              </div>
              {thread.emails[0]?.sentAt && (
                <div className="text-xs ml-auto text-muted-foreground">
                  {format(new Date(thread.emails[0]?.sentAt), "PPpp")}
                </div>
              )}
            </div>
            <Separator />
            <div className="flex-1 overflow-auto">
              <div className="p-4 flex flex-col gap-4">
                {emailDisplays}
              </div>
            </div>
            <div className="p-4 pb-2">
              {memoizedReplyBox}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p-8 text-center text-muted-foreground">
            No message selected
          </div>
        </>
      )}
    </div>
  );
}
