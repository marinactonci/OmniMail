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
    <Mail
      defaultLayout={[21, 35, 45]}
      defaultCollapsed={false}
      navCollapsedSize={4}
    />
  );
}
