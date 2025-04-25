"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Pencil, Send } from "lucide-react";
import { trpc } from "@/server/client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import EmailEditor from "./email-editor";
import { Separator } from "@radix-ui/react-dropdown-menu";

type Props = {
  isCollapsed: boolean;
};

function Sidebar({ isCollapsed }: Props) {
  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage<"inbox" | "draft" | "sent">("tab", "inbox");
  const [isComposeOpen, setIsComposeOpen] = useLocalStorage(
    "isComposeOpen",
    false
  );

  const { data: inboxThreads } = trpc.thread.getNumThreads.useQuery({
    accountId,
    tab: "inbox",
  });
  const { data: draftThreads } = trpc.thread.getNumThreads.useQuery({
    accountId,
    tab: "draft",
  });
  const { data: sentThreads } = trpc.thread.getNumThreads.useQuery({
    accountId,
    tab: "sent",
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="p-2 border-b">
        <Button
          className="w-full justify-center gap-2"
          size={isCollapsed ? "icon" : "default"}
          variant="default"
          onClick={() => setIsComposeOpen(true)}
        >
          <Pencil className="size-4" />
          {!isCollapsed && "Compose"}
        </Button>
      </div>
      <Drawer open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DrawerContent className="px-50">
          <DrawerHeader>
            <DrawerTitle>New Message</DrawerTitle>
          </DrawerHeader>
          <div className="mt-2">
            <EmailEditor />
          </div>
        </DrawerContent>
      </Drawer>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Inbox",
            label: inboxThreads?.toString() ?? "0",
            icon: Inbox,
            variant: tab === "inbox" ? "default" : "ghost",
          },
          {
            title: "Draft",
            label: draftThreads?.toString() ?? "0",
            icon: File,
            variant: tab === "draft" ? "default" : "ghost",
          },
          {
            title: "Sent",
            label: sentThreads?.toString() ?? "0",
            icon: Send,
            variant: tab === "sent" ? "default" : "ghost",
          },
        ]}
      />
    </div>
  );
}

export default Sidebar;
