import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Mail from "./_components/mail";

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
      defaultLayout={[20, 32, 48]}
      defaultCollapsed={false}
      navCollapsedSize={4}
    />
  );
}
