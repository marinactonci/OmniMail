import { auth } from "@/lib/auth";
import { procedure, router } from "../trpc";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const authorizeAccountAccess = async (
  accountId: string,
  userId: string
) => {
  const account = await prisma.emailAccount.findFirst({
    where: {
      id: accountId,
      userId,
    },
    select: {
      id: true,
      emailAddress: true,
      name: true,
      accessToken: true,
    },
  });

  if (!account) {
    throw new Error("Account not found or unauthorized");
  }

  return account;
};

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
  getNumThreads: procedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.enum(["inbox", "draft", "sent"]),
      })
    )
    .query(async ({ input }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new Error("Unauthorized");
      }

      const account = await authorizeAccountAccess(
        input.accountId,
        session.user.id
      );

      let filter: Prisma.ThreadWhereInput = {};
      if (input.tab === "inbox") {
        filter.inboxStatus = true;
      } else if (input.tab === "sent") {
        filter.sentStatus = true;
      } else if (input.tab === "draft") {
        filter.draftStatus = true;
      }

      return await prisma.thread.count({
        where: {
          accountId: account.id,
          ...filter,
        },
      });
    }),
  getThreads: procedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.enum(["inbox", "draft", "sent"]),
        done: z.boolean(),
      })
    )
    .query(async ({ input }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new Error("Unauthorized");
      }

      const account = await authorizeAccountAccess(
        input.accountId,
        session.user.id
      );

      let filter: Prisma.ThreadWhereInput = {};
      if (input.tab === "inbox") {
        filter.inboxStatus = true;
      } else if (input.tab === "sent") {
        filter.sentStatus = true;
      } else if (input.tab === "draft") {
        filter.draftStatus = true;
      }

      filter.done = {
        equals: input.done,
      };

      return await prisma.thread.findMany({
        where: filter,
        include: {
          emails: {
            orderBy: {
              sentAt: "asc",
            },
            select: {
              id: true,
              from: true,
              body: true,
              bodySnippet: true,
              emailLabel: true,
              subject: true,
              sysLabels: true,
              sentAt: true,
            },
          },
        },
        take: 15,
        orderBy: {
          lastMessageDate: "desc",
        },
      });
    }),
});
