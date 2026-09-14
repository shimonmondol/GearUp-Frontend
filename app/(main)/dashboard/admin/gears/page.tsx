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

function GearsContent() {
  const searchParams = useSearchParams();
  const initialAvailability = searchParams.get("status") || "all";

  const [gears, setGears] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search, Availability & Pagination States
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
    <main className="min-h-screen w-full bg-white pt-16 sm:pt-20 pb-12 mt-6">
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900">
              Total Gear (Active)
            </h1>
          </div>
          <button
            onClick={fetchGears}
            className="p-2.5 border border-zinc-200 bg-white rounded-xl hover:bg-zinc-50 text-zinc-600 transition shadow-sm self-start sm:self-auto cursor-pointer"
            title="Reload listings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Table Container */}
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
                placeholder="Search by provider name or email..."
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
              Total Gears: <strong className="text-zinc-800">{totalCount}</strong>
            </span>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="py-20 flex justify-center items-center gap-2 text-xs text-zinc-500">
              <Loader2 className="w-5 h-5 animate-spin text-[#285724]" /> Loading gear items...
            </div>
          ) : gears.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">
                {search ? `No gear found matching "${search}"` : "No gear listings available."}
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
                    <th className="p-4">Gear Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Provider</th>
                    <th className="p-4">Rate / Day</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {gears.map((g) => (
                    <tr key={g.id} className="hover:bg-zinc-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                            {g.images?.[0] ? (
                              <Image
                                src={g.images[0]}
                                alt={g.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-zinc-400 absolute inset-0 m-auto" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 line-clamp-1">{g.title}</p>
                            <p className="text-[11px] text-zinc-400">{g.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-600">{g.category?.name || "General"}</td>
                      <td className="p-4">
                        <p className="font-medium text-zinc-800">{g.provider?.name || "Provider"}</p>
                        <p className="text-[11px] text-zinc-400">{g.provider?.email}</p>
                      </td>
                      <td className="p-4 font-bold text-zinc-900">৳{g.pricePerDay}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            g.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-zinc-100 text-zinc-600 border-zinc-200"
                          }`}
                        >
                          {g.isAvailable ? "Active" : "Unavailable"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          disabled={deletingId === g.id}
                          onClick={() => handleDelete(g.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-40 cursor-pointer"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
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
              of <strong className="text-zinc-800">{totalCount}</strong> gears
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

export default function AdminGearsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-white py-24 flex justify-center items-center gap-2 text-xs text-zinc-500">
          <Loader2 className="w-5 h-5 animate-spin text-[#285724]" /> Loading...
        </div>
      }
    >
      <GearsContent />
    </Suspense>
  );
}