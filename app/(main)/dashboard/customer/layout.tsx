'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LayoutDashboard, ShoppingBag, Heart, User, Compass, LogOut } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('userRole');
    Cookies.remove('userName');
    toast.success('Signed out successfully!', { autoClose: 1200 });
    setTimeout(() => {
      router.push('/login');
      router.refresh();
    }, 500);
  };

  // User / Customer Requirement: Minimum 4 menu items
  const navItems = [
    { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { label: 'My Rentals', href: '/dashboard/customer/rentals', icon: ShoppingBag },
    { label: 'Wishlist', href: '/dashboard/customer/wishlist', icon: Heart },
    { label: 'Profile', href: '/dashboard/customer/profile', icon: User },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard/customer') {
      return pathname === '/dashboard/customer';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pt-20">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Main Container: বামে Navigation এবং ডানে মূল পেজ কন্টেন্ট */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          
          {/* বামে: সাইডবার (কমপক্ষে ৪টি মেনু) */}
          <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-xs">
            <div className="pb-3 border-b border-gray-100 dark:border-gray-700 mb-3 px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Customer Navigation
              </h2>
            </div>

            <nav className="flex flex-col space-y-1.5">
              {navItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#2e5328] dark:bg-[#3b663b] text-white shadow-xs'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4 space-y-2">
              <Link
                href="/gear"
                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs text-[#2e5328] dark:text-[#5fa352] hover:bg-[#2e5328]/10 dark:hover:bg-[#5fa352]/10 rounded-xl font-bold transition"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Gear</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* ডানে: মূল পেজ কন্টেন্ট */}
          <main className="flex-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 shadow-xs overflow-hidden">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}