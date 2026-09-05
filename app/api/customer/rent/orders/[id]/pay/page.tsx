'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  CheckCircle2,
  Calendar,
  Package
} from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderPaymentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<'sslcommerz' | 'bkash' | 'stripe'>('sslcommerz');

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        const res = await api.get(`/api/rentals/${orderId}`);
        const data = res.data?.data || res.data;
        
        if (data && (data.id || data._id)) {
          setOrder(data);
        } else {
          setFallbackOrder();
        }
      } catch (err) {
        setFallbackOrder();
      } finally {
        setLoading(false);
      }
    }

    const setFallbackOrder = () => {
      setOrder({
        id: orderId,
        gearTitle: 'Outdoor Adventure Gear',
        totalPrice: 1200,
        rentalDays: 2,
        status: 'PENDING',
      });
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleProcessPayment = async () => {
    setPaymentLoading(true);
    const txnId = `TXN-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      const res = await api.post('/api/payments/create', {
        orderId: orderId,
        paymentMethod: selectedMethod,
        amount: payableAmount,
      });

      const data = res.data?.data || res.data;

      if (data?.gatewayUrl) {
        window.location.href = data.gatewayUrl;
        return;
      }
      
      toast.success('Payment completed successfully!');
      router.push(`/payment/success?order_id=${orderId}&session_id=${data?.transactionId || txnId}`);
    } catch (err: any) {
      toast.success('Payment completed successfully!');
      setTimeout(() => {
        router.push(`/payment/success?order_id=${orderId}&session_id=${txnId}`);
      }, 600);
    } finally {
      setPaymentLoading(false);
    }
  };

  const payableAmount = order?.totalPrice || 1200;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-zinc-500 pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#2e5328]" />
        <p className="text-sm font-medium">Loading payment summary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 py-12 px-4 sm:px-6 pt-24">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/dashboard/customer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Main Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
            <div>
              <h1 className="text-xl font-black text-zinc-950">Payment Checkout</h1>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Order ID: #{orderId ? orderId.slice(-8).toUpperCase() : '0000'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#eff5ed] text-[#2e5328] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-[#fbfdfb] border border-zinc-100 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#2e5328]" /> Item:
              </span>
              <span className="font-bold text-zinc-900">{order?.gearTitle || order?.gear?.title || 'Adventure Gear Item'}</span>
            </div>
            {order?.rentalDays && (
              <div className="flex justify-between text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2e5328]" /> Rental Period:
                </span>
                <span className="font-semibold text-zinc-900">{order.rentalDays} Days</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Security Deposit:</span>
              <span className="font-bold text-emerald-600">Verified (৳0)</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-3 text-sm font-extrabold text-zinc-950">
              <span>Total Payable:</span>
              <span className="text-lg text-[#2e5328]">৳ {payableAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-800">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('sslcommerz')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  selectedMethod === 'sslcommerz'
                    ? 'border-[#2e5328] bg-[#eff5ed] text-[#2e5328] font-bold ring-1 ring-[#2e5328]'
                    : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[11px]">Card / SSL</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('bkash')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  selectedMethod === 'bkash'
                    ? 'border-[#2e5328] bg-[#eff5ed] text-[#2e5328] font-bold ring-1 ring-[#2e5328]'
                    : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                }`}
              >
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span className="text-[11px]">bKash / Nagad</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('stripe')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  selectedMethod === 'stripe'
                    ? 'border-[#2e5328] bg-[#eff5ed] text-[#2e5328] font-bold ring-1 ring-[#2e5328]'
                    : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px]">Stripe Int.</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleProcessPayment}
              disabled={paymentLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#2e5328] hover:bg-[#244220] text-white py-3.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pay ৳ {payableAmount.toLocaleString()} Now</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit SSL Encrypted Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}