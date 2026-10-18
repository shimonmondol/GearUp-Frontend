"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Trash2,
  Loader2,
  RefreshCw,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/lib/axios";

interface GearItem {
  id: string;
  title: string;
  brand: string;
  pricePerDay: number;
  isAvailable: boolean;
  stockQuantity?: number;
  images: string[];
  provider: { name: string; email: string };
  category?: { name: string };
}

// Skeleton Loader Component for Table Rows
function TableSkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-zinc-100 dark:border-gray-700/60">
          {/* Gear Details Skeleton */}
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-gray-700 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-35">
                <div className="h-3.5 bg-zinc-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-2.5 bg-zinc-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </td>
          {/* Category Skeleton */}
          <td className="p-4">
            <div className="h-5 w-16 bg-zinc-200 dark:bg-gray-700 rounded-full" />
          </td>
          {/* Provider Skeleton */}
          <td className="p-4">
            <div className="space-y-1.5 max-w-30">
              <div className="h-3.5 bg-zinc-200 dark:bg-gray-700 rounded w-4/5" />
              <div className="h-2.5 bg-zinc-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </td>
          {/* Rate Skeleton */}
          <td className="p-4">
            <div className="h-4 w-12 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>
          {/* Status Skeleton */}
          <td className="p-4">
            <div className="h-5 w-14 bg-zinc-200 dark:bg-gray-700 rounded-full" />
          </td>
          {/* Action Button Skeleton */}
          <td className="p-4 text-right">
            <div className="h-8 w-8 bg-zinc-200 dark:bg-gray-700 rounded-xl inline-block" />
          </td>
        </tr>
      ))}
    </>
  );
}

function GearsContent() {
  const searchParams = useSearchParams();
  const initialAvailability = searchParams.get("status") || "all";

  const [gears, setGears] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [availability] = useState(initialAvailability);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 8;

  const fetchGears = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const queryParams = new URLSearchParams({
        search: search.trim(),
        availability: availability,
        page: String(page),
        limit: String(limit),
        _t: String(Date.now()),
      });

      const res = await api.get(`/api/admin/gears?${queryParams.toString()}`, config);
      const data = res.data?.data;
      setGears(data?.gears || []);
      setTotalPages(data?.pagination?.totalPages || 1);
      setTotalCount(data?.pagination?.total || 0);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load gear listings");
    } finally {
      setLoading(false);
    }
  }, [search, availability, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGears();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchGears]);

  const handleDelete = async (gearId: string) => {
    if (!confirm("Are you sure you want to remove this listing?")) return;

    setDeletingId(gearId);
    try {
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await api.delete(`/api/admin/gears/${gearId}`, config);
      toast.success("Listing removed successfully");
      setGears((prev) => prev.filter((g) => g.id !== gearId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove listing");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-200/80 dark:border-gray-700 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
            Gear Listings & Inventory
          </h1>
          <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
            Audit inventory, review gear rates, and moderate platform rental items.
          </p>
        </div>
        <button
          onClick={fetchGears}
          className="p-2 border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-gray-700 text-zinc-600 dark:text-gray-300 transition shadow-xs self-start sm:self-auto cursor-pointer"
          title="Reload listings"
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
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-gray-100">Equipment Catalog</h2>
              <p className="text-[11px] text-zinc-400 dark:text-gray-400">Total: {totalCount} items</p>
            </div>
          </div>

          {/* Search Box with proper Dark Mode support */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by provider or title..."
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

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-50/70 dark:bg-gray-700/50 border-b border-zinc-200/80 dark:border-gray-700 text-zinc-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-bold">Gear Details</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Provider</th>
                <th className="p-4 font-bold">Rate / Day</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-gray-700/60">
              {loading ? (
                <TableSkeletonRows count={limit} />
              ) : gears.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Package className="w-8 h-8 text-zinc-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500 dark:text-gray-400">
                      {search ? `No gear found matching "${search}"` : "No gear listings available."}
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
                gears.map((g) => (
                  <tr
                    key={g.id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-gray-700/40 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-gray-700 shrink-0 border border-zinc-200 dark:border-gray-600">
                          {g.images?.[0] ? (
                            <Image
                              src={g.images[0]}
                              alt={g.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-zinc-400 dark:text-gray-400 absolute inset-0 m-auto" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-gray-100 line-clamp-1">{g.title}</p>
                          <p className="text-[11px] text-zinc-400 dark:text-gray-400">{g.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-zinc-100 dark:bg-gray-700 border-zinc-200 dark:border-gray-600 text-zinc-700 dark:text-gray-300">
                        {g.category?.name || "General"}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-zinc-800 dark:text-gray-200">{g.provider?.name || "Provider"}</p>
                      <p className="text-[11px] text-zinc-400 dark:text-gray-400">{g.provider?.email}</p>
                    </td>
                    <td className="p-4 font-black text-zinc-900 dark:text-gray-100">
                      ৳{g.pricePerDay}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          g.isAvailable
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                            : "bg-zinc-100 text-zinc-600 dark:bg-gray-700/60 dark:text-zinc-400 border-zinc-200 dark:border-gray-600"
                        }`}
                      >
                        {g.isAvailable ? "Active" : "Unavailable"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={deletingId === g.id}
                        onClick={() => handleDelete(g.id)}
                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition disabled:opacity-40 cursor-pointer"
                        title="Delete listing"
                      >
                        {deletingId === g.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
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
            of <strong className="text-zinc-800 dark:text-gray-200">{totalCount}</strong> gears
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

export default function AdminGearsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-10 bg-zinc-200 dark:bg-gray-800 rounded-xl w-1/3" />
          <div className="h-64 bg-zinc-200 dark:bg-gray-800 rounded-3xl" />
        </div>
      }
    >
      <GearsContent />
    </Suspense>
  );
}