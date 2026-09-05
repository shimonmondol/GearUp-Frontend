// app/dashboard/provider/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

type OrderStatus = 'Pending' | 'Confirmed' | 'Picked Up' | 'Returned';

interface Order {
  id: string;
  gearName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: OrderStatus;
}

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/provider/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/provider/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
        );
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 mt-16">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order Lifecycle Management</h2>
        <p className="text-xs text-slate-500">Confirm bookings and track active handoffs and returns.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center items-center text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">No incoming orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Gear & Customer</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-500">{order.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 text-sm">{order.gearName}</p>
                      <p className="text-[11px] text-slate-400">{order.customerName}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {order.startDate} <span className="text-slate-300">to</span> {order.endDate}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">${order.totalPrice}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          order.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : order.status === 'Confirmed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : order.status === 'Picked Up'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {updatingId === order.id ? (
                        <span className="text-[11px] text-slate-400">Updating...</span>
                      ) : (
                        <div className="inline-flex gap-1.5">
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Confirmed')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
                            >
                              Confirm
                            </button>
                          )}
                          {order.status === 'Confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Picked Up')}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition"
                            >
                              Mark Picked Up
                            </button>
                          )}
                          {order.status === 'Picked Up' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Returned')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded transition"
                            >
                              Mark Returned
                            </button>
                          )}
                          {order.status === 'Returned' && (
                            <span className="text-slate-400 italic">Completed</span>
                          )}
                        </div>
                      )}
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