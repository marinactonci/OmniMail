import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Use direct cookie access since it's working
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // If user has a valid session cookie and is trying to access auth pages,
  // redirect them to the homepage
  if (sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If no session, allow access to sign-in and sign-up pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up"],
};
