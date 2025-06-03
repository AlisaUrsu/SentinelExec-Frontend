import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth/login', '/auth/signup', '/auth/verify'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get('refreshToken')?.value;

  if (!authToken) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (if you want to exclude them)
     * - _next (Next.js internals)
     * - favicon.ico
     */
    '/((?!api|_next/static|favicon.ico|fonts).*)'
  ],
};
