"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useParams } from "next/navigation";
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
  PackageX,
  Search,
  ArrowLeft,
  Star,
  UserCheck,
} from "lucide-react";

const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80";

const defaultHighlights = [
  { icon: Package, label: "Capacity", sub: "Standard" },
  { icon: Droplets, label: "Weather", sub: "Resistant" },
  { icon: Sliders, label: "Ergonomic", sub: "Comfort" },
  { icon: ShieldCheck, label: "Durable", sub: "Tested" },
];

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

const extractAllImages = (item: any): string[] => {
  if (!item) return [DEFAULT_PLACEHOLDER];
  const list: string[] = [];
  if (Array.isArray(item.images)) list.push(...item.images.filter((x: any) => typeof x === "string" && x.trim() !== ""));
  if (Array.isArray(item.photos)) list.push(...item.photos.filter((x: any) => typeof x === "string" && x.trim() !== ""));
  if (typeof item.image === "string" && item.image.trim()) list.push(item.image);
  if (typeof item.imageUrl === "string" && item.imageUrl.trim()) list.push(item.imageUrl);
  if (typeof item.img === "string" && item.img.trim()) list.push(item.img);

  const unique = Array.from(new Set(list));
  if (unique.length === 0) return [DEFAULT_PLACEHOLDER];
  return unique;
};

const RESERVED_SLUGS = new Set([
  "provider",
  "customer",
  "dashboard",
  "new",
  "addgear",
  "admin",
  "orders",
  "pay",
  "categories",
]);

