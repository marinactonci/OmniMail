import { trpc } from "@/server/client";
import { useLocalStorage } from "usehooks-ts";

export default function UseThreads() {
  const { data: accounts } = trpc.account.getAccounts.useQuery();
  const [accountId] = useLocalStorage("accountId", "");
  const [threadId, setThreadId] = useLocalStorage("threadId", "");
  const [tab] = useLocalStorage<"inbox" | "sent" | "draft">("tab", "inbox");
  const [done] = useLocalStorage("done", false);

  const {
    data: threads,
    isFetching,
    refetch,
  } = trpc.account.getThreads.useQuery(
    {
      accountId,
      tab,
      done,
    },
    {
      enabled: !!accountId && !!tab,
      placeholderData: (e) => e,
      refetchInterval: 5000,
    }
  );

  return {
    threads,
    isFetching,
    refetch,
    accountId,
    threadId,
    setThreadId,
    account: accounts?.find((e) => e.id === accountId),
  };
}
