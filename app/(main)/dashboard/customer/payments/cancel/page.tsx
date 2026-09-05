"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");
  const reason = searchParams.get("reason") || "The transaction was canceled by the user or gateway.";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
        {/* Warning / Cancel Icon */}
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
          <XCircle className="w-9 h-9" />
        </div>

        {/* Title & Reason */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-zinc-950">Payment Not Completed</h1>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
            {reason} No money was deducted from your account.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 text-xs space-y-2 text-left text-zinc-700">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Order is pending payment</span>
          </div>
          <p className="text-[11px] text-zinc-600 pl-6">
            Your selected gear is temporarily reserved. You can retry paying now or do it later from your dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {orderId ? (
            <Link
              href={`/dashboard/customer/orders/${orderId}/pay`}
              className="w-full flex items-center justify-center gap-2 bg-[#2e5328] hover:bg-[#244220] text-white py-3.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Payment</span>
            </Link>
          ) : (
            <Link
              href="/gear"
              className="w-full flex items-center justify-center gap-2 bg-[#2e5328] hover:bg-[#244220] text-white py-3.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <span>Explore Gear Again</span>
            </Link>
          )}

          <Link
            href="/dashboard/customer"
            className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-3 rounded-2xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased">
      <Suspense fallback={<div className="text-center pt-20 text-xs text-zinc-500">Loading status...</div>}>
        <PaymentCancelContent />
      </Suspense>
    </div>
  );
}