import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const emailAccounts = await prisma.emailAccount.findMany({
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

  if (!emailAccounts) {
    return NextResponse.json(
      { message: "Error fetching accounts" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: emailAccounts }, { status: 200 });
}