// 🌟 Full Page Details Skeleton Component (with dark:bg-gray-800)
const GearDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#fcfdfa] dark:bg-gray-900 font-sans antialiased mt-18 animate-pulse transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-zinc-200 dark:bg-gray-800 rounded"></div>
          <div className="h-3 w-3 bg-zinc-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-4 w-14 bg-zinc-200 dark:bg-gray-800 rounded"></div>
          <div className="h-3 w-3 bg-zinc-200 dark:bg-gray-800 rounded-full"></div>
          <div className="h-4 w-32 bg-zinc-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-4/3 w-full rounded-3xl bg-zinc-200 dark:bg-gray-800 border border-zinc-200/60 dark:border-gray-700"></div>
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-16 rounded-xl bg-zinc-200 dark:bg-gray-800"></div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-8 w-4/5 bg-zinc-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="h-8 w-28 bg-zinc-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-zinc-200 dark:bg-gray-800 rounded"></div>
                <div className="h-3.5 w-4/5 bg-zinc-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
            <div className="h-11 w-full bg-zinc-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function GearDetailsPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const routeParams = useParams();

  const [currentId, setCurrentId] = useState<string>("");
  const [gear, setGear] = useState<any | null>(null);
  const [allGears, setAllGears] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const resolveParams = async () => {
      let extractedId = "";

      if (params) {
        try {
          const resolved = await params;
          if (resolved?.id) extractedId = resolved.id;
        } catch {
          // ignore error
        }
      }

      if (!extractedId && routeParams?.id) {
        extractedId = Array.isArray(routeParams.id)
          ? routeParams.id[0]
          : (routeParams.id as string);
      }

      if (isMounted && extractedId) {
        if (RESERVED_SLUGS.has(extractedId.toLowerCase())) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setCurrentId(extractedId);
      }
    };

    resolveParams();

    return () => {
      isMounted = false;
    };
  }, [params, routeParams]);

  useEffect(() => {
    if (!currentId) return;

    let isMounted = true;

    const fetchGearDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Single Gear Fetch
        const res = await api.get(`/api/gear/${currentId}`);
        const json = res.data;
        const data = json?.data || json?.gear || json;

        if (data && (data.id || data._id || data.title)) {
          const images = extractAllImages(data);
          const formattedItem = {
            ...data,
            id: data.id || data._id || currentId,
            pricePerDay: Number(data.pricePerDay ?? data.price) || 0,
            rating: Number(data.rating) || 5,
            reviewsCount: Number(data.reviews) || 24,
          };

          if (isMounted) {
            setGear(formattedItem);
            setImageList(images);
            setActiveImage(images[0]);
            setNotFound(false);
          }
        } else if (isMounted) {
          setNotFound(true);
        }

        // Fetch All Gears to extract Related Items
        try {
          const listRes = await fetch("https://gear-up-beta.vercel.app/api/gear");
          if (listRes.ok) {
            const listJson = await listRes.json();
            const rawList: any[] = Array.isArray(listJson)
              ? listJson
              : listJson.data || listJson.gears || [];
            if (isMounted) setAllGears(rawList);
          }
        } catch {
          // ignore related fetch error
        }
      } catch (err: any) {
        console.error("Fetch gear error details:", err);
        if (isMounted) {
          if (err.response?.status === 404) {
            setNotFound(true);
          } else {
            toast.error(
              err.response?.data?.message ||
                "Could not reach backend server. Please verify your connection."
            );
          }
        }
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

  const categoryName = useMemo(() => {
    if (!gear?.category) return "Gear";
    if (typeof gear.category === "object") return gear.category.name || gear.category.slug || "Gear";
    return String(gear.category);
  }, [gear]);

  // 📦 Related Items Filter
  const relatedGears = useMemo(() => {
    if (!gear) return [];
    return allGears
      .filter((item) => {
        const itemId = item.id || item._id;
        if (String(itemId) === String(gear.id)) return false;
        const itemCat = typeof item.category === "object" ? item.category?.name : item.category;
        return itemCat === categoryName || categoryName === "Gear";
      })
      .slice(0, 4);
  }, [allGears, gear, categoryName]);

  const handleRentNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = Cookies.get("accessToken");
    const userRole = Cookies.get("userRole");

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

    if (userRole && userRole.toLowerCase() === "provider") {
      const msg = "Providers cannot rent gear. Please login with a Customer account.";
      toast.error(msg, { position: "top-center", autoClose: 3000 });
      setError(msg);
      return;
    }

    const targetGearId = gear?.id || gear?._id;
    if (!targetGearId) {
      toast.error("Gear ID is missing!", { position: "top-center", autoClose: 2000 });
      return;
    }

    if (total <= 0 || days <= 0) {
      const dateError = "End date must be after Start date";
      toast.error(dateError, { position: "top-center", autoClose: 3000 });
      setError(dateError);
      return;
    }

    setBookingLoading(true);

    try {
      const payload = {
        gearId: String(targetGearId),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: parseFloat(Number(total).toFixed(2)),
        rentalDays: days,
        orderItems: [{ gearId: String(targetGearId), quantity: 1 }],
        gearItems: [{ gearId: String(targetGearId), quantity: 1 }],
      };

      await api.post("/api/rentals", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Rental booked successfully!", {
        position: "top-center",
        autoClose: 1000,
      });

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
      toast.error(message, { position: "top-center", autoClose: 3000 });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <GearDetailsSkeleton />;
  }

  if (notFound || !gear) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 mt-16">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl border border-zinc-200/80 dark:border-gray-700 shadow-sm transition-colors duration-300">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
            <PackageX className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Item Unavailable
            </span>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
              Gear Item Not Found
            </h2>
            <p className="text-xs text-zinc-500 dark:text-gray-400 leading-relaxed">
              The equipment you are trying to view does not exist or has been removed.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/gear"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white py-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explore Gear Catalog</span>
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-100 dark:bg-gray-700 hover:bg-zinc-200/70 dark:hover:bg-gray-600 text-zinc-700 dark:text-gray-200 py-3 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const specifications = [
    { label: "Brand", value: gear.brand || "Authentic" },
    { label: "Category", value: categoryName },
    {
      label: "Availability",
      value: gear.isAvailable !== false ? "In Stock" : "Out of Stock",
    },
    {
      label: "Stock Quantity",
      value: `${gear.stockQuantity ?? 1} Units available`,
    },
    { label: "Rental Policy", value: "Verified ID & Standard Deposit" },
    { label: "Condition", value: "Inspected & Safety Checked" },
  ];

  const mockReviews = [
    {
      name: "Tanvir Ahmed",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent condition gear! Clean, easy to setup, and worked smoothly during our whole tour.",
    },
    {
      name: "Sabbir Hossain",
      rating: 4,
      date: "1 week ago",
      comment: "Very durable materials. Pickup process was simple and provider was supportive.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfa] dark:bg-gray-900 text-zinc-900 dark:text-gray-100 font-sans antialiased selection:bg-[#2e5328] selection:text-white mt-18 transition-colors duration-300">
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
        className="mt-4"
      />

      {/* 1. BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-gray-400">
          <Link href="/" className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-gray-200 transition-colors">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/gear" className="hover:text-zinc-900 dark:hover:text-gray-200 transition-colors">
            Gear
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-600 dark:text-gray-400">{categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-950 dark:text-gray-100 font-bold truncate max-w-50">
            {gear.title}
          </span>
        </div>
      </div>

      {/* 2. PRODUCT MAIN DETAILS (With Multiple Images Media Gallery) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Image + Thumbnails */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-zinc-100 dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 group shadow-xs">
              <Image
                src={activeImage || DEFAULT_PLACEHOLDER}
                alt={gear.title || "Gear Image"}
                fill
                priority
                unoptimized
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setActiveImage(DEFAULT_PLACEHOLDER)}
              />

              {gear.tag && (
                <span className="absolute top-4 left-4 z-10 bg-[#2e5328] text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm">
                  {gear.tag}
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xs flex items-center justify-center text-zinc-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 shadow-sm transition cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>

            {/* Multiple Images Thumbnails */}
            {imageList.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImage === img
                        ? "border-[#2e5328] dark:border-[#5fa352] ring-2 ring-[#2e5328]/30"
                        : "border-zinc-200 dark:border-gray-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info & Booking Form */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-gray-100 tracking-tight">
                    {gear.title}
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-gray-400 font-semibold mt-0.5">
                    {gear.brand ? `Brand: ${gear.brand}` : categoryName}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-zinc-400 dark:text-gray-500">
                  SKU: GU-{(gear.id || "00").slice(-6).toUpperCase()}
                </span>
              </div>

              {/* Price & Rating Summary */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-zinc-950 dark:text-gray-100">
                    ৳ {Number(gear.pricePerDay).toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-gray-400 font-medium">/ per day</span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-gray-100">{gear.rating}</span>
                  <span className="text-[10px] text-zinc-500 dark:text-gray-400">({gear.reviewsCount} reviews)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-gray-300 leading-relaxed">
                {gear.description}
              </p>

              {/* 4 Feature Highlights Cards */}
              <div className="grid grid-cols-4 gap-3 pt-2">
                {defaultHighlights.map((h, i) => (
                  <div
                    key={i}
                    className="bg-[#eff5ed]/80 dark:bg-gray-800 border border-[#e1eee0] dark:border-gray-700 p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-colors"
                  >
                    <h.icon className="w-5 h-5 text-[#2e5328] dark:text-[#5fa352] mb-1" />
                    <span className="text-xs font-extrabold text-zinc-900 dark:text-gray-200 leading-none">
                      {h.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-gray-400 mt-0.5">
                      {h.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <form
              onSubmit={handleRentNow}
              className="space-y-4 pt-4 border-t border-zinc-100 dark:border-gray-700"
            >
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2e5328] dark:text-[#5fa352]" /> Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#fbfdfb] dark:bg-gray-800 border border-zinc-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-750 focus:outline-none focus:ring-1 focus:ring-[#2e5328]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2e5328] dark:text-[#5fa352]" /> End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#fbfdfb] dark:bg-gray-800 border border-zinc-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-750 focus:outline-none focus:ring-1 focus:ring-[#2e5328]"
                  />
                </div>
              </div>

              {total > 0 && (
                <div className="bg-[#eff5ed] dark:bg-gray-800 border border-[#d8ecd3] dark:border-gray-700 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 dark:text-gray-300">
                    Total Estimation ({days} Days):
                  </span>
                  <span className="font-black text-base text-[#2e5328] dark:text-[#5fa352]">
                    ৳ {total.toLocaleString()}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white py-3 rounded-xl text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50"
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

      {/* 3. SEPARATE SECTIONS: DESCRIPTION & SPECIFICATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-6 sm:p-8 space-y-4 transition-colors">
            <h3 className="text-base font-extrabold text-zinc-950 dark:text-gray-100">
              Product Description / Overview
            </h3>
            <p className="text-xs text-zinc-600 dark:text-gray-300 leading-relaxed">
              {gear.description}
            </p>
            <ul className="space-y-2.5 pt-2">
              {[
                "Full safety check and sanitization completed prior to handover",
                "High-performance materials suited for extreme outdoor conditions",
                "Ergonomic, lightweight structure designed for endurance",
                "Includes standard accessories and essential setup guide",
              ].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#2e5328] dark:text-[#5fa352] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-6 sm:p-8 space-y-4 transition-colors">
            <h3 className="text-base font-extrabold text-zinc-950 dark:text-gray-100">
              Key Information / Specifications
            </h3>
            <div className="border border-zinc-100 dark:border-gray-700 rounded-2xl overflow-hidden text-xs divide-y divide-zinc-100 dark:divide-gray-700">
              {specifications.map((spec, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-2 p-3 ${
                    idx % 2 === 0
                      ? "bg-[#fafbfa] dark:bg-gray-800/60"
                      : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <span className="font-semibold text-zinc-500 dark:text-gray-400">{spec.label}</span>
                  <span className="font-bold text-zinc-900 dark:text-gray-100">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. REVIEWS & RATINGS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-gray-700">
            <div>
              <h3 className="text-base font-extrabold text-zinc-950 dark:text-gray-100">
                Customer Reviews & Ratings
              </h3>
              <p className="text-xs text-zinc-500 dark:text-gray-400 mt-0.5">
                Verified reviews from recent renters
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-gray-100">4.9 out of 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockReviews.map((rev, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-gray-750 border border-zinc-100 dark:border-gray-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#2e5328]/15 text-[#2e5328] dark:text-[#5fa352] flex items-center justify-center font-bold text-xs">
                      {rev.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-gray-100 flex items-center gap-1">
                        {rev.name}
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                      </p>
                      <p className="text-[10px] text-zinc-400 dark:text-gray-400">{rev.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-gray-300 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RELATED ITEMS SECTION */}
      {relatedGears.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-zinc-950 dark:text-gray-100">
                  Related Equipment
                </h3>
                <p className="text-xs text-zinc-500 dark:text-gray-400">
                  More adventure gear in {categoryName}
                </p>
              </div>
              <Link
                href="/gear"
                className="text-xs font-bold text-[#2e5328] dark:text-[#5fa352] hover:underline"
              >
                View Catalog
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedGears.map((rel) => {
                const relId = rel.id || rel._id;
                const relImg = extractAllImages(rel)[0];
                return (
                  <Link
                    key={relId}
                    href={`/gear/${relId}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-zinc-200/80 dark:border-gray-700 p-3 space-y-2 hover:shadow-md transition block"
                  >
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-zinc-100 dark:bg-gray-700">
                      <Image
                        src={relImg}
                        alt={rel.title || "Related Gear"}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-gray-100 truncate">
                        {rel.title}
                      </h4>
                      <p className="text-xs font-extrabold text-[#2e5328] dark:text-[#5fa352]">
                        ৳ {Number(rel.pricePerDay ?? rel.price ?? 0).toLocaleString()} / day
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}