// app/dashboard/provider/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  Package,
  CheckCircle,
  Clock,
  Plus,
  Loader2,
  RefreshCw,
  ShoppingBag,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Gear {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
  category?: any;
  pricePerDay?: number;
  price?: number;
  imageUrl?: string;
  image?: string;
  images?: string[];
  isAvailable?: boolean;
}

interface RentalOrder {
  id?: string;
  _id?: string;
  gearId?: string | any;
  gear?: any;
  gearName?: string;
  customer?: any;
  user?: any;
  customerName?: string;
  customerEmail?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  rentalDays?: number;
  status:
    | "Pending"
    | "Confirmed"
    | "Picked Up"
    | "Returned"
    | "CANCELLED"
    | string;
  createdAt?: string;
}

export default function ProviderOverviewPage() {
  const [gearList, setGearList] = useState<Gear[]>([]);
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // ১. ব্যাকএন্ড থেকে গিয়ার ও রেন্টাল অর্ডার ফেচ করা
  const fetchProviderData = useCallback(async () => {
    try {
      // আপনার ব্যাকএন্ডের গিয়ার এবং রেন্টাল রুটগুলো কল করা হচ্ছে
      const [gearsRes, rentalsRes] = await Promise.allSettled([
        api.get("/api/gear"),
        api.get("/api/rentals"),
      ]);

      if (gearsRes.status === "fulfilled") {
        const data = gearsRes.value.data?.data || gearsRes.value.data || [];
        setGearList(Array.isArray(data) ? data : []);
      }

      if (rentalsRes.status === "fulfilled") {
        const data = rentalsRes.value.data?.data || rentalsRes.value.data || [];
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load provider data", err);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProviderData();
  }, [fetchProviderData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchProviderData();
  };

  // ২. অর্ডার স্ট্যাটাস আপডেট হ্যান্ডলার (PATCH/PUT)
  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.patch(`/api/rentals/${orderId}`, { status: nextStatus });
      toast.success(`Order status updated to ${nextStatus}`);
      fetchProviderData(); // রিলোড
    } catch (err: any) {
      // যদি PATCH ফেইল করে PUT দিয়ে ট্রাই করবে
      try {
        await api.put(`/api/rentals/${orderId}`, { status: nextStatus });
        toast.success(`Order status updated to ${nextStatus}`);
        fetchProviderData();
      } catch (putErr) {
        toast.error("Failed to update status");
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // মেট্রিক ক্যালকুলেশন
  const totalGearCount = gearList.length;
  const availableGearCount = gearList.filter(
    (g) => g.isAvailable !== false,
  ).length;
  const totalBookingsCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status?.toUpperCase() === "PENDING",
  ).length;

  return (
    <div className="space-y-8 mt-12 pb-12">
      {/* টপ হেডার */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
            Provider Dashboard
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time incoming customer rental requests and gear inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-xl shadow-xs transition disabled:opacity-50"
            title="Refresh Orders"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isRefreshing ? "animate-spin text-[#2e5328]" : ""
              }`}
            />
          </button>
          <Link
            href="/dashboard/provider/gear/new"
            className="inline-flex items-center gap-2 bg-[#2e5328] hover:bg-[#244220] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" /> Add Gear
          </Link>
        </div>
      </div>

      {/* মেট্রিক কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#eff5ed] text-[#2e5328] rounded-xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Total Gear
            </p>
            <p className="text-2xl font-black text-zinc-950">
              {totalGearCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Ready to Rent
            </p>
            <p className="text-2xl font-black text-zinc-950">
              {availableGearCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Total Bookings
            </p>
            <p className="text-2xl font-black text-zinc-950">
              {totalBookingsCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Pending Action
            </p>
            <p className="text-2xl font-black text-zinc-950">
              {pendingOrdersCount}
            </p>
          </div>
        </div>
      </div>

      {/* কাস্টমারদের অর্ডার টেবিল (Recent Customer Orders) */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-zinc-950 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#2e5328]" />
              Incoming Customer Rentals (অর্ডারসমূহ)
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              কাস্টমার যখন &quot;Rent Now&quot; বাটনে ক্লিক করে বুকিং করেছে,
              তাদের তালিকা নিচে দেখুন।
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-[#eff5ed] text-[#2e5328] rounded-full">
            {orders.length} Total Orders
          </span>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center text-zinc-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#2e5328] mr-2" />
            Loading customer bookings...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400">
            এখনও কোনো কাস্টমার বুকিং করেনি। কাস্টমার একাউন্ট দিয়ে রেন্ট করার
            সাথে সাথে এখানে নাম ও আইটেম চলে আসবে।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#fafbfa] border-b border-zinc-100 text-zinc-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3.5 px-5">Order ID</th>
                  <th className="py-3.5 px-5">Rented Gear</th>
                  <th className="py-3.5 px-5">Customer Info</th>
                  <th className="py-3.5 px-5">Rental Duration</th>
                  <th className="py-3.5 px-5">Total Paid</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700 font-medium">
                {orders.map((order) => {
                  const orderId = order.id || order._id || "N/A";
                  const gearTitle =
                    order.gearName ||
                    order.gear?.title ||
                    order.gear?.name ||
                    "Gear Item";
                  const customerName =
                    order.customerName ||
                    order.customer?.name ||
                    order.user?.name ||
                    "Verified Customer";
                  const customerEmail =
                    order.customerEmail ||
                    order.customer?.email ||
                    order.user?.email ||
                    "";
                  const formattedStart = order.startDate
                    ? new Date(order.startDate).toLocaleDateString()
                    : "N/A";
                  const formattedEnd = order.endDate
                    ? new Date(order.endDate).toLocaleDateString()
                    : "N/A";

                  const currentStatus = order.status || "Pending";

                  return (
                    <tr
                      key={orderId}
                      className="hover:bg-zinc-50/60 transition"
                    >
                      <td className="py-4 px-5 font-mono text-zinc-400 font-semibold">
                        #{orderId.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-zinc-950 text-sm">
                          {gearTitle}
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                          {customerName}
                        </div>
                        {customerEmail && (
                          <div className="text-[11px] text-zinc-400 pl-5">
                            {customerEmail}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 text-zinc-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>
                            {formattedStart} &rarr; {formattedEnd}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-black text-zinc-950 text-sm">
                        ৳ {order.totalPrice}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            currentStatus.toUpperCase() === "PENDING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : currentStatus.toUpperCase() === "CONFIRMED"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : currentStatus.toUpperCase() === "PICKED UP"
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {updatingOrderId === orderId ? (
                          <span className="text-[11px] text-zinc-400">
                            Updating...
                          </span>
                        ) : (
                          <div className="inline-flex gap-1.5 justify-end">
                            {currentStatus.toUpperCase() === "PENDING" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(orderId, "Confirmed")
                                }
                                className="px-3 py-1.5 bg-[#2e5328] hover:bg-[#244220] text-white font-bold rounded-lg text-[11px] transition"
                              >
                                Confirm
                              </button>
                            )}
                            {currentStatus.toUpperCase() === "CONFIRMED" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(orderId, "Picked Up")
                                }
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition"
                              >
                                Mark Picked Up
                              </button>
                            )}
                            {currentStatus.toUpperCase() === "PICKED UP" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(orderId, "Returned")
                                }
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition"
                              >
                                Mark Returned
                              </button>
                            )}
                            {currentStatus.toUpperCase() === "RETURNED" && (
                              <span className="text-zinc-400 text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Completed
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
