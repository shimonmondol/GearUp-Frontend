'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

interface IRentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice?: number;
  totalCost?: number;
  totalAmount?: number;
  status: string;
  createdAt?: string;
  gear?: { title?: string };
  gearItem?: { title?: string };
  orderItems?: any[];
}

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<IRentalOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);

        // 📍 ব্যাকএন্ডের রেন্টালস এন্ডপয়েন্ট কল
        const res = await api.get('/api/rentals');

        console.log('--- CUSTOMER RENTALS RAW RESPONSE ---');
        console.log(res.data);

        // 📍 ব্যাকএন্ড যেকোনো স্ট্রাকচারে ডাটা দিক না কেন তা এক্সট্র্যাক্ট করা
        let rawList: any = [];

        if (Array.isArray(res.data)) {
          rawList = res.data;
        } else if (Array.isArray(res.data?.data)) {
          rawList = res.data.data;
        } else if (Array.isArray(res.data?.data?.result)) {
          rawList = res.data.data.result;
        } else if (Array.isArray(res.data?.rentals)) {
          rawList = res.data.rentals;
        } else if (Array.isArray(res.data?.data?.rentals)) {
          rawList = res.data.data.rentals;
        }

        setOrders(rawList);
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Rental Orders</h1>
          <p className="text-xs text-gray-500 mt-1">Track your gear bookings and status</p>
        </div>
        <Link
          href="/gear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          + Rent More Gear
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">
          <p className="animate-pulse text-sm">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          <p className="text-lg font-semibold text-gray-700 mb-1">No Rental Orders Found</p>
          <p className="text-xs mb-6">You haven't placed any sports gear rental orders yet.</p>
          <Link
            href="/gear"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
          >
            Explore Gear Store
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const total = order.totalPrice || order.totalCost || order.totalAmount || 0;
            const gearTitle =
              order.gear?.title ||
              order.gearItem?.title ||
              order.orderItems?.[0]?.gear?.title ||
              'Sports Equipment Item';

            return (
              <div
                key={order.id}
                className="bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-800">{gearTitle}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 Period:{' '}
                    <span className="font-semibold text-gray-800">
                      {order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold text-gray-800">
                      {order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Price</p>
                    <p className="text-lg font-bold text-blue-600">৳{total}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {order.status || 'PENDING'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}