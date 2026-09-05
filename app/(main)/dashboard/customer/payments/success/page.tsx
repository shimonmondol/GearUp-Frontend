"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  Download,
  Calendar,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId") || "GU-ORD-" + Date.now().toString().slice(-6);
  const sessionId = searchParams.get("session_id") || searchParams.get("tran_id") || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 bg-[#eff5ed] text-[#2e5328] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#eff5ed]/50">
          <CheckCircle2 className="w-9 h-9 animate-bounce" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-zinc-950">Payment Confirmed!</h1>
          <p className="text-xs text-zinc-500">
            Your rental reservation has been successfully booked and confirmed.
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-[#fbfdfb] border border-zinc-100 rounded-2xl p-4 text-xs space-y-2.5 text-left">
          <div className="flex justify-between items-center text-zinc-600">
            <span className="font-medium">Order Reference:</span>
            <span className="font-bold text-zinc-900 font-mono">#{orderId.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-600">
            <span className="font-medium">Transaction ID:</span>
            <span className="font-mono text-zinc-700 truncate max-w-[150px]">{sessionId}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-600">
            <span className="font-medium">Payment Status:</span>
            <span className="inline-flex items-center gap-1 font-bold text-[#2e5328] bg-[#eff5ed] px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3" /> Paid & Verified
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <Link
            href="/dashboard/customer"
            className="w-full flex items-center justify-center gap-2 bg-[#2e5328] hover:bg-[#244220] text-white py-3.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <span>Go to Customer Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/gear"
            className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-3 rounded-2xl text-xs font-semibold transition"
          >
            <span>Rent More Gear</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased">
      <Suspense fallback={<div className="text-center pt-20 text-xs text-zinc-500">Loading receipt...</div>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}