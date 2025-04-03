import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth.handler(request)

  // If the user is logged in and trying to access an auth route, redirect to home
  if (session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Continue with the request if no redirection is needed
  return NextResponse.next()
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ['/sign-in', '/sign-up']
}