'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/lib/axios';

export default function OrderPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [gateway, setGateway] = useState<'SSLCOMMERZ' | 'STRIPE'>('SSLCOMMERZ');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/rentals/${orderId}`);
        const data = res.data?.data || res.data;
        setOrder(data);
      } catch (err: any) {
        console.error('Invoice load error:', err?.response?.data || err);
        toast.error('Failed to load order invoice details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleCheckout = async () => {
    setPaying(true);

    // ব্যাকএন্ডের ভিন্ন ভ্যালিডেশনের সাথে মিল রাখার জন্য সম্ভাব্য সব ফিল্ড পাঠানো
    const payload = {
      rentalOrderId: orderId,
      rentalId: orderId,
      orderId: orderId,
      paymentGateway: gateway,
      gateway: gateway.toLowerCase(),
    };

    try {
      const res = await api.post('/api/payments/create', payload);

      console.log('Payment Gateway API Response:', res.data);

      const resData = res.data?.data || res.data;

      // বিভিন্ন পেমেন্ট গেটওয়ের রিটার্ন করা URL ফিল্ড ক্যাচ করা
      const redirectUrl =
        resData?.paymentUrl ||
        resData?.GatewayPageURL || // SSLCommerz sandbox/live URL
        resData?.url ||            // Stripe checkout session URL
        resData?.redirectUrl ||
        resData?.checkoutUrl;

      if (redirectUrl) {
        // বাহ্যিক পেমেন্ট গেটওয়ে পেজে রিডাইরেক্ট
        window.location.href = redirectUrl;
      } else {
        console.error('No redirect URL property found in response:', res.data);
        toast.error('Payment gateway URL was not provided by the server.');
      }
    } catch (err: any) {
      console.error('Payment API Error Details:', err?.response?.data || err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Payment initiation failed. Please try again.';
      toast.error(msg);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading invoice details...
      </div>
    );
  }

  const gearTitle =
    order?.gear?.title ||
    order?.gear?.name ||
    order?.orderItems?.[0]?.gear?.title ||
    'Sports Gear';

  const totalAmount =
    order?.totalPrice ||
    order?.totalCost ||
    order?.amount ||
    0;

  return (
    <div className="max-w-xl mx-auto p-6 mt-12 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="border-b pb-4 mb-6">
        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded uppercase">
          Secure Payment
        </span>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Checkout & Pay</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Complete payment to confirm and lock your gear reservation
        </p>
      </div>

      {/* Invoice Details */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Item:</span>
          <span className="font-semibold text-gray-800">{gearTitle}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Order ID:</span>
          <span className="font-mono text-gray-700">#{orderId?.slice(0, 10)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Rental Period:</span>
          <span className="text-gray-700">
            {order?.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'} -{' '}
            {order?.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t text-gray-900">
          <span>Total Due:</span>
          <span className="text-blue-600">৳{totalAmount}</span>
        </div>
      </div>

      {/* Gateway Selection */}
      <div className="space-y-3 mb-6 items-center">
        <label className="block text-xs font-semibold text-gray-700">
          Choose Payment Gateway
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setGateway('SSLCOMMERZ')}
            className={`p-4 border rounded-xl text-center font-bold text-sm transition cursor-pointer ${
              gateway === 'SSLCOMMERZ'
                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            SSLCommerz
            <span className="block text-[11px] font-normal text-gray-500 mt-0.5">
              Cards / bKash / Nagad
            </span>
          </button>
        </div>
      </div>

      {/* Submit Action */}
      <button
        onClick={handleCheckout}
        disabled={paying}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:bg-gray-400 cursor-pointer text-sm"
      >
        {paying ? 'Redirecting to Gateway...' : `Pay ৳${totalAmount} via ${gateway}`}
      </button>

      <button
        type="button"
        onClick={() => router.back()}
        className="w-full text-center text-xs text-gray-500 hover:text-gray-800 mt-3"
      >
        ← Cancel and Return to Dashboard
      </button>
    </div>
  );
}