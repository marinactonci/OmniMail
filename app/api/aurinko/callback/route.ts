// /api/aurinko/callback
import { waitUntil } from "@vercel/functions";
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

  const params = req.nextUrl.searchParams;
  const status = params.get("status");

  if (status !== "success") {
    return NextResponse.json(
      { message: "Failed to link account" },
      { status: 400 }
    );
  }

  // get the code to exchange for an access token
  const code = params.get("code");
  if (!code) {
    return NextResponse.json({ message: "No code provided" }, { status: 400 });
  }
  
  // Add additional scopes parameter to request proper permissions
  const token = await exchangeCodeForAccessToken(code);
  if (!token) {
    return NextResponse.json(
      { message: "Failed to exchange code for access token" },
      { status: 400 }
    );
  }

  const accountDetails = await getAccountDetails(token.accessToken);

  await prisma.emailAccount.upsert({
    where: {
      id: token.accountId.toString(),
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
    },
  });

  // trigger initial sync endpoint
  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId: session?.user.id,
      })
      .then((response) => {
        console.log("Initial sync triggered", response.data);
      })
      .catch((error) => {
        console.error("Initial sync failed", error);
      })
  );

  return NextResponse.redirect(new URL("/mail", req.url));
};

export const exchangeCodeForAccessToken = async (code: string) => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await axios.post(
        `https://api.aurinko.io/v1/auth/token/${code}`,
        {},
        {
          auth: {
            username: process.env.AURINKO_CLIENT_ID as string,
            password: process.env.AURINKO_CLIENT_SECRET as string,
          },
          timeout: 10000, // Set a timeout of 10 seconds
        }
      );
      return response.data as {
        accountId: number;
        accessToken: string;
        userId: string;
        userSession: string;
      };
    } catch (error) {
      retryCount++;
      if (axios.isAxiosError(error)) {
        // If it's a timeout or 5xx error, retry
        if (error.code === 'ECONNABORTED' || (error.response && error.response.status >= 500)) {
          console.log(`Attempt ${retryCount}/${maxRetries} failed. Retrying in ${retryCount * 1000}ms...`);
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
          continue;
        }
        console.error('API Error:', error.response?.data);
      }
      console.error('Error exchanging code for token:', error);

      // If we've exhausted all retries or it's not a retryable error, return null
      if (retryCount >= maxRetries) {
        console.error('Max retries reached. Giving up.');
        return null;
      }
    }
  }
  return null;
};
