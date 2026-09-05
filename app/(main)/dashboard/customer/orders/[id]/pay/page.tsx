'use client';

import { use, useState } from 'react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderPayPage({ params }: PageProps) {
  const { id } = use(params);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await res.json();

      if (data.gatewayUrl) {
        window.location.href = data.gatewayUrl;
      } else {
        alert(data.error || 'Failed to initialize payment gateway.');
      }
    } catch (err) {
      console.error(err);
      alert('Network request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">
        💳
      </div>
      <h1 className="text-xl font-bold text-gray-900">Confirm Payment</h1>
      <p className="text-xs font-mono text-gray-500 mt-1">Order #{id}</p>

      <div className="my-6 p-4 bg-gray-50 rounded-xl text-left text-sm space-y-2 border border-gray-100">
        <div className="flex justify-between text-gray-600">
          <span>Rental Deposit & Fee:</span>
          <span>Included</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
          <span>Total Payable:</span>
          <span className="text-blue-600">Calculated at Checkout</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl disabled:opacity-50 transition shadow-sm"
      >
        {loading ? 'Redirecting to Gateway...' : 'Proceed to Checkout'}
      </button>

      <Link
        href="/dashboard/customer"
        className="inline-block mt-3 text-xs text-gray-500 hover:text-gray-800 transition"
      >
        Cancel and return
      </Link>
    </div>
  );
}