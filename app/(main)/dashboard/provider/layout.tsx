// app/dashboard/provider/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, ShoppingBag, ShieldAlert } from 'lucide-react';

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check user session / role (replace with NextAuth/Supabase/Auth context)
    const userRole = localStorage.getItem('user_role'); 
    if (userRole !== 'provider') {
      setIsAuthorized(false);
      // router.push('/login'); // Uncomment for direct redirect
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-sm w-full shadow-sm">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            You must be logged in as an authorized provider to access this portal.
          </p>
          <button
            onClick={() => {
              localStorage.setItem('user_role', 'provider');
              setIsAuthorized(true);
            }}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Simulate Provider Login
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview & Inventory', href: '/dashboard/provider', icon: LayoutDashboard },
    { label: 'Add Gear', href: '/dashboard/provider/gear/new', icon: PlusCircle },
    { label: 'Manage Orders', href: '/dashboard/provider/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
              Provider Hub
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-2">Equipment Rental</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          Logged in as <span className="font-semibold text-slate-700">Verified Provider</span>
        </div>
      </aside>

      {/* Main Body */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}