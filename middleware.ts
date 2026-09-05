import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  // toUpperCase() ব্যবহার করায় 'provider' বা 'PROVIDER' উভয় ক্ষেত্রেই কাজ করবে
  const userRole = request.cookies.get('userRole')?.value?.toUpperCase();
  const currentPath = request.nextUrl.pathname;

  // ১. Auth পেজে লগইন করা ইউজার ঢুকলে রোল অনুযায়ী ড্যাশবোর্ডে রিডাইরেক্ট
  if ((currentPath === '/login' || currentPath === '/signup') && token) {
    if (userRole === 'PROVIDER') {
      return NextResponse.redirect(new URL('/dashboard/provider', request.url));
    } else if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }
  }

  // ২. ড্যাশবোর্ড রুট প্রোটেকশন
  if (currentPath.startsWith('/dashboard')) {
    // টোকেন না থাকলে লগইনে পাঠাবে
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', currentPath);
      return NextResponse.redirect(loginUrl);
    }

    // ইউজার যদি সরাসরি '/dashboard' এ হিট করে
    if (currentPath === '/dashboard') {
      if (userRole === 'PROVIDER') {
        return NextResponse.redirect(new URL('/dashboard/provider', request.url));
      } else if (userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/customer', request.url));
      }
    }

    // রোল অনুযায়ী অ্যাক্সেস গার্ড
    if (currentPath.startsWith('/dashboard/provider') && userRole !== 'PROVIDER') {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }

    if (currentPath.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }

    if (currentPath.startsWith('/dashboard/customer') && userRole === 'PROVIDER') {
      return NextResponse.redirect(new URL('/dashboard/provider', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};