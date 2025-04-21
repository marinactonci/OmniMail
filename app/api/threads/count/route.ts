import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Import the auth object from lib/auth
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
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

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const tab = searchParams.get("tab");

    if (!accountId) {
      return NextResponse.json(
        { error: "accountId query parameter is required" },
        { status: 400 }
      );
    }
    if (!tab) {
      return NextResponse.json(
        { error: "tab query parameter is required" },
        { status: 400 }
      );
    }

    const account = await authorizeAccountAccess(accountId, session.user.id);

    // Build the filter based on the tab
    let filter: Prisma.ThreadWhereInput = {};
    if (tab === "inbox") {
      filter.inboxStatus = true;
    } else if (tab === "sent") {
      filter.sentStatus = true;
    } else if (tab === "draft") {
      filter.draftStatus = true;
    }

    const count = await prisma.thread.count({
      where: {
        accountId: account.id,
        ...filter,
      },
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Error fetching thread count:", error);
    if (error.message === "Account not found or unauthorized") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
