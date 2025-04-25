import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UseThreads from "@/hooks/use-threads";
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Send,
  Trash2,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import EmailDisplay from "./email-display";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReplyBox from "./reply-box";

export default function ThreadDisplay() {
  const { threadId, threads } = UseThreads();
  const thread = useMemo(() => threads?.find((t) => t.id === threadId), [threadId, threads]);
  const [replyContent, setReplyContent] = useState("");

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
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} size={"icon"} disabled={!thread}>
                  <Archive className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} size={"icon"} disabled={!thread}>
                  <ArchiveX className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to junk</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} size={"icon"} disabled={!thread}>
                  <Trash2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to trash</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator orientation="vertical" className="mx-2" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon"} disabled={!thread}>
                <Clock className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center gap-2 ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} size={"icon"} disabled={!thread}>
                  <Reply className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} size={"icon"} disabled={!thread}>
                  <ReplyAll className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply All</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} size={"icon"} disabled={!thread}>
                  <Forward className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Forward</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator orientation="vertical" className="mx-2" />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <MoreVertical className="!size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mark as unread</DropdownMenuLabel>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
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
            <Separator />
            <div className="p-4">
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
