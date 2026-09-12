"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import {
  Package,
  CheckCircle,
  Plus,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/lib/axios";

interface GearCategory {
  id?: string;
  name?: string;
  slug?: string;
}

interface GearItem {
  id: string;
  title: string;
  pricePerDay: number;
  isAvailable: boolean;
  category?: string | GearCategory;
  images: string[];
}

export default function ProviderDashboardPage() {
  const [gears, setGears] = useState<GearItem[]>([]);
  const [stats, setStats] = useState({
    totalGear: 0,
    activeRentals: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");

      if (!token) {
        toast.warning("Please login as a Provider");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // দুটি রিকোয়েস্ট আলাদাভাবে ট্রাই-ক্যাচে সুরক্ষিত
      const [gearResult, ordersResult] = await Promise.allSettled([
        api.get(`/api/provider/gear?_t=${Date.now()}`, config).then((r) => r.data),
        api.get(`/api/provider/orders?_t=${Date.now()}`, config).then((r) => r.data),
      ]);

      let gearData: GearItem[] = [];
      let ordersData: any[] = [];

      // ১. গিয়ার ডেটা পার্সিং
      if (gearResult.status === "fulfilled") {
        const rawGear = gearResult.value?.data || gearResult.value || [];
        gearData = Array.isArray(rawGear) ? rawGear : [];
        setGears(gearData);
      } else {
        console.warn(
          "Provider Gear Fetch Warning:",
          gearResult.reason?.response?.data || gearResult.reason
        );
      }

      // ২. অর্ডার ডেটা পার্সিং
      if (ordersResult.status === "fulfilled") {
        const rawOrders = ordersResult.value?.data || ordersResult.value || [];
        ordersData = Array.isArray(rawOrders) ? rawOrders : [];
      } else {
        console.warn(
          "Provider Orders Fetch Warning (Status 500):",
          ordersResult.reason?.response?.data || ordersResult.reason
        );
      }

      // 🎯 Active Rentals: শুধুমাত্র PAID স্ট্যাটাস থাকা অর্ডারগুলো গণনা হবে
      const activeRentalsCount = ordersData.filter((o: any) => {
        return (o.status || "").toUpperCase() === "PAID";
      }).length;

      // 🎯 Pending Orders: PLACED অথবা PENDING স্ট্যাটাস
      const pendingOrdersCount = ordersData.filter((o: any) => {
        const s = (o.status || "").toUpperCase();
        return s === "PLACED" || s === "PENDING";
      }).length;

      setStats({
        totalGear: gearData.length,
        activeRentals: activeRentalsCount,
        pendingOrders: pendingOrdersCount,
      });

      if (gearResult.status === "rejected" && ordersResult.status === "rejected") {
        toast.error("Failed to load dashboard data. Please try again.");
      }
    } catch (err) {
      console.error("Dashboard general runtime error:", err);
      toast.error("Failed to load dashboard information");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleToggleAvailability = async (
    gearId: string,
    currentStatus: boolean
  ) => {
    setTogglingId(gearId);
    try {
      const token = Cookies.get("accessToken");
      await api.patch(
        `/api/provider/gear/${gearId}`,
        { isAvailable: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGears((prev) =>
        prev.map((g) =>
          g.id === gearId ? { ...g, isAvailable: !currentStatus } : g
        )
      );
      toast.success("Stock status updated");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update availability"
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteGear = async (gearId: string) => {
    if (!confirm("Are you sure you want to remove this gear listing?")) return;

    try {
      const token = Cookies.get("accessToken");
      await api.delete(`/api/provider/gear/${gearId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGears((prev) => prev.filter((g) => g.id !== gearId));
      setStats((prev) => ({
        ...prev,
        totalGear: Math.max(0, prev.totalGear - 1),
      }));
      toast.success("Gear listing deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete gear");
    }
  };

  // Helper ফাংশন: ক্যাটাগরি অবজেক্ট হলেও ক্র্যাশ হতে দেবে না
  const renderCategoryName = (category: string | GearCategory | undefined) => {
    if (!category) return "General";
    if (typeof category === "object") {
      return category.name || category.slug || "General";
    }
    return String(category);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Provider Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            Monitor your rental listings and store operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl text-zinc-600 transition cursor-pointer shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/dashboard/provider/orders"
            className="inline-flex items-center gap-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Manage Orders
          </Link>
          <Link
            href="/dashboard/provider/addgear"
            className="inline-flex items-center gap-2 bg-[#285724] hover:bg-[#1f441c] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Gear
          </Link>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Gear Listed */}
        <div className="bg-white p-5 border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-zinc-100 rounded-xl text-[#285724]">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium">
              Total Gear Listed
            </p>
            <h3 className="text-2xl font-bold text-zinc-900">
              {stats.totalGear}
            </h3>
          </div>
        </div>

        {/* Pending Orders */}
        <Link
          href="/dashboard/provider/orders"
          className="bg-white p-5 border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm hover:border-amber-300 transition group"
        >
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500 font-medium">
                Pending Orders
              </p>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-600 transition" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900">
              {stats.pendingOrders}
            </h3>
          </div>
        </Link>

        {/* 👈 Active Rentals (ক্লিক করলে ?status=PAID ফিল্টার করা অর্ডারে নিয়ে যাবে) */}
        <Link
          href="/dashboard/provider/orders?status=PAID"
          className="bg-white p-5 border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm hover:border-emerald-300 transition group"
        >
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500 font-medium">Active Rentals</p>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600 transition" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900">
              {stats.activeRentals}
            </h3>
          </div>
        </Link>
      </div>

      {/* Inventory Quick Preview & Actions */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-zinc-900">
            Inventory Overview
          </h2>
          <span className="text-xs text-zinc-400">
            Showing {gears.length} items
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="w-4 h-4 animate-spin text-[#285724]" />
            <span>Loading inventory items...</span>
          </div>
        ) : gears.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs text-zinc-500 mb-2">
              No inventory found. Click &quot;Add Gear&quot; to publish listings.
            </p>
            <Link
              href="/dashboard/provider/addgear"
              className="text-xs text-[#285724] font-bold underline"
            >
              Add your first gear listing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 font-medium">
                  <th className="py-3 px-2">Gear Details</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Rate / Day</th>
                  <th className="py-3 px-2">Stock Toggle</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {gears.map((gear) => (
                  <tr key={gear.id} className="hover:bg-zinc-50/60 transition">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                          {gear.images?.[0] ? (
                            <Image
                              src={gear.images[0]}
                              alt={gear.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-zinc-400 absolute inset-0 m-auto" />
                          )}
                        </div>
                        <span className="font-semibold text-zinc-900 line-clamp-1 max-w-50 sm:max-w-xs">
                          {gear.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-zinc-600">
                      {renderCategoryName(gear.category)}
                    </td>
                    <td className="py-3 px-2 font-medium">
                      ৳{gear.pricePerDay}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        disabled={togglingId === gear.id}
                        onClick={() =>
                          handleToggleAvailability(gear.id, gear.isAvailable)
                        }
                        className="inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {gear.isAvailable ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-semibold">
                            <ToggleRight className="w-4 h-4 text-emerald-600" />{" "}
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200 text-[10px] font-semibold">
                            <ToggleLeft className="w-4 h-4 text-zinc-400" /> Out
                            of Stock
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleDeleteGear(gear.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
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
      </div>
    </div>
  );
}