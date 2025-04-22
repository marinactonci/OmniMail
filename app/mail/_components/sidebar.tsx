"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Send } from "lucide-react";

type Props = {
  isCollapsed: boolean;
};

function Sidebar({ isCollapsed }: Props) {
  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage<"inbox" | "draft" | "sent">("tab", "inbox");

  const [inboxCount, setInboxCount] = useState<number | null>(null);
  const [draftCount, setDraftCount] = useState<number | null>(null);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!accountId) {
        setInboxCount(null);
        setDraftCount(null);
        setSentCount(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const tabsToFetch: ("inbox" | "draft" | "sent")[] = [
          "inbox",
          "draft",
          "sent",
        ];
        const counts: Record<string, number | null> = {
          inbox: null,
          draft: null,
          sent: null,
        };

        await Promise.all(
          tabsToFetch.map(async (tabName) => {
            try {
              const response = await fetch(
                `/api/threads/count?accountId=${accountId}&tab=${tabName}`
              );
              if (!response.ok) {
                throw new Error(`Failed to fetch count for ${tabName}`);
              }
              const data = await response.json();
              counts[tabName] = data.count;
            } catch (fetchError) {
              console.error(`Error fetching count for ${tabName}:`, fetchError);
            }
          })
        );

        setInboxCount(counts.inbox);
        setDraftCount(counts.draft);
        setSentCount(counts.sent);
      } catch (err) {
        console.error("Error fetching thread counts:", err);
        setError("Failed to load counts");

        setInboxCount(null);
        setDraftCount(null);
        setSentCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [accountId]);

  const getLabel = (count: number | null) => {
    if (isLoading) return "...";
    if (error) return "!";
    if (count === null) return "-";
    return count.toString();
  };

  return (
    <Nav
      isCollapsed={isCollapsed}
      links={[
        {
          title: "Inbox",
          label: getLabel(inboxCount),
          icon: Inbox,
          variant: tab === "inbox" ? "default" : "ghost",
        },
        {
          title: "Draft",
          label: getLabel(draftCount),
          icon: File,
          variant: tab === "draft" ? "default" : "ghost",
        },
        {
          title: "Sent",
          label: getLabel(sentCount),
          icon: Send,
          variant: tab === "sent" ? "default" : "ghost",
        },
      ]}
    />
  );
}

export default Sidebar;
