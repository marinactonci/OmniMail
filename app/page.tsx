import LinkAccountButton from "@/components/link-account-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MailPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="container mx-auto h-screen grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <h1>Not logged in</h1>
          <p>You have to be logged in to view this page</p>
          <form
            action={async () => {
              "use server";

              redirect("/sign-in");
            }}
          >
            <Button type="submit">Sign In</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-screen grid place-items-center">
      <LinkAccountButton />
      <ThemeToggle />
      <form
        action={async () => {
          "use server";

          await auth.api.signOut({
            headers: await headers(),
          });
          redirect("/sign-in");
        }}
      >
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  );
}
