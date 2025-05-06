import { auth } from "@/lib/auth";
import { procedure, router } from "../trpc";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { authorizeAccountAccess } from "@/lib/authorize-account-access";

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
  getSuggestions: procedure
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

      return await prisma.emailAddress.findMany({
        where: {
          accountId: account.id,
        },
        select: {
          address: true,
          name: true,
        },
      });
    }),
  getReplyDetails: procedure
    .input(
      z.object({
        accountId: z.string(),
        threadId: z.string(),
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

      const thread = await prisma.thread.findFirst({
        where: {
          id: input.threadId,
        },
        include: {
          emails: {
            orderBy: { sentAt: "asc" },
            select: {
              from: true,
              to: true,
              cc: true,
              bcc: true,
              sentAt: true,
              subject: true,
              internetMessageId: true,
            },
          },
        },
      });

      if (!thread || thread.emails.length === 0)
        throw new Error("Thread not found");

      const lastExternalEmail = thread.emails
        .reverse()
        .find((email) => email.from.address !== account.emailAddress);
      if (!lastExternalEmail) throw new Error("No external email found");

      return {
        subject: lastExternalEmail.subject,
        to: [
          lastExternalEmail.from,
          ...lastExternalEmail.to.filter(
            (to) => to.address !== account.emailAddress
          ),
        ],
        cc: lastExternalEmail.cc.filter(
          (cc) => cc.address !== account.emailAddress
        ),
        from: { name: account.name, address: account.emailAddress },
        id: lastExternalEmail.internetMessageId,
      };
    }),
});
