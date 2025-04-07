import Mail from "@/components/mail";
import React from "react";

export default function HomePage() {
  return (
    <Mail
      defaultLayout={[20, 32, 48]}
      defaultCollapsed={false}
      navCollapsedSize={4}
    />
  );
}
