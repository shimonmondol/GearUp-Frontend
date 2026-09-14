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
      PLACED: "bg-amber-100 text-amber-800 border-amber-200",
      CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
      PAID: "bg-purple-100 text-purple-800 border-purple-200",
      PICKED_UP: "bg-emerald-100 text-emerald-800 border-emerald-200",
      RETURNED: "bg-zinc-100 text-zinc-700 border-zinc-200",
      CANCELLED: "bg-rose-100 text-rose-800 border-rose-200",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
          badges[status] || "bg-zinc-100 text-zinc-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <main className="min-h-screen w-full bg-white pt-16 sm:pt-20 pb-12 mt-6">
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900">Total Rental Orders</h1>
          </div>

          <button
            onClick={fetchOrders}
            className="p-2.5 border border-zinc-200 bg-white rounded-xl hover:bg-zinc-50 text-zinc-600 transition cursor-pointer shadow-sm self-start sm:self-auto"
            title="Reload records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Search by Name/Email */}
          <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by customer name or email..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#285724] transition placeholder:text-zinc-400"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs text-zinc-500 font-medium self-end sm:self-auto">
              Total Orders: <strong className="text-zinc-800">{totalCount}</strong>
            </span>
          </div>

          {/* Records */}
          {loading ? (
            <div className="py-20 flex justify-center items-center gap-2 text-xs text-zinc-500">
              <Loader2 className="w-5 h-5 animate-spin text-[#285724]" /> Loading platform orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <Receipt className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">
                {search ? `No orders found matching "${search}"` : "No rental orders found."}
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="mt-2 text-xs text-[#285724] font-semibold underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-zinc-50/70 border-b border-zinc-200 text-zinc-600">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Gear Details</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Booking Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((ord) => {
                    const items = ord.orderItems || [];
                    const firstGearTitle = items[0]?.gear?.title || "Rental Gear";

                    return (
                      <tr key={ord.id} className="hover:bg-zinc-50/50 transition">
                        <td className="p-4 font-mono text-[11px] text-zinc-500">
                          {ord.id.slice(0, 10)}...
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-zinc-900">{ord.customer?.name || "Customer"}</p>
                          <p className="text-[11px] text-zinc-400">{ord.customer?.email}</p>
                        </td>
                        <td className="p-4 text-zinc-800">
                          <p className="font-medium text-zinc-900 line-clamp-1">{firstGearTitle}</p>
                          {items.length > 1 && (
                            <p className="text-[10px] text-zinc-400">
                              +{items.length - 1} other item{items.length - 1 > 1 ? "s" : ""}
                            </p>
                          )}
                        </td>
                        <td className="p-4 font-bold text-zinc-900">৳{ord.totalPrice}</td>
                        <td className="p-4">{renderBadge(ord.status)}</td>
                        <td className="p-4 text-zinc-500">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="p-4 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500">
            <div>
              Showing{" "}
              <strong className="text-zinc-800">
                {totalCount > 0 ? (page - 1) * limit + 1 : 0}
              </strong>{" "}
              to{" "}
              <strong className="text-zinc-800">
                {Math.min(page * limit, totalCount)}
              </strong>{" "}
              of <strong className="text-zinc-800">{totalCount}</strong> orders
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 cursor-pointer transition"
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
                        <span className="px-1 text-zinc-400">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`min-w-7 h-7 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                          page === p
                            ? "bg-[#285724] text-white"
                            : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
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
                className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 cursor-pointer transition"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}