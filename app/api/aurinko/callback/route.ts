// /api/aurinko/callback

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAccountDetails } from "@/lib/aurinko";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams
  const status = params.get("status")

  if (status !== "success") {
    return NextResponse.json({ message: "Failed to link account" }, { status: 400 });
  }

  // get the code to exchange for an access token
  const code = params.get("code")
  if (!code) {
    return NextResponse.json({ message: "No code provided" }, { status: 400 });
  }
  const token = await exchangeCodeForAccessToken(code)
  if (!token) {
    return NextResponse.json({ message: "Failed to exchange code for access token" }, { status: 400 });
  }

  const accountDetails = await getAccountDetails(token.accessToken);

  await prisma.emailAccount.upsert({
    where: {
      id: token.accountId.toString()
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId: session?.user.id,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
      accessToken: token.accessToken,
    }
  })

  return NextResponse.redirect(new URL("/mail", req.url));
};

export const exchangeCodeForAccessToken = async (code: string) => {
  try {
    const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`, {}, {
      auth: {
        username: process.env.AURINKO_CLIENT_ID as string,
        password: process.env.AURINKO_CLIENT_SECRET as string,
      }
    })
    return response.data as {
      accountId: number,
      accessToken: string,
      userId: string,
      userSession: string
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    }
    console.error(error);
  }
}
