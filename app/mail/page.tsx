import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Mail from "./_components/mail";

export default async function MailPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

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
