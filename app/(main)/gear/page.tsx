'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  ShieldCheck,
  Wallet,
  RefreshCw,
  Headphones,
  Star,
  Heart,
  ShoppingBag,
  ChevronLeft,
  Send,
} from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: 'Premium Quality',
    desc: 'Well-maintained and safety-checked gear',
  },
  {
    icon: Wallet,
    title: 'Affordable Rental',
    desc: 'Top gear at prices that fit your budget',
  },
  {
    icon: RefreshCw,
    title: 'Easy & Flexible',
    desc: 'Simple booking, flexible rental periods',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: "We're here to help you anytime, anywhere",
  },
];

const products = [
  {
    id: 'df05034e-0ba6-49c7-bdc3-cfe6126c19ce',
    title: '4 Person Camping Tent',
    category: 'Camping',
    price: 800,
    rating: 5,
    reviews: 45,
    tag: 'Popular',
    image: 'https://i.ibb.co.com/LwbNQ4m/campingtent.avif',
  },
  {
    id: '6569bed3-2e76-40e6-a38f-dd2e902fbb86',
    title: 'Trekking Backpack 60L',
    category: 'Fitness',
    price: 600,
    rating: 5,
    reviews: 38,
    image: 'https://i.ibb.co.com/DPzCbCc8/photo-1553062407-98eeb64c6a62.avif',
  },
  {
    id: '8c83311e-e626-4ae3-a29b-9ad84c979b9c',
    title: 'Mountain Bike',
    category: 'Cycling',
    price: 1200,
    rating: 5,
    reviews: 52,
    image: 'https://i.ibb.co.com/HDHNmD7f/bike.avif',
  },
  {
    id: '832578de-dbe6-4a48-a24c-10a28f34279f',
    title: 'Kayak Set',
    category: 'Cycling',
    price: 1000,
    rating: 5,
    reviews: 31,
    tag: 'Popular',
    image: 'https://i.ibb.co.com/ybzmLDR/kayakset.avif',
  },
  {
    id: 'da235a86-6e0e-49ac-9037-bf1359549415',
    title: 'Hiking Boots',
    category: 'Fitness',
    price: 400,
    rating: 5,
    reviews: 27,
    tag: 'New',
    image: 'https://i.ibb.co.com/nsZvm0XR/boots.avif',
  },
  {
    id: '091e8221-ced5-47d9-ab1d-28746a861f80',
    title: 'Sleeping Bag',
    category: 'Camping',
    price: 300,
    rating: 5,
    reviews: 22,
    image: 'https://i.ibb.co.com/Q32K4LQf/sleepingtent.avif',
  },
];

const categoryNames = [
  'Camping',
  'Fitness',
  'Cycling',
];

const categories = categoryNames.map((name) => ({
  label: name,
  count: products.filter((item) => item.category === name).length,
}));

export default function GearPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = products
    .filter((p) => (selectedCategory ? p.category === selectedCategory : true))
    .sort((a, b) => {
      if (sortBy === 'low-to-high') return a.price - b.price;
      if (sortBy === 'high-to-low') return b.price - a.price;
      return 0;
    });

  const handleCategoryChange = (categoryLabel: any) => {
    setSelectedCategory(selectedCategory === categoryLabel ? null : categoryLabel);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased selection:bg-[#2e5328] selection:text-white">
      {/* 1. HERO & VALUE HIGHLIGHTS */}
      <section className="relative bg-linear-to-b from-[#eaf2e8] to-[#f9fbf8] pt-10 pb-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl overflow-hidden min-h-55 flex flex-col justify-center px-6 sm:px-10 py-8 text-zinc-900 bg-cover bg-right"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-white/75 sm:bg-white/60 backdrop-blur-[2px]"></div>

            <div className="relative z-10 max-w-xl space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                Our <span className="text-[#2e5328]">Gear</span> Collection
              </h1>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                High-quality gear for every adventure. Rent the best, explore more, and create unforgettable memories.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 pt-2">
                <Link href="/" className="flex items-center gap-1 hover:text-zinc-800">
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-zinc-900 font-semibold">Gear</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur border border-zinc-200/80 rounded-xl p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 shadow-sm">
            {badges.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <b.icon className="w-5 h-5 text-[#2e5328] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 leading-tight">{b.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MAIN SECTION: FILTERS & PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filter */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6 bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900 text-sm">Filters</h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-[#2e5328] hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-zinc-800">Categories</h4>
              <div className="space-y-2 text-xs text-zinc-600">
                {categories.map((cat, idx) => (
                  <label key={idx} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.label}
                        onChange={() => handleCategoryChange(cat.label)}
                        className="w-3.5 h-3.5 rounded border-zinc-300 text-[#2e5328] focus:ring-[#2e5328] accent-[#2e5328] cursor-pointer"
                      />
                      <span className={`${selectedCategory === cat.label ? 'text-[#2e5328] font-bold' : 'group-hover:text-zinc-950'} transition`}>
                        {cat.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">({cat.count})</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-xs text-zinc-500">
                Showing <span className="font-semibold text-zinc-900">{filteredProducts.length}</span> of {products.length} results
              </p>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <label className="text-xs text-zinc-500">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#2e5328] cursor-pointer"
                >
                  <option value="popular">Popular</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No products found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {item.tag && (
                          <span
                            className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-sm ${
                              item.tag === 'Popular' ? 'bg-[#2e5328]' : 'bg-emerald-600'
                            }`}
                          >
                            {item.tag}
                          </span>
                        )}

                        <button className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 hover:bg-white text-zinc-700 hover:text-red-500 transition shadow-sm">
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3.5 space-y-1.5">
                        <span className="text-[11px] text-zinc-400 font-medium">{item.category}</span>
                        <h3 className="font-bold text-zinc-900 text-sm truncate">{item.title}</h3>

                        <div className="flex items-center gap-1">
                          <div className="flex text-amber-400">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-zinc-400">({item.reviews})</span>
                        </div>

                        <div className="pt-1">
                          <span className="text-base font-extrabold text-zinc-900">৳ {item.price}</span>
                          <span className="text-[10px] text-zinc-500"> / day</span>
                        </div>
                      </div>
                    </div>

                    {/* Rent Now বাটনকে Link কম্পোনেন্টে রূপান্তর করা হয়েছে */}
                    <div className="p-3.5 pt-0">
                      <Link
                        href={`/gear/${item.id}`}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#2e5328] hover:bg-[#244220] text-white py-2 rounded-lg text-xs font-semibold transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Rent Now</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 mt-10">
              <button className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 text-xs">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-[#2e5328] text-white font-bold text-xs flex items-center justify-center">
                1
              </button>
              <button className="w-8 h-8 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs flex items-center justify-center">
                2
              </button>
              <button className="w-8 h-8 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs flex items-center justify-center">
                3
              </button>
              <span className="px-1 text-xs text-zinc-400">...</span>
              <button className="w-8 h-8 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs flex items-center justify-center">
                10
              </button>
              <button className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 text-xs">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </main>
        </div>
      </section>

      {/* 3. NEWSLETTER */}
      <section className="bg-[#eef3eb] py-10 border-b border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#2e5328] text-white flex items-center justify-center shrink-0">
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
              className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#2e5328] w-full md:w-72"
            />
            <button className="bg-[#2e5328] hover:bg-[#244220] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}