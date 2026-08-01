'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import { getGearImage } from '@/lib/getImage';
interface ICategory {
  id?: string;
  name?: string;
  slug?: string;
}

interface IGear {
  id: string;
  title: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stockQuantity: number;
  isAvailable: boolean;
  images?: string[];
  category?: ICategory | string;
}

const GearDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const router = useRouter();

  const [gear, setGear] = useState<IGear | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGearDetails = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const res = await api.get(`/api/gear/${resolvedParams.id}`);
        const data = res.data?.data || res.data;

        if (data && (data.id || data._id)) {
          setGear({ ...data, id: data.id || data._id });
        } else {
          setNotFound(true);
        }
      } catch (err: any) {
        console.error('Failed to fetch gear detail:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchGearDetails();
    }
  }, [resolvedParams.id]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !gear) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days * gear.pricePerDay : 0;
  };

  const handleRentNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = Cookies.get('accessToken');
    if (!token) {
      alert('Please login to rent gear');
      router.push('/login');
      return;
    }

    if (calculateTotal() <= 0) {
      setError('End date must be after Start date');
      return;
    }

    setBookingLoading(true);

    try {
      await api.post('/api/rentals', {
        gearId: gear?.id,
        startDate,
        endDate,
        totalPrice: calculateTotal(),
      });

      alert('Order placed successfully!');
      router.push('/dashboard/customer');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place rental order.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading gear details...</p>;
  }

  if (notFound || !gear) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500 mb-2">404 - Gear Not Found</h2>
        <p className="text-gray-600 mb-4">The gear item you are looking for does not exist.</p>
        <button
          onClick={() => router.push('/gear')}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          Back to Gear List
        </button>
      </div>
    );
  }

  const categoryName = typeof gear.category === 'object' ? gear.category?.name : gear.category;

  return (
    <div className="max-w-4xl mx-auto p-4 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg border shadow-sm">
        {/* Left Side: Gear Image */}
        <div>
          <img
            src={getGearImage(gear)}
            alt={gear.title}
            className="w-full h-72 object-cover rounded"
          />
        </div>

        {/* Right Side: Details & Rental Form */}
        <div>
          <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded">
            {categoryName || 'General'}
          </span>

          <h1 className="text-2xl font-bold mt-2">{gear.title}</h1>
          {gear.brand && <p className="text-xs text-gray-500">Brand: {gear.brand}</p>}
          <p className="text-gray-600 text-sm mt-3">{gear.description}</p>

          <p className="text-2xl font-bold text-blue-600 mt-4">
            ৳{gear.pricePerDay} <span className="text-sm text-gray-500 font-normal">/ day</span>
          </p>

          <form onSubmit={handleRentNow} className="mt-6 border-t pt-4 space-y-4">
            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div>
              <label className="block text-xs font-semibold mb-1">Start Date</label>
              <input
                type="date"
                required
                className="w-full border p-2 rounded text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">End Date</label>
              <input
                type="date"
                required
                className="w-full border p-2 rounded text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {calculateTotal() > 0 && (
              <div className="bg-gray-50 p-3 rounded text-sm font-semibold flex justify-between">
                <span>Total Amount:</span>
                <span className="text-blue-600">৳{calculateTotal()}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!gear.isAvailable || bookingLoading}
              className="w-full bg-blue-600 text-white py-2.5 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {bookingLoading ? 'Processing...' : gear.isAvailable ? 'Rent Now' : 'Currently Unavailable'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GearDetailsPage;