import { Mail } from "@/components/mail";
import { auth } from "@/lib/auth";
import { accounts, mails } from "@/lib/data";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function MailPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // add 4 seconds delay
  //await new Promise((resolve) => setTimeout(resolve, 4000));

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <Mail
      accounts={accounts}
      mails={mails}
      defaultLayout={undefined}
      defaultCollapsed={undefined}
      navCollapsedSize={4}
    />
  );
}
