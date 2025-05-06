import { auth } from "@/lib/auth";
import { procedure, router } from "../trpc";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sub } from "date-fns";
import { emailAddressSchema } from "@/schemas/emailAddress";
import { authorizeAccountAccess } from "@/lib/authorize-account-access";
import { Account } from "@/lib/account";

export const emailRouter = router({
  getEmails: procedure.query(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const account = await prisma.emailAccount.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        emailAddress: true,
      },
    });

    if (!account) {
      throw new Error("No account found");
    }

    return await prisma.emailAddress.findMany({
      where: {
        address: {
          not: account.emailAddress,
        },
      },
    });
  }),
  sendEmail: procedure
    .input(
      z.object({
        accountId: z.string(),
        body: z.string(),
        subject: z.string(),
        from: emailAddressSchema,
        cc: z.array(emailAddressSchema).optional(),
        bcc: z.array(emailAddressSchema).optional(),
        to: z.array(emailAddressSchema),
        replyTo: emailAddressSchema,
        inReplyTo: z.string().optional(),
        threadId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
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
      await acc.sendEmail({
        body: input.body,
        subject: input.subject,
        threadId: input.threadId,
        to: input.to,
        bcc: input.bcc,
        cc: input.cc,
        replyTo: input.replyTo,
        from: input.from,
        inReplyTo: input.inReplyTo,
    })
    }),
});
