'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { getGearImage } from '@/lib/getImage';

interface IGearItem {
  id?: string;
  title?: string;
  images?: string[];
  pricePerDay?: number;
}

interface IOrderItem {
  id?: string;
  gear?: IGearItem;
}

interface IRentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice?: number;
  totalCost?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  createdAt?: string;
  orderItems?: IOrderItem[];
  gear?: IGearItem; // ফলব্যাক ফিল্ড
}

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<IRentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/rentals');
        const data = res.data?.data || res.data;

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch user rentals:', err);
        setError(err.response?.data?.message || 'Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Approved</span>;
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">Pending Approval</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Rejected / Cancelled</span>;
      case 'COMPLETED':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading your rental orders...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Rental Orders</h1>
          <p className="text-xs text-gray-500 mt-1">Track your gear rental requests and status</p>
        </div>
        <Link
          href="/gear"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          + Rent More Gear
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📦
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No Orders Found</h3>
          <p className="text-gray-500 text-sm mb-6">You haven't placed any sports gear rental orders yet.</p>
          <Link
            href="/gear"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Browse Sports Gear
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            // Prisma orderItems Array থেকে বা সরাসরি gear অবজেক্ট থেকে তথ্য সংগ্রহ
            const gearData = order.orderItems?.[0]?.gear || order.gear;
            const gearTitle = gearData?.title || 'Sports Equipment Item';
            const totalAmount = order.totalPrice || order.totalCost || 0;

            return (
              <div
                key={order.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getGearImage({
                      id: gearData?.id || order.id,
                      images: gearData?.images,
                    })}
                    alt={gearTitle}
                    className="w-20 h-20 object-cover rounded-lg border shrink-0"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{gearTitle}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 Rental Dates:{' '}
                      <span className="font-semibold text-gray-700">
                        {new Date(order.startDate).toLocaleDateString()}
                      </span>{' '}
                      ➔{' '}
                      <span className="font-semibold text-gray-700">
                        {new Date(order.endDate).toLocaleDateString()}
                      </span>
                    </p>
                    {order.createdAt && (
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 gap-2">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400">Total Price</p>
                    <p className="text-xl font-extrabold text-blue-600">৳{totalAmount}</p>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}