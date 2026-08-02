import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  const currentPath = request.nextUrl.pathname;

  if (currentPath.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', currentPath);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based authorization
    if (currentPath.startsWith('/dashboard/provider') && userRole !== 'PROVIDER') {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }

    if (currentPath.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }
  }
  if ((currentPath === '/login' || currentPath === '/signup') && token) {
    if (userRole === 'PROVIDER') {
      return NextResponse.redirect(new URL('/dashboard/provider', request.url));
    } else if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};