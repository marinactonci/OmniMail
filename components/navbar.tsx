"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Mail, LogIn, User, Home, ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <nav className="border-b h-16 flex items-center px-4 sticky top-0 bg-background z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and App Name */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Mail className="h-6 w-6" />
          <span>OmniMail</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1 ${
              pathname === "/"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }`}
          >
            <Button variant="ghost">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          </Link>

          <Link
            href="/mail"
            className={`flex items-center gap-1 ${
              pathname === "/mail"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }`}
          >
            <Button variant="ghost">
              <Mail className="h-4 w-4" />
              <span>Mail</span>
            </Button>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Section */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <User className="h-5 w-5" />
                  <span>Account</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="text-sm px-2 py-1.5">{session?.user?.name}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default">
              <Link href="/sign-in" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
