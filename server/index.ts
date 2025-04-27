import { accountRouter } from "./routers/account";
import { emailRouter } from "./routers/email";
import { threadRouter } from "./routers/thread";
import { router } from "./trpc";

export const appRouter = router({
  account: accountRouter,
  thread: threadRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
