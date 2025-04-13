"use server"

import { headers } from "next/headers"
import { auth } from "./auth"
import axios from "axios"

export const getAurinkoAuthUrl = async (serviceType: "Google" | "Office365") => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID as string,
    serviceType,
    scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`
  })

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`
}

export const getAccountDetails = async (accessToken: string) => {
  try {
    const response = await axios.get('https://api.aurinko.io/v1/account', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    return response.data as {
      email: string,
      name: string
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching account details:", error.response?.data)
    } else {
      console.error("Unexpected error fetching account details:", error)
    }
    throw error;
  }
}