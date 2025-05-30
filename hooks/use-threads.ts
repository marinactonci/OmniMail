import { trpc } from "@/server/client";
import { useLocalStorage } from "usehooks-ts";

export default function UseThreads() {
  const { data: accounts } = trpc.account.getAccounts.useQuery();
  const [accountId] = useLocalStorage("accountId", "");
  const [threadId, setThreadId] = useLocalStorage("threadId", "");
  const [done] = useLocalStorage("done", false);

  const {
    data: threads,
    isFetching,
    refetch,
  } = trpc.thread.getAllThreads.useQuery(
    {
      accountId,
      tab: "inbox",
      done,
    },
    {
      enabled: !!accountId,
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
