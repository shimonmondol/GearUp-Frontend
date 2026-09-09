import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const rawRole = request.cookies.get('userRole')?.value;
  // কেস সেনসিটিভ সমস্যা এড়াতে uppercase করা হলো
  const userRole = rawRole ? rawRole.toUpperCase() : null;
  const pathname = request.nextUrl.pathname;

  // ১. ড্যাশবোর্ড রুট প্রোটেকশন
  if (pathname.startsWith('/dashboard')) {
    // যদি টোকেন না থাকে, সরাসরি লগইন পেজে পাঠাবে
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // যদি কোনো কারণে রোল কুকি না থাকে, ইনফিনিট লুপ এড়াতে লগইনে পাঠাবে
    if (!userRole) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role Enforcement (শুধুমাত্র ভিন্ন রোলে থাকলে তবেই রিডাইরেক্ট করবে)
    const roleHome = getRoleHome(userRole);

    if (pathname.startsWith('/dashboard/customer') && userRole !== 'CUSTOMER') {
      return NextResponse.redirect(new URL(roleHome, request.url));
    }
    if (pathname.startsWith('/dashboard/provider') && userRole !== 'PROVIDER') {
      return NextResponse.redirect(new URL(roleHome, request.url));
    }
    if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL(roleHome, request.url));
    }
  }

  // ২. লগইন/সাইনআপে থাকলে এবং অলরেডি লগইন করা থাকলে ড্যাশবোর্ডে পাঠাবে
  if ((pathname === '/login' || pathname === '/register' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL(getRoleHome(userRole || 'CUSTOMER'), request.url));
  }

  return NextResponse.next();
}

function getRoleHome(role?: string | null) {
  switch (role) {
    case 'ADMIN':
      return '/dashboard/admin';
    case 'PROVIDER':
      return '/dashboard/provider';
    case 'CUSTOMER':
      return '/dashboard/customer';
    default:
      return '/login'; // অজানা বা খালি রোল হলে ইনফিনিট লুপ না করে লগইনে পাঠাবে
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/signup'],
};