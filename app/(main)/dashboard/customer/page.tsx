'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import {
  ShoppingBag,
  Clock,
  DollarSign,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Trash2,
  Star,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import api from '@/lib/axios';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80';

// Skeleton Loader Component for Table Rows
function CustomerTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-zinc-100 dark:border-gray-700/60">
          <td className="py-3.5 px-4">
            <div className="h-3.5 w-16 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>
          <td className="py-3.5 px-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-gray-700 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-[140px]">
                <div className="h-3.5 bg-zinc-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-2.5 bg-zinc-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </td>
          <td className="py-3.5 px-4">
            <div className="h-3.5 w-28 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>
          <td className="py-3.5 px-4">
            <div className="h-4 w-16 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>
          <td className="py-3.5 px-4">
            <div className="h-5 w-18 bg-zinc-200 dark:bg-gray-700 rounded-full" />
          </td>
          <td className="py-3.5 px-4 text-right">
            <div className="h-7 w-20 bg-zinc-200 dark:bg-gray-700 rounded-lg inline-block" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Status Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Review Modal States
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedGearId, setSelectedGearId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ব্যাকএন্ড থেকে আসল অর্ডার ডেটা লোড করা
  const fetchCustomerOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get('accessToken');

      if (!token) {
        toast.warning('Please login to view your orders');
        setLoading(false);
        return;
      }

      const res = await api.get(`/api/orders/my-orders?t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

      const raw =
        res.data?.data?.orders ||
        res.data?.data?.rentals ||
        res.data?.data ||
        res.data?.orders ||
        res.data?.rentals ||
        res.data?.result ||
        res.data;

      setOrders(Array.isArray(raw) ? raw : []);
    } catch (err: any) {
      console.error('Customer dashboard error:', err);
      toast.error(err.response?.data?.message || 'Failed to load live orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerOrders();
  }, [fetchCustomerOrders]);

  // গিয়ার টাইটেল ও ছবি এক্সট্রাক্ট করার হেল্পার
  const extractGearInfo = useCallback((order: any) => {
    const gearRef =
      order.orderItems?.[0]?.gear ||
      order.gearItems?.[0]?.gear ||
      order.gear ||
      order.gearItem ||
      {};

    const title =
      gearRef.title ||
      gearRef.name ||
      order.gearTitle ||
      order.title ||
      'Equipment Item';

    const gearId =
      gearRef.id ||
      gearRef._id ||
      order.orderItems?.[0]?.gearId ||
      order.gearId ||
      '';

    const image =
      (Array.isArray(gearRef.images) && gearRef.images[0]) ||
      gearRef.image ||
      DEFAULT_IMAGE;

    const category = gearRef.category || order.category || 'Rental Gear';

    return { title, gearId, image, category };
  }, []);

  // ১. Overview Cards Metrics (Real Data Calculation)
  const overviewStats = useMemo(() => {
    let totalSpent = 0;
    let activeRentals = 0;

    orders.forEach((o) => {
      const s = (o.status || 'PLACED').toUpperCase();
      if (s !== 'CANCELLED') {
        totalSpent += Number(o.totalPrice || o.totalCost || o.amount || o.total || 0);
      }
      if (['ACTIVE', 'PICKED_UP', 'CONFIRMED'].includes(s)) {
        activeRentals += 1;
      }
    });

    return {
      totalBookings: orders.length,
      activeRentals,
      totalSpent,
    };
  }, [orders]);

  // ২. Dynamic Charts Data Generation (মাসিক খরচ ও কাউন্ট)
  const chartData = useMemo(() => {
    const map: Record<string, { month: string; spent: number; orders: number; sortKey: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    orders.forEach((ord) => {
      const s = (ord.status || 'PLACED').toUpperCase();
      if (s === 'CANCELLED') return;

      const d = new Date(ord.createdAt || ord.startDate || Date.now());
      if (isNaN(d.getTime())) return;

      const m = months[d.getMonth()];
      const year = d.getFullYear();
      const key = `${m} '${String(year).slice(-2)}`;
      const sortKey = year * 100 + d.getMonth();

      if (!map[key]) {
        map[key] = { month: key, spent: 0, orders: 0, sortKey };
      }

      map[key].spent += Number(ord.totalPrice || ord.totalCost || ord.amount || ord.total || 0);
      map[key].orders += 1;
    });

    return Object.values(map).sort((a, b) => a.sortKey - b.sortKey);
  }, [orders]);

  // ৩. Table Filtering (Search + Status Filter)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderId = (order.id || order._id || '').toLowerCase();
      const { title, category } = extractGearInfo(order);
      const q = searchTerm.toLowerCase().trim();

      const matchSearch =
        !q || orderId.includes(q) || title.toLowerCase().includes(q) || category.toLowerCase().includes(q);

      const status = (order.status || 'PLACED').toUpperCase();
      const matchStatus = statusFilter === 'ALL' || status === statusFilter.toUpperCase();

      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter, extractGearInfo]);

  // ৪. Table Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // ডিলিট হ্যান্ডলার
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    setDeleting(true);
    try {
      const token = Cookies.get('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        await api.delete(`/api/orders/${orderToDelete}`, config);
      } catch (err: any) {
        if (err.response?.status === 404 || err.response?.status === 405) {
          await api.delete(`/api/rentals/${orderToDelete}`, config);
        } else {
          throw err;
        }
      }

      setOrders((prev) => prev.filter((o) => (o.id || o._id) !== orderToDelete));
      toast.success('Order deleted successfully!');
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  // রিভিউ সাবমিট
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGearId) return;

    setSubmittingReview(true);
    try {
      const token = Cookies.get('accessToken');
      await api.post(
        '/api/reviews',
        { gearId: selectedGearId, rating: Number(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Review submitted successfully!');
      setReviewModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'PLACED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">PLACED</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">CONFIRMED</span>;
      case 'PAID':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">PAID</span>;
      case 'PICKED_UP':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-200 dark:border-teal-800">PICKED UP</span>;
      case 'RETURNED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 dark:bg-gray-700 dark:text-zinc-300 border border-zinc-200 dark:border-gray-600">RETURNED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 dark:bg-gray-700 dark:text-gray-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-gray-700 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
            Real-time rental metrics, expense charts, and booking logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchCustomerOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-zinc-200 dark:border-gray-700 text-xs font-bold text-zinc-700 dark:text-gray-200 hover:bg-zinc-50 dark:hover:bg-gray-700/60 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live DB</span>
          </button>

          <Link
            href="/gear"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white text-xs font-bold transition shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Rent Gear</span>
          </Link>
        </div>
      </div>

      {/* 2. Overview Cards (3 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Bookings */}
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Total Bookings</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-gray-100">
              {loading ? <span className="inline-block h-6 w-12 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : overviewStats.totalBookings}
            </h3>
            <span className="text-[10px] text-zinc-400">All-time reservations</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Active Rentals */}
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Active Rentals</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-gray-100">
              {loading ? <span className="inline-block h-6 w-12 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : overviewStats.activeRentals}
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Currently in use</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-500 dark:text-gray-400">Total Spent</p>
            <h3 className="text-2xl font-black text-[#2e5328] dark:text-[#5fa352]">
              {loading ? <span className="inline-block h-6 w-20 bg-zinc-200 dark:bg-gray-700 rounded animate-pulse" /> : `৳ ${overviewStats.totalSpent.toLocaleString()}`}
            </h3>
            <span className="text-[10px] text-zinc-400">Settled invoices</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#2e5328]/10 text-[#2e5328] dark:text-[#5fa352] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Recharts Dynamic Visualizations (Area & Bar Charts) */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Expenditure Area Chart */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-zinc-200/80 dark:border-gray-700 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-gray-100">
                  Rental Expense Velocity
                </h4>
                <p className="text-xs text-zinc-400">Total gear costs per month (৳ BDT)</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2e5328]/10 text-[#2e5328] dark:text-[#5fa352]">
                Dynamic Real Data
              </span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2e5328" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2e5328" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" fontSize={11} stroke="#888" tickLine={false} />
                  <YAxis fontSize={11} stroke="#888" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`৳ ${Number(val).toLocaleString()}`, 'Total Spent']}
                  />
                  <Area type="monotone" dataKey="spent" stroke="#2e5328" strokeWidth={2.5} fill="url(#colorSpent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bookings Count Bar Chart */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-zinc-200/80 dark:border-gray-700 shadow-xs">
            <div className="mb-4">
              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-gray-100">
                Monthly Gear Bookings
              </h4>
              <p className="text-xs text-zinc-400">Number of reservations made</p>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" fontSize={11} stroke="#888" tickLine={false} />
                  <YAxis fontSize={11} stroke="#888" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 4. Filterable & Paginatable Data Table */}
      <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Controls (Search + Status Filter) */}
        <div className="p-4 sm:p-5 border-b border-zinc-200/80 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-gray-100">
              Rental Orders Ledger ({filteredOrders.length} records)
            </h4>
            <p className="text-xs text-zinc-400">Live booking records, duration intervals, and checkout bills</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ID, gear title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-8 pr-7 py-1.5 text-xs text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Dropdown Filter */}
            <div className="flex items-center gap-1.5 border border-zinc-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 bg-zinc-50 dark:bg-gray-900/60">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-zinc-700 dark:text-gray-200 focus:outline-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-zinc-900 [&>option]:dark:text-gray-100"
              >
                <option value="ALL">All Status</option>
                <option value="PLACED">Placed</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PAID">Paid</option>
                <option value="PICKED_UP">Picked Up</option>
                <option value="RETURNED">Returned</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/70 dark:bg-gray-700/50 border-b border-zinc-200/80 dark:border-gray-700 text-zinc-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Booking ID</th>
                <th className="py-3 px-4 font-bold">Equipment Details</th>
                <th className="py-3 px-4 font-bold">Rental Duration</th>
                <th className="py-3 px-4 font-bold">Total Bill</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-gray-700 text-zinc-800 dark:text-gray-200">
              {loading ? (
                <CustomerTableSkeleton count={itemsPerPage} />
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-zinc-400">
                    {searchTerm || statusFilter !== 'ALL'
                      ? 'No matching rental orders found.'
                      : 'You have not booked any rental gear yet.'}
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const orderId = order.id || order._id;
                  const { title: gearTitle, gearId, image: gearImage, category } = extractGearInfo(order);
                  const total = order.totalPrice || order.totalCost || order.amount || order.total || 0;
                  const orderStatus = (order.status || 'PLACED').toUpperCase();

                  return (
                    <tr key={orderId} className="hover:bg-zinc-50/60 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2e5328] dark:text-[#5fa352]">
                        #{orderId?.slice(0, 8).toUpperCase()}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-zinc-100 dark:bg-gray-700 shrink-0 border border-zinc-200/60 dark:border-gray-600">
                            <Image
                              src={gearImage}
                              alt={gearTitle}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-gray-100 line-clamp-1">
                              {gearTitle}
                            </p>
                            <span className="text-[10px] text-zinc-400">{category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-500 dark:text-gray-400 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span>
                            {order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'}{' '}
                            → {order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-zinc-900 dark:text-gray-100">
                        ৳ {Number(total).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">{renderBadge(orderStatus)}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {['PLACED', 'PENDING', 'CONFIRMED'].includes(orderStatus) && (
                            <Link
                              href={`/dashboard/customer/orders/${orderId}/pay`}
                              className="bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 transition shadow-xs"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Pay Now</span>
                            </Link>
                          )}

                          {orderStatus === 'PAID' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-lg">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              Paid
                            </span>
                          )}

                          {orderStatus === 'RETURNED' && gearId && (
                            <button
                              onClick={() => {
                                setSelectedGearId(gearId);
                                setRating(5);
                                setComment('');
                                setReviewModalOpen(true);
                              }}
                              className="bg-zinc-100 dark:bg-gray-700 hover:bg-zinc-200 dark:hover:bg-gray-600 text-zinc-800 dark:text-gray-200 text-[11px] font-bold px-2 py-1 rounded-lg cursor-pointer transition flex items-center gap-1"
                            >
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>Review</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setOrderToDelete(orderId);
                              setDeleteModalOpen(true);
                            }}
                            title="Delete Order"
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-zinc-200/80 dark:border-gray-700 flex items-center justify-between text-xs text-zinc-500 dark:text-gray-400">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-gray-700 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-gray-700/60 cursor-pointer text-zinc-600 dark:text-gray-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-[#2e5328] dark:bg-[#3b663b] text-white'
                      : 'border border-zinc-200 dark:border-gray-700 hover:bg-zinc-100 dark:hover:bg-gray-700/60 text-zinc-600 dark:text-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-gray-700 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-gray-700/60 cursor-pointer text-zinc-600 dark:text-gray-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200/80 dark:border-gray-700 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-gray-100">Delete Rental Order?</h3>
              <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
                Are you sure you want to delete this booking record?
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setOrderToDelete(null);
                }}
                disabled={deleting}
                className="flex-1 py-2 px-3 border border-zinc-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-zinc-700 dark:text-gray-300 hover:bg-zinc-50 dark:hover:bg-gray-700/60 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOrder}
                disabled={deleting}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Confirm Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200/80 dark:border-gray-700 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-gray-100">Leave a Review</h3>
              <p className="text-xs text-zinc-500 dark:text-gray-400 mt-0.5">Share your equipment experience</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-gray-300 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full border border-zinc-200 dark:border-gray-700 rounded-xl p-2.5 text-xs bg-white dark:bg-gray-900 text-zinc-800 dark:text-gray-200 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] [&>option]:bg-white [&>option]:dark:bg-gray-800"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Good)</option>
                  <option value={2}>⭐⭐ (2 - Fair)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-gray-300 mb-1">Feedback</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the gear condition and overall experience?"
                  className="w-full border border-zinc-200 dark:border-gray-700 rounded-xl p-3 text-xs text-zinc-800 dark:text-gray-200 bg-white dark:bg-gray-900 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-zinc-600 dark:text-gray-300 hover:bg-zinc-50 dark:hover:bg-gray-700/60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Submit Review</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}