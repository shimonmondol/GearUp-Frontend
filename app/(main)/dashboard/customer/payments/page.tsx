"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";

interface IPayment {
  id: string;
  transactionId?: string;
  amount: number;
  status: "PAID" | "PENDING" | "FAILED";
  createdAt: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/payments/my-payments");
        const data = res.data?.data || res.data;
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load payment history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Payment History</h1>
      <p className="text-xs text-gray-500 mb-6">
        List of all gear rental transactions
      </p>

      {loading ? (
        <p className="text-center py-12 text-gray-500">
          Loading payment history...
        </p>
      ) : payments.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          No payment transaction records found.
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs text-gray-700">
                    {p.transactionId || `#${p.id.slice(0, 12)}`}
                  </td>
                  <td className="p-4 text-xs text-gray-600">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-blue-600">৳{p.amount}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        p.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : p.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}