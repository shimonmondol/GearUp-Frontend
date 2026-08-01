'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

interface IGear {
  _id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  pricePerDay: number;
  images: string[];
  isAvailable: boolean;
  providerId?: {
    name: string;
    email: string;
  };
}

const GearDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const router = useRouter();

  const [gear, setGear] = useState<IGear | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Booking states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGearDetails = async () => {
      try {
        const res = await api.get(`/gear/${resolvedParams.id}`);
        const data = res.data?.data || res.data;
        setGear(data);
        if (data?.images?.length) {
          setSelectedImage(data.images[0]);
        }
      } catch (err) {
        console.error('Failed to load gear details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGearDetails();
  }, [resolvedParams.id]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !gear) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days * gear.pricePerDay : 0;
  };

  const handleBooking = async (e: React.FormEvent) => {
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
      await api.post('/rentals', {
        gearId: gear?._id,
        startDate,
        endDate,
        totalPrice: calculateTotal(),
      });

      alert('Order placed successfully!');
      router.push('/dashboard/customer');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p className="text-center py-20">Loading gear specifications...</p>;
  if (!gear) return <p className="text-center py-20 text-red-500">Gear details not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-xl border shadow-sm">
        <div className="space-y-4">
          <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden border">
            <Image
              src={selectedImage || gear.images?.[0] || 'https://via.placeholder.com/500x400'}
              alt={gear.title}
              fill
              className="object-cover"
            />
          </div>

          {gear.images && gear.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {gear.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 ${
                    selectedImage === img ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded">
              {gear.category}
            </span>

            <h1 className="text-2xl font-bold mt-2 text-gray-800">{gear.title}</h1>
            {gear.brand && <p className="text-xs text-gray-500 mt-1">Brand: {gear.brand}</p>}

            <p className="text-2xl font-bold text-blue-600 mt-4">
              ৳{gear.pricePerDay} <span className="text-sm font-normal text-gray-500">/ day</span>
            </p>

            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-1">Specifications & Description:</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{gear.description}</p>
            </div>

            {gear.providerId && (
              <div className="mt-4 p-3 bg-gray-50 rounded border text-xs text-gray-600">
                <p className="font-semibold text-gray-700">Listed by Provider:</p>
                <p>{gear.providerId.name}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleBooking} className="mt-6 border-t pt-4 space-y-4">
            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {calculateTotal() > 0 && (
              <div className="bg-blue-50 p-3 rounded text-sm font-semibold flex justify-between text-blue-800">
                <span>Calculated Total:</span>
                <span>৳{calculateTotal()}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!gear.isAvailable || bookingLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {bookingLoading ? 'Processing...' : gear.isAvailable ? 'Confirm & Rent Now' : 'Currently Unavailable'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GearDetailsPage;