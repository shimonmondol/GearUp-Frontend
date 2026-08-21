'use client';

import React from 'react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
          ✕
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Payment Cancelled</h1>
        <p className="text-xs text-gray-500 mt-2 mb-6">
          The transaction was not completed. You can re-try booking whenever you are ready.
        </p>

        <div className="space-y-3">
          <Link
            href="/gear"
            className="block w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Return to Gear Store
          </Link>
          <Link
            href="/dashboard/customer"
            className="block w-full border text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            Go to Customer Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}