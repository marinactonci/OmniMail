import { Mail } from "@/components/mail";
import { accounts, mails } from "@/lib/data";
import React from "react";

export default function HomePage() {
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
