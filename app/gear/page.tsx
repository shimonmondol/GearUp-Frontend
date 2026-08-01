'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/axios';

interface IGear {
  _id: string;
  title: string;
  category: string;
  brand: string;
  pricePerDay: number;
  images: string[];
  isAvailable: boolean;
}

const GearListPage = () => {
  const [gears, setGears] = useState<IGear[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  const fetchGears = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gear', {
        params: {
          search: search || undefined,
          category: category || undefined,
          brand: brand || undefined,
          maxPrice: maxPrice || undefined,
        },
      });

      const data = res.data?.data || res.data?.result || res.data;
      setGears(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch gear items:', err);
      setGears([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGears();
  }, [search, category, brand, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Rent Sports & Outdoor Gear</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 bg-white p-5 rounded-lg border h-fit space-y-6 shadow-sm">
          <h2 className="font-bold text-lg border-b pb-2">Filter Gear</h2>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Search Keyword</label>
            <input
              type="text"
              placeholder="e.g. Tent, Bicycle..."
              className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Category</label>
            <select
              className="w-full border p-2 rounded text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Camping">Camping</option>
              <option value="Cycling">Cycling</option>
              <option value="Water Sports">Water Sports</option>
              <option value="Fitness">Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Brand</label>
            <input
              type="text"
              placeholder="e.g. Quechua, Shimano"
              className="w-full border p-2 rounded text-sm"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Max Price / Day</span>
              <span className="text-blue-600">৳{maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              className="w-full accent-blue-600"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <button
            onClick={() => {
              setSearch('');
              setCategory('');
              setBrand('');
              setMaxPrice(5000);
            }}
            className="w-full py-1.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50"
          >
            Reset Filters
          </button>
        </aside>

        {/* Gear Grid */}
        <main className="flex-1">
          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading gear listings...</p>
          ) : gears.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-lg">
              <p className="text-lg font-semibold text-gray-700">No gear items found.</p>
              <p className="text-sm text-gray-500 mt-1">Try resetting or adjusting your search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gears.map((item) => (
                <div key={item._id} className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="relative w-full h-48 bg-gray-100">
                      <Image
                        src={item.images?.[0] || 'https://via.placeholder.com/400x300'}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                          {item.category}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-800 text-base line-clamp-1">{item.title}</h3>
                      {item.brand && <p className="text-xs text-gray-500 mb-2">Brand: {item.brand}</p>}
                      <p className="text-lg font-bold text-blue-600">৳{item.pricePerDay} <span className="text-xs text-gray-500 font-normal">/ day</span></p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      href={`/gear/${item._id}`}
                      className="block text-center bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      View Details & Rent
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GearListPage;