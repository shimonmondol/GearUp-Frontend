'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/lib/axios';

export default function NewGearPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    category: 'Camping',
    imageUrl: '',
    isAvailable: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/provider/gear', {
        title: form.title,
        description: form.description,
        pricePerDay: Number(form.pricePerDay),
        category: form.category,
        images: form.imageUrl ? [form.imageUrl] : [],
        isAvailable: form.isAvailable,
      });

      toast.success('Listing created successfully');
      router.push('/dashboard/provider');
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to list new gear');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Provider Dashboard
      </button>

      <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-xl font-bold text-zinc-900 mb-1">Add New Gear Listing</h1>
        <p className="text-xs text-zinc-500 mb-6">Enter specifications, pricing, and availability controls.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800">Gear Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Coleman 4-Person Waterproof Tent"
              className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
              >
                <option value="Camping">Camping</option>
                <option value="Hiking">Hiking</option>
                <option value="Photography">Photography</option>
                <option value="Cycling">Cycling</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800">Daily Rent Price (BDT)</label>
              <input
                type="number"
                required
                min="1"
                value={form.pricePerDay}
                onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                placeholder="500"
                className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800">Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/gear-image.jpg"
              className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800">Description</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe condition, features, and pickup instructions..."
              className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 text-[#285724] focus:ring-[#285724]"
            />
            <label htmlFor="isAvailable" className="text-xs font-medium text-zinc-700">
              Immediately available for customer bookings
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#285724] hover:bg-[#1f441c] text-white py-3 rounded-xl text-xs font-semibold disabled:bg-zinc-300"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Gear'}
          </button>
        </form>
      </div>
    </div>
  );
}