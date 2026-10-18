"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Users,
  Package,
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  ExternalLink,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "react-toastify";
import api from "@/lib/axios";

interface OrderItem {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  customer?: { name: string; email: string };
  orderItems?: { gear?: { title: string } }[];
}

// Table Skeleton Loader Component
function DashboardTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-zinc-100 dark:border-gray-700/60">
          <td className="p-3.5"><div className="h-3 w-16 bg-zinc-200 dark:bg-gray-700 rounded" /></td>
          <td className="p-3.5"><div className="h-3.5 w-24 bg-zinc-200 dark:bg-gray-700 rounded" /></td>
          <td className="p-3.5"><div className="h-3.5 w-32 bg-zinc-200 dark:bg-gray-700 rounded" /></td>
          <td className="p-3.5"><div className="h-4 w-12 bg-zinc-200 dark:bg-gray-700 rounded" /></td>
          <td className="p-3.5"><div className="h-5 w-16 bg-zinc-200 dark:bg-gray-700 rounded-full" /></td>
          <td className="p-3.5 text-right"><div className="h-3 w-16 bg-zinc-200 dark:bg-gray-700 rounded inline-block" /></td>
        </tr>
      ))}
    </>
  );
}

export default function SimpleAdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalGear: 0, totalOrders: 0 });
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const [statsRes, ordersRes] = await Promise.all([
        api.get(`/api/admin/stats?_t=${Date.now()}`, config).catch(() => null),
        api.get(`/api/admin/orders?limit=50&_t=${Date.now()}`, config).catch(() => null),
      ]);

      const sData = statsRes?.data?.data || statsRes?.data;
      setStats({
        totalUsers: sData?.totalUsers || 0,
        totalGear: sData?.totalGear ?? sData?.activeGear ?? 0,
        totalOrders: sData?.totalRentals || sData?.totalOrders || 0,
      });

      const oList = ordersRes?.data?.data?.orders || ordersRes?.data?.data || [];
      setOrders(Array.isArray(oList) ? oList : []);
    } catch {
      toast.error("Failed to load dashboard records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ফিল্টারিং ও সার্চ
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const name = (o.customer?.name || "").toLowerCase();
      const gear = (o.orderItems?.[0]?.gear?.title || "").toLowerCase();
      const id = o.id.toLowerCase();
      return !q || id.includes(q) || name.includes(q) || gear.includes(q);
    });
  }, [orders, search]);

  // পেজিনেশন
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const currentOrders = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, page]);

  // চার্ট ডেটা
  const chartData = useMemo(() => {
    const map: Record<string, { month: string; amount: number; count: number }> = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      if (isNaN(d.getTime())) return;
      const m = months[d.getMonth()];
      if (!map[m]) map[m] = { month: m, amount: 0, count: 0 };
      map[m].amount += Number(o.totalPrice || 0);
      map[m].count += 1;
    });

    return Object.values(map);
  }, [orders]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
          Admin Dashboard
        </h1>
          <p className="text-xs text-zinc-500 dark:text-gray-400">Overview of users, gear, and recent bookings.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="p-2 rounded-xl border border-zinc-200 dark:border-gray-700 hover:bg-zinc-100 dark:hover:bg-gray-700 text-zinc-600 dark:text-gray-300 transition cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/admin/users"
          className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-zinc-200 dark:border-gray-700 flex items-center justify-between hover:shadow-xs transition"
        >
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Total Users</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-gray-100 mt-1">
              {loading ? <span className="inline-block h-6 w-12 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : stats.totalUsers}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/dashboard/admin/gears"
          className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-zinc-200 dark:border-gray-700 flex items-center justify-between hover:shadow-xs transition"
        >
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Total Gear</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-gray-100 mt-1">
              {loading ? <span className="inline-block h-6 w-12 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : stats.totalGear}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/dashboard/admin/orders"
          className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-zinc-200 dark:border-gray-700 flex items-center justify-between hover:shadow-xs transition"
        >
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Total Orders</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-gray-100 mt-1">
              {loading ? <span className="inline-block h-6 w-12 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : stats.totalOrders}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* 2. Simple Dynamic Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-zinc-200 dark:border-gray-700">
            <h4 className="text-xs font-bold uppercase text-zinc-500 mb-3">Revenue Volume (৳)</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" fontSize={11} stroke="#888" />
                  <YAxis fontSize={11} stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: "0.75rem",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#2e5328" fill="#2e5328" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-zinc-200 dark:border-gray-700">
            <h4 className="text-xs font-bold uppercase text-zinc-500 mb-3">Orders Count</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" fontSize={11} stroke="#888" />
                  <YAxis fontSize={11} stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: "0.75rem",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. Simple Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-zinc-200 dark:border-gray-700 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-gray-100">Recent Rental Orders</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] transition-colors"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-200 cursor-pointer p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-50/70 dark:bg-gray-700/50 text-zinc-500 dark:text-gray-400 border-b border-zinc-200 dark:border-gray-700">
              <tr>
                <th className="p-3.5 font-semibold">Order ID</th>
                <th className="p-3.5 font-semibold">Customer</th>
                <th className="p-3.5 font-semibold">Gear</th>
                <th className="p-3.5 font-semibold">Total</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-gray-700 text-zinc-800 dark:text-gray-200">
              {loading ? (
                <DashboardTableSkeleton count={itemsPerPage} />
              ) : currentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                currentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/60 dark:hover:bg-gray-700/40 transition">
                    <td className="p-3.5 font-mono text-zinc-500 dark:text-gray-400">#{ord.id.slice(0, 8)}</td>
                    <td className="p-3.5 font-medium text-zinc-900 dark:text-gray-100">
                      {ord.customer?.name || "Customer"}
                    </td>
                    <td className="p-3.5 text-zinc-600 dark:text-gray-300">
                      {ord.orderItems?.[0]?.gear?.title || "Gear Item"}
                    </td>
                    <td className="p-3.5 font-bold text-zinc-900 dark:text-gray-100">৳{ord.totalPrice}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-gray-700 text-zinc-700 dark:text-gray-300">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right text-zinc-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-zinc-200 dark:border-gray-700 flex items-center justify-between text-xs text-zinc-500 dark:text-gray-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1 rounded-lg border border-zinc-200 dark:border-gray-700 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1 rounded-lg border border-zinc-200 dark:border-gray-700 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}