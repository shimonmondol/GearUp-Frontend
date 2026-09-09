"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/lib/axios";
import {
  Home,
  ChevronRight,
  Heart,
  Package,
  Droplets,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Calendar,
  ShoppingBag,
} from "lucide-react";

const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80";

const defaultHighlights = [
  { icon: Package, label: "Capacity", sub: "Standard" },
  { icon: Droplets, label: "Weather", sub: "Resistant" },
  { icon: Sliders, label: "Ergonomic", sub: "Comfort" },
  { icon: ShieldCheck, label: "Durable", sub: "Tested" },
];

const gearCache = new Map<string, any>();

// শিমার প্লেসহোল্ডার (SVG Base64)
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f4f5f3" offset="20%" />
      <stop stop-color="#e7eae5" offset="50%" />
      <stop stop-color="#f4f5f3" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f4f5f3" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const extractProductImage = (item: any): string => {
  if (!item) return DEFAULT_PLACEHOLDER;
  if (Array.isArray(item.images) && item.images.length > 0 && typeof item.images[0] === "string") {
    return item.images[0];
  }
  if (Array.isArray(item.photos) && item.photos.length > 0 && typeof item.photos[0] === "string") {
    return item.photos[0];
  }
  if (typeof item.image === "string" && item.image.trim() !== "") {
    return item.image;
  }
  if (typeof item.imageUrl === "string" && item.imageUrl.trim() !== "") {
    return item.imageUrl;
  }
  if (typeof item.img === "string" && item.img.trim() !== "") {
    return item.img;
  }
  return DEFAULT_PLACEHOLDER;
};

