"use client";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { useEffect } from "react";
//import Mail from "./_components/mail";

const Mail = dynamic(() => import("./_components/mail"), {
  ssr: false,
});

export default function MailPage() {
  return (
    <div className="h-[calc(100vh-64px)]">
      <Mail
        defaultLayout={[21, 35, 45]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </div>
  );
}
