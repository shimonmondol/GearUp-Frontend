'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import api from '@/lib/axios';
import { getGearImage } from '@/lib/getImage';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  Headphones,
  ShieldCheck,
  Package,
  Droplets,
  Sliders,
  CheckCircle2,
  Send,
  Play,
  Loader2,
  Calendar,
} from 'lucide-react';

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

const defaultHighlights = [
  { icon: Package, label: 'Capacity', sub: 'Standard' },
  { icon: Droplets, label: 'Weather', sub: 'Resistant' },
  { icon: Sliders, label: 'Ergonomic', sub: 'Comfort' },
  { icon: ShieldCheck, label: 'Durable', sub: 'Tested' },
];

const reviews = [
  {
    name: 'Rahim Uddin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    date: 'May 12, 2024',
    rating: 5,
    text: 'Excellent gear! Very comfortable to use and the condition was practically brand new.',
  },
  {
    name: 'Ayesha Rahman',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    date: 'Apr 28, 2024',
    rating: 5,
    text: 'Spacious and durable. I used it for a week-long camping trip and it performed perfectly.',
  },
  {
    name: 'Tanvir Hasan',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    date: 'Apr 15, 2024',
    rating: 5,
    text: 'Great value for money. Hassle-free pickup and drop-off service.',
  },
];