export default function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const currentId = resolvedParams.id;

  const [gear, setGear] = useState<any | null>(() => gearCache.get(currentId) || null);
  const [loading, setLoading] = useState<boolean>(() => !gearCache.has(currentId));
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(() =>
    gearCache.get(currentId) ? extractProductImage(gearCache.get(currentId)) : ""
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    if (gearCache.has(currentId)) {
      const cached = gearCache.get(currentId);
      setGear(cached);
      setImgSrc(extractProductImage(cached));
      setLoading(false);
      return;
    }

    const fetchGearDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://gear-up-beta.vercel.app/api/gear/${currentId}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        const data = json?.data || json?.gear || json;

        if (data && (data.id || data._id || data.title)) {
          const finalImage = extractProductImage(data);
          const formattedItem = {
            ...data,
            id: data.id || data._id || currentId,
            pricePerDay: Number(data.pricePerDay ?? data.price) || 0,
            mainImage: finalImage,
          };

          gearCache.set(currentId, formattedItem);

          if (isMounted) {
            setGear(formattedItem);
            setImgSrc(finalImage);
          }
        } else if (isMounted) {
          setNotFound(true);
        }
      } catch {
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGearDetails();

    return () => {
      isMounted = false;
    };
  }, [currentId]);

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 0;
  }, [startDate, endDate]);

  const total = useMemo(() => {
    const price = gear?.pricePerDay || 0;
    return days * price;
  }, [days, gear]);

  const handleRentNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = Cookies.get("accessToken");
    const userRole = Cookies.get("userRole");

    // ১. টোকেন না থাকলে লগইনে রিডাইরেক্ট
    if (!token) {
      toast.warning("Please login to rent gear", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }, 1000);
      return;
    }

    // ২. স্কিমার Role enums অনুযায়ী ছোট হাতের কন্ডিশন চেক
    if (userRole && userRole.toLowerCase() === "provider") {
      const msg = "Providers cannot rent gear. Please login with a Customer account.";
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
      });
      setError(msg);
      return;
    }

    const targetGearId = gear?.id || gear?._id;
    if (!targetGearId) {
      toast.error("Gear ID is missing!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (total <= 0 || days <= 0) {
      const dateError = "End date must be after Start date";
      toast.error(dateError, {
        position: "top-center",
        autoClose: 3000,
      });
      setError(dateError);
      return;
    }

    setBookingLoading(true);

    try {
      // ৩. Prisma Schema অনুযায়ী তৈরি ক্লিন পেলোড
      const payload = {
        gearId: String(targetGearId),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: parseFloat(Number(total).toFixed(2)),
        rentalDays: days,
        orderItems: [
          {
            gearId: String(targetGearId),
            quantity: 1,
          },
        ],
        gearItems: [
          {
            gearId: String(targetGearId),
            quantity: 1,
          },
        ],
      };

      // ৪. সরাসরি Bearer Token পাস করা হচ্ছে
      await api.post("/api/rentals", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Rental booked successfully!", {
        position: "top-center",
        autoClose: 1000,
      });

      // ৫. সরাসরি কাস্টমার ড্যাশবোর্ডে রিডাইরেক্ট ও রিফ্রেশ
      setTimeout(() => {
        router.push("/dashboard/customer");
        router.refresh();
      }, 700);
    } catch (err: any) {
      const errorData = err.response?.data;
      let message = "Failed to process rental request.";

      if (typeof errorData?.message === "string") {
        message = errorData.message;
      } else if (Array.isArray(errorData?.errorSources)) {
        message = errorData.errorSources.map((s: any) => `${s.path}: ${s.message}`).join(", ");
      } else if (Array.isArray(errorData?.errors)) {
        message = errorData.errors.map((e: any) => e.message || e).join(", ");
      }

      setError(message);
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-zinc-500 mt-10">
        <Loader2 className="w-9 h-9 animate-spin text-[#2e5328]" />
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Loading details...</p>
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
          className="bg-[#2e5328] hover:bg-[#244220] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Back to Gear Collection
        </Link>
      </div>
    );
  }

  const categoryName = typeof gear.category === "object" ? gear.category?.name : gear.category || "Gear";

  const specifications = [
    { label: "Brand", value: gear.brand || "Authentic" },
    { label: "Category", value: categoryName },
    { label: "Availability", value: gear.isAvailable !== false ? "In Stock" : "Out of Stock" },
    { label: "Stock Quantity", value: `${gear.stockQuantity ?? 1} Units available` },
    { label: "Rental Policy", value: "Verified ID & Standard Deposit" },
    { label: "Condition", value: "Inspected & Safety Checked" },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased selection:bg-[#2e5328] selection:text-white mt-18">
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-4"
      />

      {/* 1. BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
          <Link href="/" className="flex items-center gap-1 hover:text-zinc-900">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/gear" className="hover:text-zinc-900">Gear</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-600">{categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-950 font-bold truncate max-w-50">{gear.title}</span>
        </div>
      </div>

      {/* 2. PRODUCT MAIN DETAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Optimized Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/80 group shadow-xs">
              <Image
                src={imgSrc || DEFAULT_PLACEHOLDER}
                alt={gear.title || "Gear Image"}
                fill
                priority
                unoptimized
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgSrc(DEFAULT_PLACEHOLDER)}
              />

              {gear.tag && (
                <span className="absolute top-4 left-4 z-10 bg-[#2e5328] text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm">
                  {gear.tag}
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-700 hover:text-red-500 shadow-sm transition cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Info & Booking Form */}
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
                <span className="text-[11px] font-bold text-zinc-400">
                  SKU: GU-{(gear.id || "00").slice(-6).toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-zinc-950">
                  ৳ {Number(gear.pricePerDay).toLocaleString()}
                </span>
                <span className="text-xs text-zinc-500 font-medium">/ per day</span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {gear.description}
              </p>

              <div className="grid grid-cols-4 gap-3 pt-2">
                {defaultHighlights.map((h, i) => (
                  <div
                    key={i}
                    className="bg-[#eff5ed]/80 border border-[#e1eee0] p-3 rounded-2xl flex flex-col items-center justify-center text-center"
                  >
                    <h.icon className="w-5 h-5 text-[#2e5328] mb-1" />
                    <span className="text-xs font-extrabold text-zinc-900 leading-none">{h.label}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{h.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleRentNow} className="space-y-4 pt-4 border-t border-zinc-100">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2e5328]" /> Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#fbfdfb] border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2e5328]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2e5328]" /> End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#fbfdfb] border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2e5328]"
                  />
                </div>
              </div>

              {total > 0 && (
                <div className="bg-[#eff5ed] border border-[#d8ecd3] p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700">
                    Total Estimation ({days} Days):
                  </span>
                  <span className="font-black text-base text-[#2e5328]">
                    ৳ {total.toLocaleString()}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#2e5328] hover:bg-[#244220] text-white py-3 rounded-xl text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Rental...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Rent Now</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. DESCRIPTION & SPECIFICATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-zinc-950">Product Description</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">{gear.description}</p>
            <ul className="space-y-2.5 pt-2">
              {[
                "Full safety check and sanitization completed prior to handover",
                "High-performance materials suited for extreme outdoor conditions",
                "Ergonomic, lightweight structure designed for endurance",
                "Includes standard accessories and essential setup guide",
              ].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs text-zinc-700">
                  <CheckCircle2 className="w-4 h-4 text-[#2e5328] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-zinc-950">Specifications</h3>
            <div className="border border-zinc-100 rounded-2xl overflow-hidden text-xs divide-y divide-zinc-100">
              {specifications.map((spec, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-2 p-3 ${idx % 2 === 0 ? "bg-[#fafbfa]" : "bg-white"}`}
                >
                  <span className="font-semibold text-zinc-500">{spec.label}</span>
                  <span className="font-bold text-zinc-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}