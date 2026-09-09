'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, LayoutDashboard, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const tranId = searchParams.get('tranId');
  const status = searchParams.get('status') || 'PAID';

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl space-y-6">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 animate-in zoom-in-95 duration-200">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      {/* Title & Description */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
          আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। অর্ডারের কনফার্মেশন প্রসেস শুরু করা হয়েছে।
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-zinc-50 rounded-2xl p-4 text-left text-xs space-y-2.5 border border-zinc-100 font-mono">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Order ID:</span>
          <span className="font-bold text-zinc-800">
            #{orderId ? orderId.slice(0, 8).toUpperCase() : 'N/A'}
          </span>
        </div>

        {tranId && (
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Tran ID:</span>
            <span className="font-bold text-zinc-700 truncate max-w-[190px]">
              {tranId}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Status:</span>
          <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md uppercase text-[11px]">
            {status}
          </span>
        </div>

        <div className="pt-2 border-t border-zinc-200/60 text-[11px] text-zinc-500 font-sans flex items-start gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>পেমেন্টের রসিদ এবং বিস্তারিত তথ্য আপনার ড্যাশবোর্ডে যোগ করা হয়েছে।</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2.5 pt-1">
        <Link
          href="/dashboard/customer"
          className="flex items-center justify-center gap-2 w-full bg-[#2e5328] hover:bg-[#244220] text-white text-xs font-bold py-3 rounded-xl transition shadow-xs cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Orders Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/gear"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 py-2 transition"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Explore More Equipment</span>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-zinc-400">Loading payment details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}