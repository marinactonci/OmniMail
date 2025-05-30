import { z } from "zod";
import { procedure, router } from "../trpc";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authorizeAccountAccess } from "@/lib/authorize-account-access";
import { Account } from "@/lib/account";

export const threadRouter = router({
  getAllThreads: procedure
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

      const acc = new Account(account.accessToken);
      acc.syncEmails().catch(console.error);

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
        where: {
          accountId: input.accountId,
          ...filter,
        },
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
              attachments: {
                select: {
                  id: true,
                  name: true,
                  mimeType: true,
                  size: true,
                  inline: true,
                  contentId: true,
                  contentLocation: true
                }
              }
            },
          },
        },
        orderBy: {
          lastMessageDate: "desc",
        },
      });
    }),
  getNumThreads: procedure
    .input(
      z.object({
        accountId: z.string(),
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

      return await prisma.thread.count({
        where: {
          accountId: account.id,
        },
      });
    }),
});
