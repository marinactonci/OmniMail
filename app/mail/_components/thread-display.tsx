import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UseThreads from "@/hooks/use-threads";
import { Archive, ArchiveX, Clock, MoreVertical, Trash2 } from "lucide-react";
import React from "react";
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

export default function ThreadDisplay() {
  const { threadId, threads } = UseThreads();
  const thread = threads?.find((t) => t.id === threadId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} size={"icon"} disabled={!thread}>
            <Archive className="size-4" />
          </Button>
          <Button variant={"ghost"} size={"icon"} disabled={!thread}>
            <ArchiveX className="size-4" />
          </Button>
          <Button variant={"ghost"} size={"icon"} disabled={!thread}>
            <Trash2 className="size-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="mx-2" />
        <Button variant={"ghost"} size={"icon"} disabled={!thread}>
          <Clock className="size-4" />
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
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
      </div>
      <Separator />
      {thread ? (
        <>
          <div className="flex flex-col flex-1 overflow-scroll">
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
                    <div className="text-xs line-clamp-1">
                      {thread.emails[0]?.subject}
                    </div>
                    <div className="text-xs line-clamp-1">
                      <span className="font-medium">Reply-To: </span>
                      {thread.emails[0]?.from?.address}
                    </div>
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
            <div className="max-h-[calc(100vh-450px)] overflow-scroll flex flex-col">
              <div className="p-6 flex flex-col-gap-4">
                {thread.emails.map((email) => {
                  return <EmailDisplay key={email.id} email={email} />;
                })}
              </div>
            </div>
            <Separator />
            {/* Reply box */}
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
