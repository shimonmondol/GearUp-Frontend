"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Star,
  Heart,
  ShoppingBag,
  Search,
  RotateCcw,
  ChevronLeft,
  MapPin,
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
  description?: string;
  location?: string;
  category: string | CategoryObject;
  pricePerDay: number | string;
  rating?: number;
  reviews?: number;
  tag?: string;
  image?: string;
  images?: string[];
  [key: string]: any;
}

const getCategoryName = (
  category: string | CategoryObject | undefined | null
): string => {
  if (!category) return "";
  if (typeof category === "object") {
    return category.name || category.slug || "";
  }
  return String(category);
};

const getProductImage = (item: Product): string => {
  if (
    Array.isArray(item.images) &&
    item.images.length > 0 &&
    typeof item.images[0] === "string"
  ) {
    return item.images[0];
  }
  if (typeof item.image === "string" && item.image.trim() !== "") {
    return item.image;
  }
  return "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80";
};

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

  // 1. Search Query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 2. Filters (Max Price default set to 1500)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [minRating, setMinRating] = useState<number>(0);

  // 3. Sorting
  const [sortBy, setSortBy] = useState<string>("default");

  // 4. Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchGearData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://gear-up-beta.vercel.app/api/gear");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        const productList: any[] = Array.isArray(data)
          ? data
          : data.data || data.gears || [];
        const formattedProducts = productList.map((item, index) => {
          const itemId = item.id || item._id || item.title || "";
          const hash = getStableHash(itemId);

          return {
            ...item,
            id: itemId,
            originalIndex: index,
            pricePerDay: Number(item.pricePerDay ?? item.price) || 0,
            rating:
              item.rating && item.rating >= 4
                ? item.rating
                : hash % 2 === 0
                ? 5
                : 4,
            reviews: item.reviews || 20 + (hash % 80),
            location: item.location || "Dhaka, Bangladesh",
            description:
              item.description ||
              "Top quality outdoor rental gear, thoroughly sanitized, inspected, and ready for adventure.",
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

  const categoryNames = useMemo(() => {
    return Array.from(
      new Set(
        products.map((item) => getCategoryName(item.category)).filter(Boolean)
      )
    );
  }, [products]);

  const categories = useMemo(() => {
    return categoryNames.map((name) => ({
      label: name,
      count: products.filter(
        (item) => getCategoryName(item.category) === name
      ).length,
    }));
  }, [categoryNames, products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, maxPrice, minRating, sortBy]);

  // Filtering & Sorting Pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesSearch =
          searchQuery.trim() === "" ||
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          getCategoryName(item.category)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory
          ? getCategoryName(item.category) === selectedCategory
          : true;

        const itemPrice = Number(item.pricePerDay) || 0;
        const matchesPrice = itemPrice <= maxPrice;

        const itemRating = Number(item.rating) || 0;
        const matchesRating = itemRating >= minRating;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
      })
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
          return (
            (b.reviews || 0) * (b.rating || 1) -
            (a.reviews || 0) * (a.rating || 1)
          );
        }
        return (a.originalIndex ?? 0) - (b.originalIndex ?? 0);
      });
  }, [products, searchQuery, selectedCategory, maxPrice, minRating, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setMaxPrice(1500);
    setMinRating(0);
    setSortBy("default");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfa] dark:bg-gray-900 text-zinc-900 dark:text-gray-100 font-sans antialiased selection:bg-[#2e5328] selection:text-white transition-colors duration-300">
      {/* 1. HERO SECTION WITH SEARCH BAR */}
      <section className="relative bg-linear-to-b from-[#eaf2e8] to-[#f9fbf8] dark:bg-none dark:bg-gray-900 pt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl overflow-hidden min-h-60 flex flex-col justify-center px-6 sm:px-10 py-8 bg-cover bg-right mt-9 border border-zinc-200/50 dark:border-gray-800"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/80 backdrop-blur-[2px] transition-colors duration-300"></div>

            <div className="relative z-10 max-w-2xl space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-gray-50">
                Explore <span className="text-[#2e5328] dark:text-[#5fa352]">Gear</span> Collection
              </h1>
              <p className="text-zinc-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                Search and filter high-performance outdoor equipment for camping, cycling, trekking, and more.
              </p>

              {/* Search Bar Input */}
              <div className="relative pt-2 max-w-lg">
                <Search className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gears by title or category..."
                  className="w-full bg-white dark:bg-gray-800 text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-gray-700 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e5328] transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-gray-400 pt-1">
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-zinc-800 dark:hover:text-gray-200 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-zinc-900 dark:text-gray-100 font-semibold">Gear</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-zinc-100 dark:border-gray-700 shadow-sm h-fit transition-colors duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-gray-700">
              <h3 className="font-bold text-zinc-900 dark:text-gray-100 text-sm">
                Filter Gear
              </h3>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-[#2e5328] dark:text-[#5fa352] hover:underline font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Field 1: Categories */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-zinc-800 dark:text-gray-200 uppercase tracking-wider">
                1. Category
              </h4>
              <div className="space-y-2 text-xs text-zinc-600 dark:text-gray-400">
                {loading ? (
                  <div className="space-y-2 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-zinc-200 dark:bg-gray-700 rounded w-full"></div>
                    ))}
                  </div>
                ) : (
                  categories.map((cat, idx) => (
                    <label
                      key={idx}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategory === cat.label}
                          onChange={() =>
                            setSelectedCategory(
                              selectedCategory === cat.label ? null : cat.label
                            )
                          }
                          className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#2e5328] focus:ring-[#2e5328] accent-[#2e5328] cursor-pointer"
                        />
                        <span
                          className={`${
                            selectedCategory === cat.label
                              ? "text-[#2e5328] dark:text-[#5fa352] font-bold"
                              : "group-hover:text-zinc-950 dark:group-hover:text-gray-100"
                          } transition`}
                        >
                          {cat.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 dark:text-gray-500">
                        ({cat.count})
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Field 2: Max Price */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-gray-200 uppercase tracking-wider">
                  2. Max Price
                </h4>
                <span className="text-xs font-extrabold text-[#2e5328] dark:text-[#5fa352]">
                  ৳ {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#2e5328] dark:accent-[#5fa352] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 dark:text-gray-500">
                <span>৳ 100</span>
                <span>৳ 1,500</span>
              </div>
            </div>

            {/* Field 3: Minimum Rating */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-gray-700">
              <h4 className="text-xs font-bold text-zinc-800 dark:text-gray-200 uppercase tracking-wider">
                3. Minimum Rating
              </h4>
              <div className="space-y-1.5 text-xs">
                {[0, 4, 5].map((rate) => (
                  <label
                    key={rate}
                    className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-gray-400"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rate}
                      onChange={() => setMinRating(rate)}
                      className="accent-[#2e5328] dark:accent-[#5fa352] cursor-pointer"
                    />
                    <span>{rate === 0 ? "All Ratings" : `${rate} Stars & above`}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid Area & Sorting */}
          <main className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <p className="text-xs text-zinc-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-zinc-900 dark:text-gray-100">
                    {loading ? "..." : filteredProducts.length}
                  </span>{" "}
                  results
                </p>

                {/* Sorting Options Dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <label
                    htmlFor="sortSelect"
                    className="text-xs font-medium text-zinc-500 dark:text-gray-400"
                  >
                    Sort by:
                  </label>
                  <select
                    id="sortSelect"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-zinc-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-[#2e5328] cursor-pointer shadow-xs transition-colors"
                  >
                    <option value="default">Default</option>
                    <option value="popular">Popularity</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* SKELETON LOADER GRID (Desktop: 4 cards per row, same size) */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {[...Array(itemsPerPage)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-zinc-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col justify-between h-full animate-pulse"
                    >
                      <div>
                        <div className="h-44 w-full bg-zinc-200 dark:bg-gray-700" />
                        <div className="p-3.5 space-y-2.5">
                          <div className="h-2.5 w-1/3 bg-zinc-200 dark:bg-gray-700 rounded" />
                          <div className="h-4 w-4/5 bg-zinc-200 dark:bg-gray-700 rounded" />
                          <div className="space-y-1 pt-1">
                            <div className="h-2.5 w-full bg-zinc-200 dark:bg-gray-700 rounded" />
                            <div className="h-2.5 w-3/4 bg-zinc-200 dark:bg-gray-700 rounded" />
                          </div>
                          <div className="h-3 w-1/2 bg-zinc-200 dark:bg-gray-700 rounded" />
                          <div className="h-4 w-2/5 bg-zinc-200 dark:bg-gray-700 rounded pt-1" />
                        </div>
                      </div>
                      <div className="p-3.5 pt-0">
                        <div className="h-8 w-full bg-zinc-200 dark:bg-gray-700 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16 text-red-500 text-sm">
                  <p>{error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 dark:text-gray-400 text-sm space-y-3">
                  <p>No gear found matching your search and filter criteria.</p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2e5328] hover:bg-[#244220] text-white text-xs font-semibold cursor-pointer transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                /* 🌟 CORE CARDS GRID (Desktop: 4 cards per row, same height/width rules) */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {paginatedProducts.map((item) => {
                    const itemId = item.id || item._id;
                    const categoryTitle = getCategoryName(item.category);
                    const imageUrl = getProductImage(item);
                    const activeStars = item.rating || 5;

                    return (
                      <div
                        key={itemId}
                        className="group bg-white dark:bg-gray-800 rounded-2xl border border-zinc-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between h-full"
                      >
                        <div>
                          {/* 1. Image Area */}
                          <div className="relative h-44 w-full overflow-hidden bg-zinc-100 dark:bg-gray-700 shrink-0">
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

                            <button className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-zinc-700 dark:text-gray-300 hover:text-red-500 transition shadow-sm backdrop-blur-xs cursor-pointer">
                              <Heart className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* 2. Content Info */}
                          <div className="p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-gray-400 font-medium">
                              <span>{categoryTitle}</span>
                              <span className="flex items-center gap-0.5 text-[10px] text-zinc-500 dark:text-gray-400">
                                <MapPin className="w-3 h-3 text-[#2e5328] dark:text-[#5fa352]" />
                                {item.location}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-zinc-900 dark:text-gray-100 text-sm truncate">
                              {item.title}
                            </h3>

                            {/* Short Description (Line clamped for equal height) */}
                            <p className="text-[11px] text-zinc-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>

                            {/* Meta Info: Rating & Reviews */}
                            <div className="flex items-center gap-1 pt-0.5">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < activeStars
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-zinc-200 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-zinc-400 dark:text-gray-400">
                                ({item.reviews})
                              </span>
                            </div>

                            {/* Meta Info: Price */}
                            <div className="pt-1">
                              <span className="text-base font-extrabold text-zinc-900 dark:text-gray-100">
                                ৳ {Number(item.pricePerDay).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-zinc-500 dark:text-gray-400">
                                {" "}
                                / day
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3. "View Details" Button */}
                        <div className="p-3.5 pt-0">
                          <Link
                            href={`/gear/${itemId}`}
                            className="w-full flex items-center justify-center gap-1.5 bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white py-2 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10 pb-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-zinc-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-[#2e5328] text-white shadow-xs"
                          : "border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-zinc-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}