export default function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const pathname = usePathname();

  const [gear, setGear] = useState<IGear | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Gallery state
  const [selectedImg, setSelectedImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Booking states
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

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleRentNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = Cookies.get('accessToken');
    const userRole = Cookies.get('userRole');

    if (!token) {
      toast.warning('Please login to rent gear', {
        position: 'top-center',
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }, 1500);
      return;
    }

    if (userRole === 'PROVIDER') {
      const providerError =
        'Providers cannot rent gear. Please login with a Customer account.';
      toast.error(providerError, { position: 'top-center', autoClose: 3000 });
      setError(providerError);
      return;
    }

    const targetGearId = gear?.id || (gear as any)?._id;
    if (!targetGearId) {
      toast.error('Gear ID is missing!', { position: 'top-center' });
      return;
    }

    const total = calculateTotal();
    const days = calculateDays();

    if (total <= 0 || days <= 0) {
      const dateError = 'End date must be after Start date';
      toast.error(dateError, { position: 'top-center', autoClose: 3000 });
      setError(dateError);
      return;
    }

    setBookingLoading(true);

    try {
      const payload = {
        gearId: String(targetGearId),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: Number(total),
        rentalDays: days,
        gearItems: [
          {
            gearId: String(targetGearId),
            quantity: 1,
          },
        ],
      };

      await api.post('/api/rentals', payload);

      toast.success('Order placed successfully!', {
        position: 'top-center',
        autoClose: 1500,
      });

      setTimeout(() => {
        router.push('/dashboard/customer');
      }, 1000);
    } catch (err: any) {
      const errorData = err.response?.data;
      let message = 'Missing required fields for rental order';

      if (typeof errorData?.message === 'string') {
        message = errorData.message;
      } else if (Array.isArray(errorData?.errorSources)) {
        message = errorData.errorSources.map((s: any) => `${s.path}: ${s.message}`).join(', ');
      } else if (Array.isArray(errorData?.errors)) {
        message = errorData.errors.map((e: any) => e.message || e).join(', ');
      }

      setError(message);
      toast.error(message, {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#285724]" />
        <p className="text-sm font-medium">Loading gear details...</p>
      </div>
    );
  }

  if (notFound || !gear) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-extrabold text-zinc-900 mb-2">404 - Gear Not Found</h2>
        <p className="text-xs text-zinc-500 max-w-sm mb-6">
          The gear item you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/gear"
          className="bg-[#285724] hover:bg-[#1f441c] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Back to Gear List
        </Link>
      </div>
    );
  }

  const categoryName =
    typeof gear.category === 'object' ? gear.category?.name : gear.category || 'Gear';

  const imagesList =
    Array.isArray(gear.images) && gear.images.length > 0
      ? gear.images
      : [getGearImage(gear) || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80'];

  const specifications = [
    { label: 'Brand', value: gear.brand || 'GearUp Authentic' },
    { label: 'Category', value: categoryName },
    { label: 'Availability', value: gear.isAvailable ? 'In Stock' : 'Currently Unavailable' },
    { label: 'Stock Quantity', value: `${gear.stockQuantity || 1} Units available` },
    { label: 'Rental Policy', value: 'Security Deposit / ID Verified' },
    { label: 'Condition', value: 'Inspected & Safety Checked' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased selection:bg-[#285724] selection:text-white">
      
      {/* 1. BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
          <Link href="/" className="hover:text-zinc-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/gear" className="hover:text-zinc-900">Gear</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-600">{categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-950 font-bold truncate max-w-[200px]">{gear.title}</span>
        </div>
      </div>

      {/* 2. PRODUCT HERO / MAIN DETAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Gallery Section */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/80 group shadow-xs">
              <img
                src={imagesList[selectedImg] || imagesList[0]}
                alt={gear.title}
                className="w-full h-full object-cover"
              />

              <span className="absolute top-4 left-4 bg-[#285724] text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm">
                {gear.isAvailable ? 'Available for Rent' : 'Out of Stock'}
              </span>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-700 hover:text-red-500 shadow-sm transition cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImg((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-zinc-700 shadow-md transition opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImg((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-zinc-700 shadow-md transition opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Selection */}
            {imagesList.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      selectedImg === idx
                        ? 'border-[#285724] ring-2 ring-[#285724]/20'
                        : 'border-zinc-200/80 hover:border-zinc-300'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Rental Form Section */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                    {gear.title}
                  </h1>
                  <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                    {gear.brand ? `Brand: ${gear.brand}` : categoryName}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-zinc-400">SKU: GU-{(gear.id || '00').slice(-6).toUpperCase()}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-zinc-500 font-medium">(38 reviews)</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-zinc-950">৳ {gear.pricePerDay}</span>
                <span className="text-xs text-zinc-500 font-medium">/ per day</span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {gear.description}
              </p>

              {/* Highlights Grid */}
              <div className="grid grid-cols-4 gap-3 pt-2">
                {defaultHighlights.map((h, i) => (
                  <div
                    key={i}
                    className="bg-[#eff5ed]/80 border border-[#e1eee0] p-3 rounded-2xl flex flex-col items-center justify-center text-center"
                  >
                    <h.icon className="w-5 h-5 text-[#285724] mb-1" />
                    <span className="text-xs font-extrabold text-zinc-900 leading-none">{h.label}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{h.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Action Form */}
            <form onSubmit={handleRentNow} className="space-y-4 pt-4 border-t border-zinc-100">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#285724]" /> Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#fbfdfb] border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#285724]" /> End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#fbfdfb] border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
                  />
                </div>
              </div>

              {calculateTotal() > 0 && (
                <div className="bg-[#eff5ed] border border-[#d8ecd3] p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700">
                    Total Estimation ({calculateDays()} Days):
                  </span>
                  <span className="font-black text-base text-[#285724]">৳ {calculateTotal()}</span>
                </div>
              )}

              <div className="space-y-2.5">
                <button
                  type="submit"
                  disabled={!gear.isAvailable || bookingLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#285724] hover:bg-[#1f441c] disabled:bg-zinc-400 text-white py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer disabled:cursor-not-allowed"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Rental...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>{gear.isAvailable ? 'Rent Now' : 'Currently Unavailable'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#285724]" /> Free Delivery
                </span>
                <span>|</span>
                <span className="flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-[#285724]" /> 24/7 Support
                </span>
                <span>|</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#285724]" /> Verified Safety
                </span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT DESCRIPTION & SPECIFICATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Description */}
          <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-zinc-950">Product Description</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {gear.description}
            </p>
            <ul className="space-y-2.5 pt-2">
              {[
                'Full safety check and sanitization completed prior to delivery',
                'High-performance materials suited for extreme outdoor conditions',
                'Ergonomic, lightweight structure designed for endurance',
                'Includes standard setup and user manual guidance',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs text-zinc-700">
                  <CheckCircle2 className="w-4 h-4 text-[#285724] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-zinc-950">Specifications</h3>
            <div className="border border-zinc-100 rounded-2xl overflow-hidden text-xs divide-y divide-zinc-100">
              {specifications.map((spec, idx) => (
                <div key={idx} className={`grid grid-cols-2 p-3 ${idx % 2 === 0 ? 'bg-[#fafbfa]' : 'bg-white'}`}>
                  <span className="font-semibold text-zinc-500">{spec.label}</span>
                  <span className="font-bold text-zinc-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#eff5ed] border border-[#e1ece0] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-extrabold text-zinc-950">Customer Reviews</h3>
              <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-zinc-200/80">
                <span className="text-xs font-black text-zinc-900">4.8/5</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">(38 reviews)</span>
              </div>
            </div>

            <button className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-bold px-4 py-2 rounded-xl transition shadow-2xs self-start sm:self-auto cursor-pointer">
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-3">
                  <Image src={rev.avatar} alt={rev.name} width={36} height={36} className="rounded-full object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                      {rev.name}
                      <CheckCircle2 className="w-3 h-3 text-[#285724]" />
                    </h5>
                    <span className="text-[10px] text-emerald-600 font-semibold">Verified Renter</span>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed italic">"{rev.text}"</p>
                <span className="text-[10px] text-zinc-400 block pt-1">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER */}
      <section className="bg-[#eff5ed] py-10 border-t border-zinc-200/60 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#285724] text-white flex items-center justify-center shrink-0">
              <Send className="w-5 h-5 -ml-0.5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base">Stay Updated for New Adventures</h3>
              <p className="text-xs text-zinc-500">Subscribe to get special offers, new gear alerts, and adventure tips.</p>
            </div>
          </div>

          <div className="flex w-full md:w-auto items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#285724] w-full md:w-72"
            />
            <button className="bg-[#285724] hover:bg-[#1f441c] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition whitespace-nowrap cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}