"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Send } from "lucide-react";
import { trpc } from "@/server/client";

type Props = {
  isCollapsed: boolean;
};

function Sidebar({ isCollapsed }: Props) {
  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage<"inbox" | "draft" | "sent">("tab", "inbox");

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
  );
}

export default Sidebar;
