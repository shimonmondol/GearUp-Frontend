"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "📊 Dashboard Overview", href: "/dashboard/provider" },
    { label: "📥 Incoming Rental Orders", href: "/dashboard/provider/orders" },
    { label: "➕ Add New Gear", href: "/dashboard/provider/add-gear" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-6 border-b pb-3">
            <span className="text-[11px] bg-purple-100 text-purple-700 font-bold px-2.5 py-0.5 rounded-full uppercase">
              Provider Portal
            </span>
            <h2 className="text-xl font-bold text-gray-800 mt-2">
              Vendor Dashboard
            </h2>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t mt-6">
          <Link
            href="/gear"
            className="block text-center py-2 text-xs text-purple-600 hover:underline font-semibold"
          >
            ← View Public Gear Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
