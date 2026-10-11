import { NextRequest, NextResponse } from 'next/server';
import { cookieName, isTokenExpired } from '@/lib/auth-edge';

// Routes that require authentication
const PROTECTED = ['/', '/activity', '/market', '/chat', '/add-task', '/tasks', '/providers', '/task-board'];
// Routes that should redirect to / if already logged in
const AUTH_ONLY = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(cookieName())?.value;

  // Token is valid if it exists and is not expired
  const isLoggedIn = !!token && !isTokenExpired(token);

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isAuthOnly = AUTH_ONLY.includes(pathname);

  if (isProtected && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthOnly && isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
