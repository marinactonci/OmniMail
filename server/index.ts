import { accountRouter } from "./routers/account";
import { router } from "./trpc";

export const appRouter = router({
  account: accountRouter,
});

export type AppRouter = typeof appRouter;
