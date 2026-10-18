"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LayoutDashboard,
  Users,
  PackageCheck,
  ClipboardList,
  BarChart3,
  UserCog,
  LogOut,
  Menu,
  X,
  Compass,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("userRole");
    Cookies.remove("userName");
    toast.success("Admin signed out successfully!", { autoClose: 1200 });
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 600);
  };

  const navItems: NavItem[] = [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Gear", href: "/dashboard/admin/gears", icon: PackageCheck },
    { label: "Rental Orders", href: "/dashboard/admin/orders", icon: ClipboardList },
    { label: "Analytics & Revenue", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "Admin Profile", href: "/dashboard/admin/profile", icon: UserCog },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard/admin") return pathname === "/dashboard/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#f7faf7] dark:bg-gray-900 text-zinc-900 dark:text-gray-100 flex flex-col transition-colors duration-200 pt-20">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Mobile Drawer Trigger (Mobile-only) */}
      <div className="md:hidden px-4 sm:px-6 pt-2 pb-1 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-zinc-200 dark:border-gray-700 text-xs font-bold text-zinc-700 dark:text-gray-200 cursor-pointer shadow-xs"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Admin Menu</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 gap-6">
        {/* Admin Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-2xl p-4 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 shrink-0 shadow-xs ${
            sidebarOpen ? "translate-x-0 top-20 bottom-4 left-4" : "-translate-x-full"
          }`}
        >
          <div className="space-y-1.5">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-gray-400 px-3 py-2 border-b border-zinc-100 dark:border-gray-700 mb-2">
              Admin Portal ({navItems.length} Menus)
            </h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = isActiveRoute(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? "bg-[#2e5328] dark:bg-[#3b663b] text-white shadow-xs"
                        : "text-zinc-600 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-gray-700/60 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-zinc-200/80 dark:border-gray-700 space-y-2">
            <Link
              href="/gear"
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs text-[#2e5328] dark:text-[#5fa352] hover:bg-[#2e5328]/10 dark:hover:bg-[#5fa352]/10 rounded-xl font-bold transition"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Gear</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Admin Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for Mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}

        {/* Dynamic Admin Content */}
        <main className="flex-1 w-full bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}