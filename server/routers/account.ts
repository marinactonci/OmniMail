import { auth } from "@/lib/auth";
import { procedure, router } from "../trpc";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export const accountRouter = router({
  getAccounts: procedure.query(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    return await prisma.emailAccount.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        emailAddress: true,
        name: true,
        provider: true,
      },
    });
  }),
});
