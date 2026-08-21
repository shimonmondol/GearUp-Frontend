'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/lib/axios';

export default function AddGearPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [stockQuantity, setStockQuantity] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !pricePerDay) {
      toast.error('Title and Price per day are required!', { position: 'top-center' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        brand,
        pricePerDay: Number(pricePerDay),
        stockQuantity: Number(stockQuantity),
        isAvailable: true,
        images: imageUrl ? [imageUrl] : [],
      };

      await api.post('/api/gear', payload);

      toast.success('Gear listed successfully!', { position: 'top-center', autoClose: 1500 });
      router.push('/dashboard/provider');
    } catch (err: any) {
      console.error('Failed to create gear:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to list gear', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border rounded-xl shadow-sm p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800">Add New Sports Gear</h1>
      <p className="text-xs text-gray-500 mb-6 mt-1">
        List your equipment details to make it available for customer rentals
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Gear Title / Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Professional Badminton Set"
            className="w-full border p-2.5 rounded-lg text-sm focus:outline-purple-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              placeholder="e.g. Yonex, Adidas"
              className="w-full border p-2.5 rounded-lg text-sm focus:outline-purple-600"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Rental Price / Day (৳) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="300"
              className="w-full border p-2.5 rounded-lg text-sm focus:outline-purple-600"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full border p-2.5 rounded-lg text-sm focus:outline-purple-600"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="w-full border p-2.5 rounded-lg text-sm focus:outline-purple-600"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            placeholder="Include condition, specs, and rental terms..."
            className="w-full border p-2.5 rounded-lg text-sm focus:outline-purple-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/provider')}
            className="w-1/2 border py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition cursor-pointer"
          >
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}