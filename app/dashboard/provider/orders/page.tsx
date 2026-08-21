"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "@/lib/axios";

interface IOrder {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice?: number;
  totalCost?: number;
  status:
    | "PENDING"
    | "APPROVED"
    | "PICKED_UP"
    | "RETURNED"
    | "REJECTED"
    | "CANCELLED";
  customer?: { name?: string; email?: string };
  gear?: { title?: string };
  orderItems?: any[];
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomingOrders();
  }, []);

  const fetchIncomingOrders = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.get("/api/rentals/provider-orders");
      } catch (err) {
        res = await api.get("/api/rentals");
      }

      const rawData = res.data?.data || res.data;
      setOrders(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      console.error("Failed to load incoming orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
  ) => {
    try {
      await api.patch(`/api/rentals/${orderId}/status`, { status: newStatus });

      toast.success(`Order status updated to ${newStatus}!`, {
        position: "top-center",
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as any } : order,
        ),
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Incoming Rental Orders
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage customer bookings and update rental state
        </p>
      </div>

      {loading ? (
        <p className="text-center py-12 text-gray-500">
          Loading incoming orders...
        </p>
      ) : orders.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          No incoming rental orders found.
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Item</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Total Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => {
                const total = order.totalPrice || order.totalCost || 0;
                const gearTitle =
                  order.gear?.title ||
                  order.orderItems?.[0]?.gear?.title ||
                  "Equipment Item";

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">
                        {order.customer?.name || "Customer"}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {order.customer?.email}
                      </p>
                    </td>

                    <td className="p-4 font-semibold text-gray-700">
                      {gearTitle}
                    </td>

                    <td className="p-4 text-xs text-gray-600">
                      {new Date(order.startDate).toLocaleDateString()} ➔{" "}
                      {new Date(order.endDate).toLocaleDateString()}
                    </td>

                    <td className="p-4 font-bold text-purple-600">৳{total}</td>

                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          order.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "PICKED_UP"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "RETURNED"
                                ? "bg-gray-100 text-gray-700"
                                : order.status === "PENDING"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {order.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "APPROVED")
                              }
                              className="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-green-700 cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "REJECTED")
                              }
                              className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded text-xs font-semibold hover:bg-red-100 cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {order.status === "APPROVED" && (
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "PICKED_UP")
                            }
                            className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                          >
                            Mark Picked Up
                          </button>
                        )}

                        {order.status === "PICKED_UP" && (
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "RETURNED")
                            }
                            className="bg-purple-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-purple-700 cursor-pointer"
                          >
                            Mark Returned
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
