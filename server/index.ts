import { accountRouter } from "./routers/account";
import { threadRouter } from "./routers/thread";
import { router } from "./trpc";

export const appRouter = router({
  account: accountRouter,
  thread: threadRouter,
});

export type AppRouter = typeof appRouter;
