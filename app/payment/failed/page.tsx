'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  XCircle,
  RefreshCw,
  LayoutDashboard,
  AlertCircle,
  ShoppingBag,
  Loader2,
} from 'lucide-react';

function FailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status') || 'failed';
  const message = searchParams.get('message');

  const isCancelled =
    status.toLowerCase() === 'cancel' || status.toLowerCase() === 'cancelled';

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Status Icon */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border ${
          isCancelled
            ? 'bg-amber-50 text-amber-600 border-amber-100'
            : 'bg-rose-50 text-rose-600 border-rose-100'
        }`}
      >
        <XCircle className="w-10 h-10" />
      </div>

      {/* Title & Description */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
          {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
        </h1>
        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
          {message
            ? decodeURIComponent(message.replace(/_/g, ' '))
            : isCancelled
            ? 'আপনি পেমেন্ট প্রক্রিয়াটি বাতিল করেছেন। অর্ডারটি আপনার ড্যাশবোর্ডে সংরক্ষিত রয়েছে।'
            : 'আপনার পেমেন্ট সম্পন্ন করা যায়নি। গেটওয়ে থেকে ট্রানজ্যাকশনটি ব্যর্থ হয়েছে।'}
        </p>
      </div>

      {/* Order Info Summary */}
      <div className="bg-zinc-50 rounded-2xl p-4 text-left text-xs space-y-2.5 border border-zinc-100 font-mono">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 font-sans">Order Reference:</span>
          <span className="font-bold text-zinc-800">
            {orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : 'N/A'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-400 font-sans">Gateway Status:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded-md uppercase text-[11px] font-sans ${
              isCancelled
                ? 'text-amber-700 bg-amber-100/70'
                : 'text-rose-600 bg-rose-100/70'
            }`}
          >
            {isCancelled ? 'CANCELLED' : 'FAILED'}
          </span>
        </div>

        <div className="pt-2 border-t border-zinc-200/60 text-[11px] text-zinc-500 font-sans flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            যদি অ্যাকাউন্ট থেকে টাকা কেটে নেওয়া হয়ে থাকে, তবে তা আগামী ২৪-৭২ ঘণ্টার মধ্যে স্বয়ংক্রিয়ভাবে রিফান্ড হবে।
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {orderId && (
          <Link
            href={`/dashboard/customer/orders/${orderId}/pay`}
            className="flex items-center justify-center gap-2 w-full bg-[#2e5328] hover:bg-[#244220] text-white text-xs font-bold py-3 rounded-xl transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Payment Again</span>
          </Link>
        )}

        <Link
          href="/dashboard/customer"
          className="flex items-center justify-center gap-2 w-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-bold py-3 rounded-xl transition cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to My Orders</span>
        </Link>

        <Link
          href="/gear"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-600 py-1 transition"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Browse Gear Catalog</span>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <Loader2 className="w-4 h-4 animate-spin text-[#2e5328]" />
            <span>Loading payment status...</span>
          </div>
        }
      >
        <FailedContent />
      </Suspense>
    </div>
  );
}