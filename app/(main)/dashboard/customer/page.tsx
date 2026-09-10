'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Trash2, Loader2, AlertTriangle, CheckSquare, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80';

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [batchDeleting, setBatchDeleting] = useState(false);

  // Selection State for Bulk Delete
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Delete Confirmation Popup States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);

  // Review Modal States
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedGearId, setSelectedGearId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchCustomerOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get('accessToken');

      if (!token) {
        toast.warning('Please login to view your orders');
        setLoading(false);
        return;
      }

      // ক্যাশ প্রতিরোধ করতে টাইমস্ট্যাম্প ও নো-ক্যাশ হেডার
      const res = await api.get(`/api/orders/my-orders?t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
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

      const orderList = Array.isArray(raw) ? raw : [];
      setOrders(orderList);
      setSelectedOrderIds([]);
    } catch (err: any) {
      console.error('Customer dashboard error:', err);
      toast.error(err.response?.data?.message || 'Failed to load rental orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerOrders();
  }, [fetchCustomerOrders]);

  // Select All চেকবক্স হ্যান্ডলার
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = orders.map((o) => o.id || o._id);
      setSelectedOrderIds(allIds);
    } else {
      setSelectedOrderIds([]);
    }
  };

  // সিঙ্গেল রো সিলেকশন
  const handleSelectOne = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // সিঙ্গেল ডিলিট পপআপ
  const triggerSingleDelete = (orderId: string) => {
    setIsBulkDeleteModal(false);
    setOrderToDelete(orderId);
    setDeleteModalOpen(true);
  };

  // বাল্ক ডিলিট পপআপ
  const triggerBulkDelete = () => {
    if (selectedOrderIds.length === 0) return;
    setIsBulkDeleteModal(true);
    setDeleteModalOpen(true);
  };

  // ডিলিট কনফার্মেশন এক্সিকিউটর
  const handleConfirmDelete = async () => {
    const token = Cookies.get('accessToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (isBulkDeleteModal) {
      setBatchDeleting(true);
      try {
        const deletePromises = selectedOrderIds.map(async (id) => {
          try {
            return await api.delete(`/api/orders/${id}`, config);
          } catch (err: any) {
            if (err.response?.status === 404 || err.response?.status === 405) {
              return await api.delete(`/api/rentals/${id}`, config);
            }
            throw err;
          }
        });

        await Promise.allSettled(deletePromises);
        setOrders((prev) => prev.filter((o) => !selectedOrderIds.includes(o.id || o._id)));
        toast.success(`Successfully deleted ${selectedOrderIds.length} orders!`);
        setSelectedOrderIds([]);
        setDeleteModalOpen(false);
      } catch (err: any) {
        toast.error('Failed to delete some orders');
      } finally {
        setBatchDeleting(false);
      }
    } else if (orderToDelete) {
      setDeletingId(orderToDelete);
      try {
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
        setSelectedOrderIds((prev) => prev.filter((id) => id !== orderToDelete));
        toast.success('Rental order deleted successfully!');
        setDeleteModalOpen(false);
        setOrderToDelete(null);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete order');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleOpenReview = (gearId: string) => {
    setSelectedGearId(gearId);
    setRating(5);
    setComment('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGearId) return;

    setSubmittingReview(true);
    try {
      const token = Cookies.get('accessToken');
      await api.post(
        '/api/reviews',
        {
          gearId: selectedGearId,
          rating: Number(rating),
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    switch (status) {
      case 'PLACED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">PLACED</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">CONFIRMED</span>;
      case 'PAID':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">PAID</span>;
      case 'PICKED_UP':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">PICKED UP</span>;
      case 'RETURNED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">RETURNED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800">{status}</span>;
    }
  };

  const isAllSelected = orders.length > 0 && selectedOrderIds.length === orders.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 mt-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">My Rental Orders</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Track gear bookings, complete payments, and leave feedback
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCustomerOrders}
            className="border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            🔄 Refresh
          </button>
          <Link
            href="/gear"
            className="bg-[#2e5328] hover:bg-[#244220] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
          >
            Browse Equipment →
          </Link>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4 flex items-center justify-between transition-all animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900">
            <CheckSquare className="w-4 h-4 text-red-600" />
            <span>{selectedOrderIds.length} order(s) selected</span>
          </div>
          <button
            onClick={triggerBulkDelete}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedOrderIds.length})</span>
          </button>
        </div>
      )}

      {/* Orders List Table */}
      {loading ? (
        <div className="text-center py-24 text-zinc-400 text-xs font-semibold uppercase tracking-wider flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#2e5328]" />
          <span>Loading your rental orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center text-zinc-500 shadow-xs">
          <div className="w-14 h-14 bg-[#eff5ed] text-[#2e5328] rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
            🎒
          </div>
          <h3 className="text-base font-bold text-zinc-900 mb-1">No Rentals Yet</h3>
          <p className="text-xs text-zinc-400 mb-5">You have not booked any rental gear yet.</p>
          <Link
            href="/gear"
            className="bg-[#2e5328] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#244220] transition shadow-xs inline-block"
          >
            Explore Gear Catalog
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="bg-zinc-50/80 text-[11px] uppercase tracking-wider font-bold text-zinc-400 border-b border-zinc-100">
                <tr>
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      title="Select all orders"
                      className="w-4 h-4 rounded border-zinc-300 text-[#2e5328] focus:ring-[#2e5328] accent-[#2e5328] cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Gear Item</th>
                  <th className="p-4">Rental Duration</th>
                  <th className="p-4">Total Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => {
                  const gearItemRef =
                    order.orderItems?.[0]?.gear ||
                    order.gearItems?.[0]?.gear ||
                    order.gear ||
                    order.gearItem ||
                    {};

                  const gearTitle = gearItemRef.title || gearItemRef.name || order.gearTitle || 'Equipment Item';
                  const gearId =
                    gearItemRef.id ||
                    gearItemRef._id ||
                    order.orderItems?.[0]?.gearId ||
                    order.gearId ||
                    '';
                  const gearImage =
                    (Array.isArray(gearItemRef.images) && gearItemRef.images[0]) ||
                    gearItemRef.image ||
                    DEFAULT_IMAGE;

                  const orderId = order.id || order._id;
                  const total = order.totalPrice || order.totalCost || order.amount || order.total || 0;
                  const isChecked = selectedOrderIds.includes(orderId);
                  const orderStatus = (order.status || 'PLACED').toUpperCase();

                  return (
                    <tr
                      key={orderId}
                      className={`transition ${
                        isChecked ? 'bg-emerald-50/40' : 'hover:bg-zinc-50/60'
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(orderId)}
                          className="w-4 h-4 rounded border-zinc-300 text-[#2e5328] focus:ring-[#2e5328] accent-[#2e5328] cursor-pointer"
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200/60">
                            <Image
                              src={gearImage}
                              alt={gearTitle}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 text-xs sm:text-sm line-clamp-1">{gearTitle}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">
                              #{orderId?.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-zinc-500">
                        {order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'} ➔{' '}
                        {order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 font-black text-sm text-[#2e5328]">
                        ৳ {Number(total).toLocaleString()}
                      </td>

                      {/* স্ট্যাটাস কলাম */}
                      <td className="p-4">{renderBadge(orderStatus)}</td>

                      {/* অ্যাকশনস কলাম */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* PLACED, PENDING বা CONFIRMED হলে Pay Now বাটন */}
                          {['PLACED', 'PENDING', 'CONFIRMED'].includes(orderStatus) && (
                            <Link
                              href={`/dashboard/customer/orders/${orderId}/pay`}
                              className="bg-[#2e5328] hover:bg-[#244220] text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-block transition shadow-xs"
                            >
                              Pay Now 💳
                            </Link>
                          )}

                          {/* CANCELLED হলে Retry Pay বাটন */}
                          {orderStatus === 'CANCELLED' && (
                            <Link
                              href={`/dashboard/customer/orders/${orderId}/pay`}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-block transition shadow-xs"
                            >
                              Retry Pay 💳
                            </Link>
                          )}

                          {/* পেইড হলে সাকসেস ব্যাজ */}
                          {orderStatus === 'PAID' && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Paid
                            </span>
                          )}

                          {/* রিটার্নড হলে রিভিউ বাটন */}
                          {orderStatus === 'RETURNED' && gearId && (
                            <button
                              onClick={() => handleOpenReview(gearId)}
                              className="bg-[#eff5ed] text-[#2e5328] border border-[#d8ecd3] hover:bg-[#e4efe2] text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition"
                            >
                              Leave Review ⭐
                            </button>
                          )}

                          {/* গিয়ার পিকড আপ থাকলে In Use */}
                          {orderStatus === 'PICKED_UP' && (
                            <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-1 rounded-md border border-green-200">
                              In Use
                            </span>
                          )}

                          {/* ডিলিট বাটন */}
                          <button
                            onClick={() => triggerSingleDelete(orderId)}
                            title="Delete Order"
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-100 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-900">
                {isBulkDeleteModal
                  ? `Delete ${selectedOrderIds.length} Orders?`
                  : 'Delete Rental Order?'}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                {isBulkDeleteModal
                  ? `Are you sure you want to remove all ${selectedOrderIds.length} selected orders?`
                  : 'Are you sure you want to remove this booking? This action cannot be undone.'}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setOrderToDelete(null);
                }}
                disabled={Boolean(deletingId) || batchDeleting}
                className="flex-1 py-2.5 px-4 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer disabled:opacity-50"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={Boolean(deletingId) || batchDeleting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {deletingId || batchDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-100">
            <h3 className="text-base font-extrabold text-zinc-900">Leave a Review</h3>
            <p className="text-xs text-zinc-500 mb-4">Share your rental experience</p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full border border-zinc-200 rounded-xl p-2.5 text-xs bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#2e5328]"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Good)</option>
                  <option value={2}>⭐⭐ (2 - Fair)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Feedback</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the equipment condition and experience?"
                  className="w-full border border-zinc-200 rounded-xl p-3 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#2e5328]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-[#2e5328] hover:bg-[#244220] text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {submittingReview ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}