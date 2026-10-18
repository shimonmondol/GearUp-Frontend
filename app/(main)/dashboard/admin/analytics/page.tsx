"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Percent,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  ArrowUpRight,
  X,
  FileQuestion,
  Receipt,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "react-toastify";
import api from "@/lib/axios";

type OrderStatus = "PLACED" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED";

interface OrderItem {
  id?: string;
  gearId?: string;
  quantity?: number;
  gear?: { id: string; title: string; pricePerDay: number };
}

interface AdminOrderItem {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  customer?: { id: string; name: string; email: string };
  orderItems?: OrderItem[];
}

interface MonthlyTrendItem {
  month: string;
  revenue: number;
  platformFee: number;
  orders: number;
}

interface GearSharePieItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

const PALETTE = ["#2e5328", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

function AnalyticsTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-zinc-100 dark:border-gray-700/60">
          <td className="p-4"><div className="h-3 w-16 bg-zinc-200 dark:bg-gray-700 rounded" /></td>
          <td className="p-4">
            <div className="space-y-1.5 max-w-[140px]">
              <div className="h-3.5 bg-zinc-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-2.5 bg-zinc-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </td>
          <td className="p-4"><div className="h-3.5 w-32 bg-zinc-200 dark:bg-gray-700 rounded" /></td>
          <td className="p-4"><div className="h-4 w-16 bg-zinc-200 dark:bg-gray-700 rounded" /></td>
          <td className="p-4"><div className="h-4 w-14 bg-zinc-200 dark:bg-gray-700 rounded" /></td>
          <td className="p-4"><div className="h-5 w-20 bg-zinc-200 dark:bg-gray-700 rounded-full" /></td>
          <td className="p-4 text-right"><div className="h-3 w-16 bg-zinc-200 dark:bg-gray-700 rounded inline-block" /></td>
        </tr>
      ))}
    </>
  );
}

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // /api/admin/orders থেকে ডেটা ফেচ
  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await api.get(`/api/admin/orders?limit=100&_t=${Date.now()}`, config);
      const data = res.data?.data;
      const orderList: AdminOrderItem[] = data?.orders || [];
      setOrders(orderList);
    } catch (err: any) {
      console.error("Failed to load analytics orders:", err);
      toast.error(err.response?.data?.message || "Failed to load live revenue records");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // রেভিনিউ এবং মেট্রিক্স ক্যালকুলেশন
  const kpis = useMemo(() => {
    let totalGmv = 0;
    let completedCount = 0;

    orders.forEach((ord) => {
      if (ord.status !== "CANCELLED") {
        totalGmv += Number(ord.totalPrice || 0);
        if (ord.status === "PAID" || ord.status === "PICKED_UP" || ord.status === "RETURNED" || ord.status === "CONFIRMED") {
          completedCount += 1;
        }
      }
    });

    const totalCommission = Math.round(totalGmv * 0.15);
    const providerPayouts = totalGmv - totalCommission;
    const aov = completedCount > 0 ? Math.round(totalGmv / completedCount) : 0;

    return { totalGmv, totalCommission, providerPayouts, aov };
  }, [orders]);

  // মাসিক ট্রেন্ড চার্ট জেনারেশন
  const computedMonthlyTrends = useMemo<MonthlyTrendItem[]>(() => {
    if (orders.length === 0) return [];

    const monthMap: Record<string, { revenue: number; platformFee: number; orders: number; sortKey: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    orders.forEach((ord) => {
      if (ord.status === "CANCELLED") return;
      const date = new Date(ord.createdAt);
      if (isNaN(date.getTime())) return;

      const mName = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const key = `${mName} '${String(year).slice(-2)}`;
      const sortKey = year * 100 + date.getMonth();

      if (!monthMap[key]) {
        monthMap[key] = { revenue: 0, platformFee: 0, orders: 0, sortKey };
      }

      const price = Number(ord.totalPrice || 0);
      monthMap[key].revenue += price;
      monthMap[key].platformFee += Math.round(price * 0.15);
      monthMap[key].orders += 1;
    });

    return Object.entries(monthMap)
      .sort((a, b) => a[1].sortKey - b[1].sortKey)
      .map(([month, val]) => ({
        month,
        revenue: val.revenue,
        platformFee: val.platformFee,
        orders: val.orders,
      }));
  }, [orders]);

  // গিয়ার টাইটেল অনুসারে রেভিনিউ পাই চার্ট
  const computedGearShare = useMemo<GearSharePieItem[]>(() => {
    if (orders.length === 0) return [];

    const itemMap: Record<string, { count: number; revenue: number }> = {};
    let totalRevenue = 0;

    orders.forEach((ord) => {
      if (ord.status === "CANCELLED") return;
      const firstTitle = ord.orderItems?.[0]?.gear?.title || "Standard Equipment";
      const price = Number(ord.totalPrice || 0);

      if (!itemMap[firstTitle]) {
        itemMap[firstTitle] = { count: 0, revenue: 0 };
      }
      itemMap[firstTitle].count += 1;
      itemMap[firstTitle].revenue += price;
      totalRevenue += price;
    });

    return Object.entries(itemMap)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 6)
      .map(([name, val], idx) => ({
        name,
        value: totalRevenue > 0 ? Math.round((val.revenue / totalRevenue) * 100) : 0,
        count: val.count,
        color: PALETTE[idx % PALETTE.length],
      }));
  }, [orders]);

  // সার্চ ও ফিল্টারিং
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const q = searchTerm.toLowerCase().trim();
      const cName = (ord.customer?.name || "").toLowerCase();
      const cEmail = (ord.customer?.email || "").toLowerCase();
      const gTitle = (ord.orderItems?.[0]?.gear?.title || "").toLowerCase();
      const id = ord.id.toLowerCase();

      const matchSearch = !q || id.includes(q) || cName.includes(q) || cEmail.includes(q) || gTitle.includes(q);
      const matchStatus = statusFilter === "ALL" || ord.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // পেজিনেশন
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // লাইভ CSV এক্সপোর্ট
  const handleExportCsv = () => {
    if (filteredOrders.length === 0) {
      toast.warning("No live order transactions to export!");
      return;
    }

    const headers = ["Order ID", "Customer Name", "Customer Email", "Primary Gear", "Total Bill (BDT)", "Commission (15%)", "Status", "Order Date"];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${(o.customer?.name || "Customer").replace(/"/g, '""')}"`,
      `"${o.customer?.email || ""}"`,
      `"${(o.orderItems?.[0]?.gear?.title || "Gear").replace(/"/g, '""')}"`,
      o.totalPrice,
      Math.round(o.totalPrice * 0.15),
      o.status,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `GearUp_Financial_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Financial statement exported!");
  };

  const renderBadge = (status: OrderStatus) => {
    const badges: Record<OrderStatus, string> = {
      PLACED: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-900/60",
      CONFIRMED: "bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-900/60",
      PAID: "bg-purple-50 text-purple-800 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-900/60",
      PICKED_UP: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      RETURNED: "bg-zinc-100 text-zinc-700 dark:bg-gray-700 dark:text-zinc-300 border-zinc-200 dark:border-gray-600",
      CANCELLED: "bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-900/60",
    };

    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider inline-flex items-center ${
          badges[status] || "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-gray-700 dark:text-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with Refresh & Report Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-gray-700 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
            Financial & Analytics Intelligence
          </h1>
          <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
            Real-time gross transaction velocity, platform fee earnings, and audited order reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchAnalyticsData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-zinc-200 dark:border-gray-700 text-xs font-bold text-zinc-700 dark:text-gray-200 hover:bg-zinc-50 dark:hover:bg-gray-700/60 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Live Orders</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={loading || filteredOrders.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Total GMV (Volume)</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-gray-100">
              {loading ? <span className="inline-block h-6 w-24 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : `৳ ${kpis.totalGmv.toLocaleString()}`}
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live bookings
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Platform Commission</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-gray-100">
              {loading ? <span className="inline-block h-6 w-24 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : `৳ ${kpis.totalCommission.toLocaleString()}`}
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">15% platform cut</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#2e5328]/10 text-[#2e5328] dark:text-[#5fa352] flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Avg. Order Value (AOV)</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-gray-100">
              {loading ? <span className="inline-block h-6 w-20 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : `৳ ${kpis.aov.toLocaleString()}`}
            </h3>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Confirmed rentals</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Provider Payouts */}
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Provider Net Payouts</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-gray-100">
              {loading ? <span className="inline-block h-6 w-24 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : `৳ ${kpis.providerPayouts.toLocaleString()}`}
            </h3>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">85% gear owner earnings</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Dynamic Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-zinc-900 dark:text-gray-100">Gross GMV & Platform Commission</h4>
              <p className="text-xs text-zinc-400">Monthly booking transaction value (৳ BDT)</p>
            </div>
            <span className="text-[11px] font-bold text-[#2e5328] dark:text-[#5fa352] bg-[#2e5328]/10 dark:bg-[#5fa352]/20 px-2.5 py-0.5 rounded-md">
              Live Audited
            </span>
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="h-full w-full bg-zinc-100 dark:bg-gray-700/50 rounded-xl animate-pulse flex items-center justify-center text-xs text-zinc-400">
                Loading revenue trajectory...
              </div>
            ) : computedMonthlyTrends.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-zinc-400 text-xs gap-1 border border-dashed border-zinc-200 dark:border-gray-700 rounded-xl">
                <FileQuestion className="w-6 h-6 opacity-40" />
                <span>No order revenue recorded yet.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={computedMonthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGmvLive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2e5328" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2e5328" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorFeeLive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: "0.75rem",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [`৳ ${Number(val).toLocaleString()}`, ""]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2e5328" strokeWidth={2.5} fill="url(#colorGmvLive)" name="Gross Volume" />
                  <Area type="monotone" dataKey="platformFee" stroke="#3b82f6" strokeWidth={2} fill="url(#colorFeeLive)" name="Commission (15%)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gear Revenue Distribution Pie Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="mb-2">
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-gray-100">Top Revenue Generators</h4>
            <p className="text-xs text-zinc-400">Share of revenue by booked gear item</p>
          </div>

          <div className="h-56 w-full">
            {loading ? (
              <div className="h-full w-full bg-zinc-100 dark:bg-gray-700/50 rounded-xl animate-pulse flex items-center justify-center text-xs text-zinc-400">
                Loading gear contribution...
              </div>
            ) : computedGearShare.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-zinc-400 text-xs gap-1 border border-dashed border-zinc-200 dark:border-gray-700 rounded-xl">
                <FileQuestion className="w-6 h-6 opacity-40" />
                <span>No order items available.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={computedGearShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {computedGearShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: "0.75rem",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value: any, name: any, item: any) => [
                      `${value}% (${item.payload.count} orders)`,
                      item.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-gray-700 text-[11px]">
            {computedGearShare.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-zinc-600 dark:text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="truncate max-w-[100px]" title={item.name}>{item.name}:</span>
                <strong className="text-zinc-900 dark:text-gray-100 font-bold">{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Financial Transaction Ledger */}
      <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-200/80 dark:border-gray-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-gray-100">
              Settlement Ledger ({filteredOrders.length} records)
            </h3>
            <p className="text-xs text-zinc-400">Order revenue, customer references, and platform commission</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ID, customer, gear..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-8 pr-8 py-1.5 text-xs text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-200 cursor-pointer p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 border border-zinc-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 bg-zinc-50 dark:bg-gray-900/60">
              <Filter className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-zinc-700 dark:text-gray-200 focus:outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-zinc-900 [&>option]:dark:text-gray-100"
              >
                <option value="ALL">All Status</option>
                <option value="PLACED">Placed</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PAID">Paid</option>
                <option value="PICKED_UP">Picked Up</option>
                <option value="RETURNED">Returned</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/70 dark:bg-gray-700/50 border-b border-zinc-200/80 dark:border-gray-700 text-zinc-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer Details</th>
                <th className="p-4 font-bold">Primary Gear</th>
                <th className="p-4 font-bold">Gross Total</th>
                <th className="p-4 font-bold">Commission (15%)</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-gray-700 text-zinc-800 dark:text-gray-200">
              {loading ? (
                <AnalyticsTableSkeleton count={itemsPerPage} />
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <Receipt className="w-8 h-8 text-zinc-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500 dark:text-gray-400">
                      {searchTerm || statusFilter !== "ALL"
                        ? "No transactions match your search or filter."
                        : "No live orders recorded in the system yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => {
                  const gearTitle = ord.orderItems?.[0]?.gear?.title || "Gear Item";
                  const gross = Number(ord.totalPrice || 0);
                  const commission = Math.round(gross * 0.15);

                  return (
                    <tr key={ord.id} className="hover:bg-zinc-50/60 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#2e5328] dark:text-[#5fa352]">
                        #{ord.id.slice(0, 8)}...
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-zinc-900 dark:text-gray-100">{ord.customer?.name || "Customer"}</p>
                        <span className="text-[10px] text-zinc-400">{ord.customer?.email}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-zinc-900 dark:text-gray-100 line-clamp-1">{gearTitle}</p>
                        {(ord.orderItems?.length || 0) > 1 && (
                          <span className="text-[10px] text-zinc-400">
                            +{(ord.orderItems?.length || 1) - 1} more
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-extrabold text-zinc-900 dark:text-gray-100">
                        ৳ {gross.toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                        +৳ {commission.toLocaleString()}
                      </td>
                      <td className="p-4">{renderBadge(ord.status)}</td>
                      <td className="p-4 text-zinc-500 dark:text-gray-400 text-right">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-zinc-200/80 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} records
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-gray-700 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-gray-750 cursor-pointer text-zinc-600 dark:text-gray-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-[#2e5328] dark:bg-[#3b663b] text-white"
                      : "border border-zinc-200 dark:border-gray-700 hover:bg-zinc-100 dark:hover:bg-gray-750 text-zinc-600 dark:text-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-gray-700 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-gray-750 cursor-pointer text-zinc-600 dark:text-gray-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}