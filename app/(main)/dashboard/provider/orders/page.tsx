'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PAID' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';

interface RentalOrder {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  customer: { name: string; email: string };
  orderItems: Array<{ gear: { title: string } }>;
}

function OrdersTableContent() {
  const searchParams = useSearchParams();
  // URL চেক করবে ?status=PAID দেওয়া আছে কি না
  const isPaidView = searchParams.get('status')?.toUpperCase() === 'PAID';

  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get('accessToken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await api.get(`/api/provider/orders?_t=${Date.now()}`, config);
      const allOrders: RentalOrder[] = res.data?.data || [];

      // 🎯 ফিল্টারিং লজিক:
      // Active Rentals থেকে আসলে (?status=PAID) -> শুধু PAID দেখাবে
      // সাধারণ Manage Orders পেজে থাকলে -> PAID ছাড়া বাকি সব দেখাবে
      const filtered = isPaidView
        ? allOrders.filter((order) => (order.status || '').toUpperCase() === 'PAID')
        : allOrders.filter((order) => (order.status || '').toUpperCase() !== 'PAID');

      setOrders(filtered);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [isPaidView]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const token = Cookies.get('accessToken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await api.patch(`/api/provider/orders/${orderId}`, { status: nextStatus }, config);
      toast.success(`Order marked as ${nextStatus}`);

      // ভিউ অনুযায়ী লিস্ট থেকে স্বয়ংক্রিয়ভাবে আপডেট বা রিমুভ করা
      if (isPaidView) {
        // Active Rentals ভিউতে কোনো অর্ডার Picked Up হয়ে গেলে লিস্ট থেকে সরে যাবে
        setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
      } else {
        // রেগুলার ভিউতে কোনো অর্ডার PAID হয়ে গেলে রেগুলার লিস্ট থেকে সরে যাবে
        if (nextStatus === 'PAID') {
          setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
        } else {
          setOrders((prev) =>
            prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
          );
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const renderBadge = (status: OrderStatus) => {
    const badges: Record<OrderStatus, string> = {
      PLACED: 'bg-amber-100 text-amber-800 border-amber-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      PAID: 'bg-purple-100 text-purple-800 border-purple-200',
      PICKED_UP: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      RETURNED: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
          badges[status] || 'bg-zinc-100 text-zinc-700'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {isPaidView ? 'Active Rentals (Paid Orders)' : 'Manage Orders'}
          </h1>
          <p className="text-sm text-zinc-500">
            {isPaidView
              ? 'Paid orders waiting for customer pickup.'
              : 'Track and manage regular rental orders.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPaidView ? (
            <Link
              href="/dashboard/provider/orders"
              className="inline-flex items-center gap-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              View Pending Orders
            </Link>
          ) : (
            <Link
              href="/dashboard/provider/orders?status=PAID"
              className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              View Active Rentals (PAID)
            </Link>
          )}

          <button
            onClick={fetchOrders}
            className="p-2 border border-zinc-200 rounded-xl hover:bg-zinc-50 text-zinc-600 transition cursor-pointer shadow-sm"
            title="Reload table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 flex justify-center items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="w-4 h-4 animate-spin text-[#285724]" /> Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs">
            {isPaidView
              ? 'No active paid orders waiting for pickup.'
              : 'No pending or processing orders found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Gear Item</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {orders.map((order) => {
                  const isPendingThis = updatingId === order.id;
                  return (
                    <tr key={order.id} className="hover:bg-zinc-50/50">
                      <td className="p-4 font-mono text-[11px] text-zinc-500">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-zinc-900">
                          {order.customer?.name || 'Customer'}
                        </p>
                        <p className="text-[11px] text-zinc-400">{order.customer?.email}</p>
                      </td>
                      <td className="p-4 text-zinc-800">
                        {order.orderItems?.[0]?.gear?.title || 'Gear Listing'}
                      </td>
                      <td className="p-4 font-semibold text-zinc-900">৳{order.totalPrice}</td>
                      <td className="p-4">{renderBadge(order.status)}</td>
                      <td className="p-4 text-right">
                        {order.status === 'PLACED' && (
                          <button
                            disabled={isPendingThis}
                            onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <span className="text-[11px] text-zinc-400 italic">
                            Awaiting Payment
                          </span>
                        )}
                        {order.status === 'PAID' && (
                          <button
                            disabled={isPendingThis}
                            onClick={() => handleUpdateStatus(order.id, 'PICKED_UP')}
                            className="px-3 py-1.5 bg-[#285724] hover:bg-[#1f441c] text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 transition"
                          >
                            Mark Picked Up
                          </button>
                        )}
                        {order.status === 'PICKED_UP' && (
                          <button
                            disabled={isPendingThis}
                            onClick={() => handleUpdateStatus(order.id, 'RETURNED')}
                            className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-900 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                          >
                            Mark Returned
                          </button>
                        )}
                        {['RETURNED', 'CANCELLED'].includes(order.status) && (
                          <span className="text-[11px] text-zinc-400">Completed</span>
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

// Next.js useSearchParams এর জন্য Suspense Wrapper
export default function ProviderOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex justify-center items-center gap-2 text-xs text-zinc-500">
          <Loader2 className="w-5 h-5 animate-spin text-[#285724]" /> Loading orders...
        </div>
      }
    >
      <OrdersTableContent />
    </Suspense>
  );
}