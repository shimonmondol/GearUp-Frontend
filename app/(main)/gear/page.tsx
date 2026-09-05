"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Loader2,
} from "lucide-react";

interface CategoryObject {
  id?: string | number;
  name?: string;
  slug?: string;
  [key: string]: any;
}

interface Product {
  id: string | number;
  _id?: string;
  title: string;
  category: string | CategoryObject;
  pricePerDay: number | string;
  rating?: number;
  reviews?: number;
  tag?: string;
  image?: string;
  images?: string[];
  [key: string]: any;
}

const getCategoryName = (category: string | CategoryObject | undefined | null): string => {
  if (!category) return "";
  if (typeof category === "object") {
    return category.name || category.slug || "";
  }
  return String(category);
};

const getProductImage = (item: Product): string => {
  if (Array.isArray(item.images) && item.images.length > 0 && typeof item.images[0] === "string") {
    return item.images[0];
  }
  if (typeof item.image === "string" && item.image.trim() !== "") {
    return item.image;
  }
  return "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80";
};

// ID থেকে ফিক্সড সংখ্যা জেনারেট করার ফাংশন (যাতে রিলোডে পরিবর্তন না হয়)
const getStableHash = (id: string | number): number => {
  const str = String(id || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export default function GearPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("popular");

  useEffect(() => {
    const fetchGearData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://gear-up-beta.vercel.app/api/gear");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        const productList: any[] = Array.isArray(data) ? data : data.data || data.gears || [];

        const formattedProducts = productList.map((item) => {
          const itemId = item.id || item._id || item.title || "";
          const hash = getStableHash(itemId);

          return {
            ...item,
            id: itemId,
            pricePerDay: Number(item.pricePerDay ?? item.price) || 0,
            // ID-র ওপর ভিত্তি করে স্থির ৪ বা ৫ স্টার (রিলোডে বদলাবে না)
            rating: item.rating && item.rating >= 4 ? item.rating : (hash % 2 === 0 ? 5 : 4),
            // ID-র ওপর ভিত্তি করে স্থির রিভিউ সংখ্যা (২০ থেকে ৯৯ এর মধ্যে)
            reviews: item.reviews || 20 + (hash % 80),
          };
        });

        setProducts(formattedProducts);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchGearData();
  }, []);

  // ক্যাটাগরি তালিকা তৈরি
  const categoryNames = useMemo(() => {
    return Array.from(
      new Set(products.map((item) => getCategoryName(item.category)).filter(Boolean))
    );
  }, [products]);

  const categories = useMemo(() => {
    return categoryNames.map((name) => ({
      label: name,
      count: products.filter((item) => getCategoryName(item.category) === name).length,
    }));
  }, [categoryNames, products]);

  // ফিল্টারিং এবং সর্টিং হ্যান্ডলিং
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (selectedCategory ? getCategoryName(p.category) === selectedCategory : true))
      .sort((a, b) => {
        const priceA = Number(a.pricePerDay) || 0;
        const priceB = Number(b.pricePerDay) || 0;

        if (sortBy === "low-to-high") {
          return priceA - priceB;
        }
        if (sortBy === "high-to-low") {
          return priceB - priceA;
        }
        if (sortBy === "popular") {
          return ((b.reviews || 0) * (b.rating || 1)) - ((a.reviews || 0) * (a.rating || 1));
        }
        return 0;
      });
  }, [products, selectedCategory, sortBy]);

  const handleCategoryChange = (categoryLabel: string) => {
    setSelectedCategory(selectedCategory === categoryLabel ? null : categoryLabel);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased selection:bg-[#2e5328] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#eaf2e8] to-[#f9fbf8] pt-10 pb-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl overflow-hidden min-h-55 flex flex-col justify-center px-6 sm:px-10 py-8 text-zinc-900 bg-cover bg-right mt-9"
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
                High-quality gear for every adventure. Rent the best, explore
                more, and create unforgettable memories.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 pt-2">
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-zinc-800"
                >
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-zinc-900 font-semibold">Gear</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
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
                  <label
                    key={idx}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.label}
                        onChange={() => handleCategoryChange(cat.label)}
                        className="w-3.5 h-3.5 rounded border-zinc-300 text-[#2e5328] focus:ring-[#2e5328] accent-[#2e5328] cursor-pointer"
                      />
                      <span
                        className={`${
                          selectedCategory === cat.label
                            ? "text-[#2e5328] font-bold"
                            : "group-hover:text-zinc-950"
                        } transition`}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      ({cat.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid Area */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-xs text-zinc-500">
                Showing{" "}
                <span className="font-semibold text-zinc-900">
                  {filteredProducts.length}
                </span>{" "}
                of {products.length} results
              </p>

              {/* সর্ট ড্রপডাউন */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <label htmlFor="sortSelect" className="text-xs font-medium text-zinc-500">
                  Sort by:
                </label>
                <select
                  id="sortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#2e5328] cursor-pointer shadow-2xs"
                >
                  <option value="popular">Popularity</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-[#2e5328] mb-2" />
                <p className="text-sm">Loading gears...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-500 text-sm">
                <p>{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No products found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {filteredProducts.map((item) => {
                  const itemId = item.id || item._id;
                  const categoryTitle = getCategoryName(item.category);
                  const imageUrl = getProductImage(item);
                  const activeStars = item.rating || 5;

                  return (
                    <div
                      key={itemId}
                      className="group bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                          <Image
                            src={imageUrl}
                            alt={item.title || "Gear item"}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {item.tag && (
                            <span
                              className={`absolute top-2.5 left-2.5 z-10 text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-sm ${
                                item.tag === "Popular"
                                  ? "bg-[#2e5328]"
                                  : "bg-emerald-600"
                              }`}
                            >
                              {item.tag}
                            </span>
                          )}

                          <button className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-zinc-700 hover:text-red-500 transition shadow-sm">
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-3.5 space-y-1.5">
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {categoryTitle}
                          </span>
                          <h3 className="font-bold text-zinc-900 text-sm truncate">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < activeStars
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-zinc-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-zinc-400">
                              ({item.reviews})
                            </span>
                          </div>

                          <div className="pt-1">
                            <span className="text-base font-extrabold text-zinc-900">
                              ৳ {Number(item.pricePerDay).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {" "}
                              / day
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 pt-0">
                        <Link
                          href={`/gear/${itemId}`}
                          className="w-full flex items-center justify-center gap-1.5 bg-[#2e5328] hover:bg-[#244220] text-white py-2 rounded-lg text-xs font-semibold transition"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Rent Now</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}