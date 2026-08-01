'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER', // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend URL context matching: POST /api/auth/register
      const res = await api.post('/auth/register', formData);
      if (res.status === 200 || res.status === 201) {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-2xl font-bold text-center text-gray-800">Create GearUp Account</h2>
        <p className="mb-6 text-sm text-center text-gray-500">Join as a Customer or Gear Provider</p>

        {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I want to join as:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`py-2 text-sm font-medium rounded-md border ${
                  formData.role === 'CUSTOMER' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700'
                }`}
                onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
              >
                🏋️ Customer
              </button>
              <button
                type="button"
                className={`py-2 text-sm font-medium rounded-md border ${
                  formData.role === 'PROVIDER' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700'
                }`}
                onClick={() => setFormData({ ...formData, role: 'PROVIDER' })}
              >
                🏪 Gear Provider
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}