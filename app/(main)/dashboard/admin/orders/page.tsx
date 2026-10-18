"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  ArrowLeft,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Receipt,
  RefreshCw,
  X,
  ShoppingBag,
} from "lucide-react";
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

// Order Table Skeleton Rows
function OrderTableSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-zinc-100 dark:border-gray-700/60">
          {/* Order ID Skeleton */}
          <td className="p-4">
            <div className="h-3 w-16 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>

          {/* Customer Details Skeleton */}
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-gray-700 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-[140px]">
                <div className="h-3.5 bg-zinc-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-2.5 bg-zinc-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          </td>

          {/* Gear Item Skeleton */}
          <td className="p-4">
            <div className="space-y-1.5 max-w-[160px]">
              <div className="h-3.5 bg-zinc-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-2.5 bg-zinc-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </td>

          {/* Total Price Skeleton */}
          <td className="p-4">
            <div className="h-4 w-14 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>

          {/* Status Badge Skeleton */}
          <td className="p-4">
            <div className="h-5 w-20 bg-zinc-200 dark:bg-gray-700 rounded-full" />
          </td>

          {/* Booking Date Skeleton */}
          <td className="p-4 text-right">
            <div className="h-3.5 w-18 bg-zinc-200 dark:bg-gray-700 rounded inline-block" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination States
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const queryParams = new URLSearchParams({
        search: search.trim(),
        page: String(page),
        limit: String(limit),
        _t: String(Date.now()),
      });

      const res = await api.get(`/api/admin/orders?${queryParams.toString()}`, config);
      const data = res.data?.data;
      setOrders(data?.orders || []);
      setTotalPages(data?.pagination?.totalPages || 1);
      setTotalCount(data?.pagination?.total || 0);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load platform orders");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-200/80 dark:border-gray-700 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
            Total Rental Orders
          </h1>
          <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
            Track customer equipment bookings, transaction statuses, and total invoices.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-gray-700 text-zinc-600 dark:text-gray-300 transition shadow-xs self-start sm:self-auto cursor-pointer"
          title="Reload records"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl shadow-xs overflow-hidden">
        {/* Search Bar Container */}
        <div className="p-5 sm:p-6 border-b border-zinc-200/80 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-zinc-100 dark:bg-gray-700 text-zinc-700 dark:text-gray-200">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-gray-100">Order Transactions</h2>
              <p className="text-[11px] text-zinc-400 dark:text-gray-400">Total: {totalCount} records</p>
            </div>
          </div>

          {/* Search Box with dark mode support */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search customer name or email..."
              className="w-full bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-10 pr-8 py-2 text-xs text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] focus:border-[#2e5328] dark:focus:border-[#5fa352] transition-colors"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-200 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Table Records */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-50/70 dark:bg-gray-700/50 border-b border-zinc-200/80 dark:border-gray-700 text-zinc-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Gear Item</th>
                <th className="p-4 font-bold">Total Amount</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Booking Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-gray-700/60">
              {loading ? (
                <OrderTableSkeleton count={limit} />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Receipt className="w-8 h-8 text-zinc-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500 dark:text-gray-400">
                      {search ? `No orders found matching "${search}"` : "No rental orders found."}
                    </p>
                    {search && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setPage(1);
                        }}
                        className="mt-2 text-xs text-[#2e5328] dark:text-[#5fa352] font-semibold underline cursor-pointer"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const items = ord.orderItems || [];
                  const firstGearTitle = items[0]?.gear?.title || "Rental Gear";

                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-zinc-50/60 dark:hover:bg-gray-700/40 transition"
                    >
                      <td className="p-4 font-mono text-[11px] text-zinc-500 dark:text-gray-400">
                        #{ord.id.slice(0, 8)}...
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#2e5328]/15 dark:bg-[#3b663b]/30 text-[#2e5328] dark:text-emerald-400 font-bold flex items-center justify-center uppercase shrink-0">
                            {ord.customer?.name ? ord.customer.name[0] : "C"}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-gray-100">{ord.customer?.name || "Customer"}</p>
                            <p className="text-[11px] text-zinc-400 dark:text-gray-400">{ord.customer?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-zinc-900 dark:text-gray-100 line-clamp-1">{firstGearTitle}</p>
                        {items.length > 1 && (
                          <p className="text-[10px] text-zinc-400 dark:text-gray-400">
                            +{items.length - 1} other item{items.length - 1 > 1 ? "s" : ""}
                          </p>
                        )}
                      </td>
                      <td className="p-4 font-black text-zinc-900 dark:text-gray-100">
                        ৳{ord.totalPrice}
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

        {/* Pagination Controls */}
        <div className="p-4 sm:p-5 border-t border-zinc-200/80 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500 dark:text-gray-400">
          <div>
            Showing{" "}
            <strong className="text-zinc-800 dark:text-gray-200">
              {totalCount > 0 ? (page - 1) * limit + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong className="text-zinc-800 dark:text-gray-200">
              {Math.min(page * limit, totalCount)}
            </strong>{" "}
            of <strong className="text-zinc-800 dark:text-gray-200">{totalCount}</strong> orders
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 border border-zinc-200 dark:border-gray-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-gray-700 disabled:opacity-40 cursor-pointer transition text-zinc-600 dark:text-gray-300"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-zinc-400 dark:text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`min-w-7 h-7 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                        page === p
                          ? "bg-[#2e5328] dark:bg-[#3b663b] text-white shadow-xs"
                          : "border border-zinc-200 dark:border-gray-700 text-zinc-600 dark:text-gray-300 hover:bg-zinc-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 border border-zinc-200 dark:border-gray-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-gray-700 disabled:opacity-40 cursor-pointer transition text-zinc-600 dark:text-gray-300"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}