"use client";

import dynamic from "next/dynamic";

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
