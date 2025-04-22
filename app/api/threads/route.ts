import { auth } from "@/lib/auth";
import { authorizeAccountAccess } from "@/lib/authorize-account-access";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    const done = searchParams.get("done");

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
    if (!done) {
      return NextResponse.json(
        { error: "done query parameter is required" },
        { status: 400 }
      );
    }

    const account = authorizeAccountAccess(accountId, session.user.id);

    let filter: Prisma.ThreadWhereInput = {};
    if (tab === "inbox") {
      filter.inboxStatus = true;
    } else if (tab === "sent") {
      filter.sentStatus = true;
    } else if (tab === "draft") {
      filter.draftStatus = true;
    }

    filter.done = {
      equals: done === "true",
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
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
