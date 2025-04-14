import { Account } from "@/lib/account";
import prisma from "@/lib/prisma";
import { syncEmailsToDatabase } from "@/lib/sync-to-db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { accountId, userId } = await req.json();
  if (!accountId || !userId) {
    return NextResponse.json(
      { message: "Missing accountId or userId" },
      { status: 400 }
    );
  }

  const dbAccount = await prisma.emailAccount.findUnique({
    where: {
      id: accountId,
      userId,
    },
  });

  if (!dbAccount) {
    return NextResponse.json({ message: "Account not found" }, { status: 404 });
  }

  // perform initial sync
  const account = new Account(dbAccount.accessToken);

  try {
    const response = await account.performInitialSync();

    if (!response) {
      return NextResponse.json(
        { message: "Error performing initial sync" },
        { status: 500 }
      );
    }

    const { emails, deltaToken } = response;

    console.log("number of emails synced", emails.length)

    await prisma.emailAccount.update({
      where: {
        id: accountId,
      },
      data: {
        nextDeltaToken: deltaToken,
      },
    });

    await syncEmailsToDatabase(emails, accountId);
    console.log('sync completed', deltaToken);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Initial sync error details:', error);

    // Check if it's a permission error
    if (error instanceof Error &&
        (error.message.includes('permission') ||
         error.message.includes('scope') ||
         error.message.includes('authorization'))) {
      return NextResponse.json(
        {
          message: "Insufficient permissions. The account needs to be re-authenticated with additional scopes.",
          error: error.message
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Error performing initial sync", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
};
