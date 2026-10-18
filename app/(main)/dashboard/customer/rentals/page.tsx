"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  FolderOpen,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

interface RentalOrder {
  _id?: string;
  id?: string;
  gearId?: string;
  gear?: any;
  gearTitle?: string;
  gearName?: string;
  title?: string;
  name?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  totalPrice?: number;
  totalCost?: number;
  totalAmount?: number;
  amount?: number;
  status: string;
  createdAt?: string;
  orderItems?: any[];
  items?: any[];
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80";

// Skeleton Loader Component for Table Rows
function RentalsTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-zinc-100 dark:border-gray-700/60">
          <td className="py-3.5 px-4">
            <div className="h-3.5 w-16 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>
          <td className="py-3.5 px-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-gray-700 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-[150px]">
                <div className="h-3.5 bg-zinc-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-2.5 bg-zinc-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </td>
          <td className="py-3.5 px-4">
            <div className="h-3.5 w-32 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>
          <td className="py-3.5 px-4">
            <div className="h-4 w-16 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>
          <td className="py-3.5 px-4">
            <div className="h-5 w-20 bg-zinc-200 dark:bg-gray-700 rounded-full" />
          </td>
          <td className="py-3.5 px-4 text-right">
            <div className="h-4 w-14 bg-zinc-200 dark:bg-gray-700 rounded inline-block" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function CustomerRentalsPage() {
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ব্যাকএন্ড API থেকে আসল রেন্টাল ডেটা ফেচ করা
  const fetchMyRentals = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await api.get(`/api/orders/my-orders?_t=${Date.now()}`, config);
      const raw =
        res.data?.data?.orders ||
        res.data?.data?.rentals ||
        res.data?.data ||
        res.data?.orders ||
        res.data?.rentals ||
        res.data?.result ||
        res.data;

      const list = Array.isArray(raw) ? raw : [];
      setRentals(list);
    } catch (err: any) {
      try {
        const token = Cookies.get("accessToken");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const fallbackRes = await api.get(`/api/rentals/my-rentals?_t=${Date.now()}`, config);
        const fallbackRaw =
          fallbackRes.data?.data ||
          fallbackRes.data?.result ||
          fallbackRes.data?.orders ||
          fallbackRes.data ||
          [];
        setRentals(Array.isArray(fallbackRaw) ? fallbackRaw : []);
      } catch (fallbackErr: any) {
        toast.error(fallbackErr.response?.data?.message || "Failed to load live rental records");
        setRentals([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyRentals();
  }, [fetchMyRentals]);

  // ব্যাকএন্ড অবজেক্ট থেকে আসল গিয়ার টাইটেল ও ছবি এক্সট্রাক্ট করার হেল্পার
  const extractGearInfo = useCallback((item: any) => {
    const primaryGear =
      item.orderItems?.[0]?.gear ||
      item.items?.[0]?.gear ||
      item.gear ||
      item.gearItem ||
      item.orderItems?.[0] ||
      {};

    const title =
      primaryGear.title ||
      primaryGear.name ||
      primaryGear.gearName ||
      item.gearTitle ||
      item.gearName ||
      item.title ||
      item.name ||
      item.orderItems?.[0]?.title ||
      item.orderItems?.[0]?.name ||
      "Gear #" + (item.id || item._id || "").slice(-6).toUpperCase();

    const category =
      primaryGear.category ||
      primaryGear.categoryName ||
      item.category ||
      "Outdoor Equipment";

    const image =
      (Array.isArray(primaryGear.images) && primaryGear.images[0]) ||
      primaryGear.image ||
      primaryGear.thumbnail ||
      (Array.isArray(item.images) && item.images[0]) ||
      item.image ||
      DEFAULT_IMAGE;

    const gearId =
      primaryGear._id ||
      primaryGear.id ||
      item.gearId ||
      item.orderItems?.[0]?.gearId ||
      "";

    return { title, category, image, gearId };
  }, []);

  // ফিল্টারিং ও সার্চ লজিক
  const filteredRentals = useMemo(() => {
    return rentals.filter((item) => {
      const orderId = (item.id || item._id || "").toLowerCase();
      const { title, category } = extractGearInfo(item);
      const query = searchTerm.toLowerCase().trim();

      const matchSearch =
        !query ||
        orderId.includes(query) ||
        title.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query);

      const normalizedStatus = (item.status || "PENDING").toUpperCase();
      const matchStatus = statusFilter === "ALL" || normalizedStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [rentals, searchTerm, statusFilter, extractGearInfo]);

  // পেজিনেশন
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage) || 1;
  const paginatedRentals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRentals.slice(start, start + itemsPerPage);
  }, [filteredRentals, currentPage, itemsPerPage]);

  // লাইভ স্ট্যাটাস কাউন্ট
  const statusCounts = useMemo(() => {
    const total = rentals.length;
    let active = 0;
    let completed = 0;
    let pending = 0;

    rentals.forEach((r) => {
      const s = (r.status || "").toUpperCase();
      if (["ACTIVE", "ONGOING", "PICKED_UP"].includes(s)) active += 1;
      else if (["COMPLETED", "RETURNED", "PAID"].includes(s)) completed += 1;
      else if (["PENDING", "PLACED"].includes(s)) pending += 1;
    });

    return { total, active, completed, pending };
  }, [rentals]);

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
      case "ONGOING":
      case "PICKED_UP":
        return "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "COMPLETED":
      case "RETURNED":
      case "PAID":
        return "bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      case "PENDING":
      case "PLACED":
        return "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
      case "CANCELLED":
        return "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-gray-700 dark:text-gray-300 border border-zinc-200 dark:border-gray-600";
    }
  };

  const calculateDays = (start?: string, end?: string) => {
    if (!start || !end) return 1;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (isNaN(s) || isNaN(e)) return 1;
    const diff = Math.ceil((e - s) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 1;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-gray-700 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
            My Rental History
          </h1>
          <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
            Real database records of your equipment bookings, payment bills, and statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchMyRentals}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-zinc-200 dark:border-gray-700 hover:bg-zinc-50 dark:hover:bg-gray-700/60 text-xs font-semibold text-zinc-700 dark:text-gray-300 transition cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/gear"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white text-xs font-bold transition shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Rent New Gear</span>
          </Link>
        </div>
      </div>

      {/* 2. Overview Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-zinc-200/80 dark:border-gray-700 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-gray-400 text-xs font-semibold">
            <ShoppingBag className="w-4 h-4 text-[#2e5328] dark:text-[#5fa352]" />
            <span>Total Bookings</span>
          </div>
          <p className="text-xl font-bold text-zinc-900 dark:text-gray-100 mt-2">
            {loading ? (
              <span className="inline-block h-6 w-12 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              statusCounts.total
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-zinc-200/80 dark:border-gray-700 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Clock className="w-4 h-4" />
            <span>Active</span>
          </div>
          <p className="text-xl font-bold text-zinc-900 dark:text-gray-100 mt-2">
            {loading ? (
              <span className="inline-block h-6 w-12 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              statusCounts.active
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-zinc-200/80 dark:border-gray-700 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </div>
          <p className="text-xl font-bold text-zinc-900 dark:text-gray-100 mt-2">
            {loading ? (
              <span className="inline-block h-6 w-12 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              statusCounts.completed
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-zinc-200/80 dark:border-gray-700 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Pending</span>
          </div>
          <p className="text-xl font-bold text-zinc-900 dark:text-gray-100 mt-2">
            {loading ? (
              <span className="inline-block h-6 w-12 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              statusCounts.pending
            )}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ID, gear name, or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-8 pr-8 py-2 text-xs text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-200 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 border border-zinc-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-zinc-50 dark:bg-gray-900/60">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-semibold text-zinc-700 dark:text-gray-200 focus:outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-zinc-900 [&>option]:dark:text-gray-100"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Real Database Data Table */}
      <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/70 dark:bg-gray-700/50 border-b border-zinc-200/80 dark:border-gray-700 text-zinc-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Booking ID</th>
                <th className="py-3 px-4 font-bold">Equipment Details</th>
                <th className="py-3 px-4 font-bold">Duration</th>
                <th className="py-3 px-4 font-bold">Total Bill</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-gray-700 text-zinc-800 dark:text-gray-200">
              {loading ? (
                <RentalsTableSkeleton count={itemsPerPage} />
              ) : paginatedRentals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-zinc-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderOpen className="w-7 h-7 text-zinc-300 dark:text-gray-600" />
                      <p className="text-xs font-semibold text-zinc-600 dark:text-gray-300">
                        {searchTerm || statusFilter !== "ALL"
                          ? "No rental orders match your filter criteria."
                          : "No rental orders recorded in your account yet."}
                      </p>
                      {!searchTerm && statusFilter === "ALL" && (
                        <Link
                          href="/gear"
                          className="mt-1 text-xs text-[#2e5328] dark:text-[#5fa352] font-bold hover:underline"
                        >
                          Browse equipment catalog →
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRentals.map((item) => {
                  const orderId = item.id || item._id || "N/A";
                  const { title: gearTitle, category, image: gearImage, gearId } = extractGearInfo(item);

                  const total =
                    item.totalPrice ||
                    item.totalCost ||
                    item.totalAmount ||
                    item.amount ||
                    0;
                  const days = item.days || calculateDays(item.startDate, item.endDate);

                  return (
                    <tr
                      key={orderId}
                      className="hover:bg-zinc-50/60 dark:hover:bg-gray-700/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2e5328] dark:text-[#5fa352]">
                        #{orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-zinc-100 dark:bg-gray-700 shrink-0 border border-zinc-200/60 dark:border-gray-600">
                            <Image
                              src={gearImage}
                              alt={gearTitle}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-gray-100 line-clamp-1">
                              {gearTitle}
                            </p>
                            <span className="text-[10px] text-zinc-400 dark:text-gray-400">{category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-zinc-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span>
                            {formatDate(item.startDate || item.createdAt)} → {formatDate(item.endDate)}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 dark:text-gray-500 font-medium">
                          ({days} {days === 1 ? "day" : "days"})
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-zinc-900 dark:text-gray-100">
                        ৳ {Number(total).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {gearId ? (
                          <Link
                            href={`/gear/${gearId}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2e5328] dark:text-[#5fa352] hover:underline"
                          >
                            <span>Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-zinc-400 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-3.5 bg-zinc-50/50 dark:bg-gray-800/80 border-t border-zinc-200/80 dark:border-gray-700 flex items-center justify-between text-xs text-zinc-500 dark:text-gray-400">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredRentals.length)} of{" "}
              {filteredRentals.length} orders
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-gray-700 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-gray-700/60 cursor-pointer text-zinc-600 dark:text-gray-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-[#2e5328] dark:bg-[#3b663b] text-white shadow-xs"
                      : "border border-zinc-200 dark:border-gray-700 hover:bg-zinc-100 dark:hover:bg-gray-700/60 text-zinc-700 dark:text-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-gray-700 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-gray-700/60 cursor-pointer text-zinc-600 dark:text-gray-300 transition"
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