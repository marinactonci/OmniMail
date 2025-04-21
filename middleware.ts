import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // If logged in, redirect from auth pages to mail
  if (sessionCookie && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/mail", request.url));
  }

  // If not logged in, redirect from mail page to sign-in
  if (!sessionCookie && pathname === "/mail") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mail", "/sign-in", "/sign-up"], // Apply middleware to these routes
};
