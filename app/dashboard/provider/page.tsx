"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { getGearImage } from "@/lib/getImage";

interface IGear {
  id: string;
  _id?: string;
  title: string;
  brand?: string;
  pricePerDay: number;
  stockQuantity: number;
  isAvailable: boolean;
  images?: string[];
  description?: string;
}

export default function ProviderDashboardPage() {
  const [gearList, setGearList] = useState<IGear[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGear, setSelectedGear] = useState<IGear | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // ১. প্রোভাইডারের গিয়ার লিস্ট লোড
      let gearRes;
      try {
        gearRes = await api.get("/api/gear/my-listings");
      } catch (err) {
        gearRes = await api.get("/api/gear");
      }
      const rawGear = gearRes.data?.data || gearRes.data;
      setGearList(Array.isArray(rawGear) ? rawGear : []);

      // ২. ইনকামিং অর্ডারসমূহ লোড
      let orderRes;
      try {
        orderRes = await api.get("/api/rentals/provider-orders");
      } catch (err) {
        orderRes = await api.get("/api/rentals");
      }
      const rawOrders = orderRes.data?.data || orderRes.data;
      setOrders(Array.isArray(rawOrders) ? rawOrders : []);
    } catch (err) {
      console.error("Failed to fetch dashboard overview:", err);
    } finally {
      setLoading(false);
    }
  };

  // Availability Toggle Logic
  const handleToggleAvailability = async (gear: IGear) => {
    const targetId = gear.id || gear._id;
    try {
      const updatedStatus = !gear.isAvailable;
      await api.patch(`/api/gear/${targetId}`, { isAvailable: updatedStatus });

      setGearList((prev) =>
        prev.map((item) =>
          (item.id || item._id) === targetId
            ? { ...item, isAvailable: updatedStatus }
            : item,
        ),
      );
      toast.success("Availability updated!", { position: "top-center" });
    } catch (err) {
      toast.error("Failed to update availability status", {
        position: "top-center",
      });
    }
  };

  // Delete Gear
  const handleDeleteGear = async (gearId: string) => {
    if (!confirm("Are you sure you want to remove this item from inventory?"))
      return;

    try {
      await api.delete(`/api/gear/${gearId}`);
      toast.success("Gear item removed successfully!", {
        position: "top-center",
      });
      setGearList((prev) =>
        prev.filter((item) => (item.id || item._id) !== gearId),
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove item", {
        position: "top-center",
      });
    }
  };

  // Edit Modal Submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGear) return;
    const targetId = selectedGear.id || selectedGear._id;

    setUpdating(true);
    try {
      await api.patch(`/api/gear/${targetId}`, {
        title: selectedGear.title,
        brand: selectedGear.brand,
        pricePerDay: Number(selectedGear.pricePerDay),
        stockQuantity: Number(selectedGear.stockQuantity),
        description: selectedGear.description,
      });

      toast.success("Gear details updated successfully!", {
        position: "top-center",
      });
      setEditModalOpen(false);
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update gear", {
        position: "top-center",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Stats Calculations
  const totalGearListed = gearList.length;
  const activeRentals = orders.filter(
    (o) => o.status === "APPROVED" || o.status === "PICKED_UP",
  ).length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overview Cards Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Quick analytics on inventory and active orders
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  Total Gear Listed
                </p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {totalGearListed}
                </h3>
              </div>
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-lg">
                📦
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  Active Rentals
                </p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">
                  {activeRentals}
                </h3>
              </div>
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-lg">
                🔄
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  Pending Orders
                </p>
                <h3 className="text-2xl font-bold text-amber-600 mt-1">
                  {pendingOrders}
                </h3>
              </div>
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-lg">
                ⏳
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Management Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Inventory Management
            </h2>
            <p className="text-xs text-gray-500">
              Edit, remove, or change gear availability
            </p>
          </div>
          <Link
            href="/dashboard/provider/add-gear"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-purple-700 transition"
          >
            + Add New Gear
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-12 text-gray-500">
            Loading inventory...
          </p>
        ) : gearList.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
            No equipment listed yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gearList.map((item) => {
              const targetId = item.id || item._id || "";
              return (
                <div
                  key={targetId}
                  className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-gray-100">
                      <img
                        src={getGearImage(item)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase cursor-pointer transition ${
                          item.isAvailable
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 text-base line-clamp-1">
                        {item.title}
                      </h3>
                      {item.brand && (
                        <p className="text-xs text-gray-400">
                          Brand: {item.brand}
                        </p>
                      )}

                      <div className="mt-3 flex justify-between items-center border-t pt-2">
                        <p className="text-sm font-bold text-purple-600">
                          ৳{item.pricePerDay}/day
                        </p>
                        <p className="text-xs text-gray-600">
                          Stock: {item.stockQuantity} pcs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 border-t flex justify-between items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedGear(item);
                        setEditModalOpen(true);
                      }}
                      className="text-xs border border-gray-300 px-3 py-1.5 rounded text-gray-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGear(targetId)}
                      className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded font-semibold hover:bg-red-100 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Gear Modal */}
      {editModalOpen && selectedGear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Edit Gear Listing
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full border p-2 rounded-lg text-sm"
                  value={selectedGear.title}
                  onChange={(e) =>
                    setSelectedGear({ ...selectedGear, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price/Day (৳)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full border p-2 rounded-lg text-sm"
                    value={selectedGear.pricePerDay}
                    onChange={(e) =>
                      setSelectedGear({
                        ...selectedGear,
                        pricePerDay: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full border p-2 rounded-lg text-sm"
                    value={selectedGear.stockQuantity}
                    onChange={(e) =>
                      setSelectedGear({
                        ...selectedGear,
                        stockQuantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="border px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-purple-700 disabled:bg-gray-400"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
