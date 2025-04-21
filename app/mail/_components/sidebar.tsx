"use client";

import { useState, useEffect } from "react"; // Import useState and useEffect
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Send } from "lucide-react";

type Props = {
  isCollapsed: boolean;
};

function Sidebar({ isCollapsed }: Props) {
  const [accountId] = useLocalStorage("accountId", "");
  const [tab, setTab] = useLocalStorage<"inbox" | "draft" | "sent">("tab", "inbox"); // Keep setTab if needed elsewhere, or remove if not

  // State for counts
  const [inboxCount, setInboxCount] = useState<number | null>(null);
  const [draftCount, setDraftCount] = useState<number | null>(null);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Optional: Loading state
  const [error, setError] = useState<string | null>(null); // Optional: Error state

  useEffect(() => {
    const fetchCounts = async () => {
      if (!accountId) {
        // Reset counts if no account is selected
        setInboxCount(null);
        setDraftCount(null);
        setSentCount(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const tabsToFetch: ("inbox" | "draft" | "sent")[] = ["inbox", "draft", "sent"];
        const counts: Record<string, number | null> = { inbox: null, draft: null, sent: null };

        await Promise.all(tabsToFetch.map(async (tabName) => {
          try {
            const response = await fetch(`/api/threads/count?accountId=${accountId}&tab=${tabName}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch count for ${tabName}`);
            }
            const data = await response.json();
            counts[tabName] = data.count;
          } catch (fetchError) {
            console.error(`Error fetching count for ${tabName}:`, fetchError);
            // Keep count as null for this tab on error
          }
        }));

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
  }


  return (
    <Nav
      isCollapsed={isCollapsed}
      links={[
        {
          title: "Inbox",
          label: getLabel(inboxCount),
          icon: Inbox,
          variant: tab === "inbox" ? "default" : "ghost"
        },
        {
          title: "Draft",
          label: getLabel(draftCount),
          icon: File,
          variant: tab === "draft" ? "default" : "ghost"
        },
        {
          title: "Sent",
          label: getLabel(sentCount),
          icon: Send,
          variant: tab === "sent" ? "default" : "ghost"
        },
      ]}
    />
  );
}

export default Sidebar;
