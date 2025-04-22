import { procedure, router } from "../trpc";

export const accountRouter = router({
  getAccounts: procedure.query(() => {
    return [
      {
        id: 1,
        name: "John Doe",
      },
      {
        id: 2,
        name: "Jane Smith",
      },
    ];
  }),
});
