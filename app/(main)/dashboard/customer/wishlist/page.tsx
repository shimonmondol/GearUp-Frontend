"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  Heart,
  Trash2,
  ShoppingBag,
  Search,
  ArrowRight,
  Loader2,
  RefreshCw,
  Compass,
  X,
} from "lucide-react";

interface WishlistItem {
  _id?: string;
  id?: string;
  gearId?: string;
  gear?: {
    _id?: string;
    id?: string;
    name?: string;
    title?: string;
    category?: string;
    pricePerDay?: number;
    price?: number;
    rentalPrice?: number;
    images?: string[];
    image?: string;
  };
  title?: string;
  name?: string;
  category?: string;
  pricePerDay?: number;
  image?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80";

// Skeleton Loader Component for Wishlist Cards
function WishlistGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xs p-0 animate-pulse flex flex-col justify-between"
        >
          <div>
            <div className="aspect-16/10 w-full bg-zinc-200 dark:bg-gray-700" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-zinc-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-3/4 bg-zinc-200 dark:bg-gray-700 rounded" />
              <div className="h-3.5 w-24 bg-zinc-200 dark:bg-gray-700 rounded pt-1" />
            </div>
          </div>
          <div className="p-4 pt-0">
            <div className="h-9 w-full bg-zinc-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CustomerWishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // সার্ভার থেকে উইশলিস্ট ফেচ করা
  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      };

      let res;
      try {
        res = await api.get(`/api/wishlist?_t=${Date.now()}`, config);
      } catch (firstErr: any) {
        if (firstErr?.response?.status === 404 || firstErr?.response?.status === 405) {
          try {
            res = await api.get(`/api/wishlists/my-wishlist?_t=${Date.now()}`, config);
          } catch {
            res = { data: { data: [] } };
          }
        } else {
          res = { data: { data: [] } };
        }
      }

      const raw =
        res?.data?.data?.wishlist ||
        res?.data?.data?.items ||
        res?.data?.data ||
        res?.data?.wishlist ||
        res?.data?.result ||
        res?.data ||
        [];

      setWishlist(Array.isArray(raw) ? raw : []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // উইশলিস্ট থেকে আইটেম রিমুভ করা
  const handleRemove = async (itemId: string, gearId: string) => {
    const idToDelete = itemId || gearId;
    setActionLoadingId(idToDelete);

    try {
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      try {
        await api.delete(`/api/wishlist/${idToDelete}`, config);
      } catch (delErr: any) {
        if (delErr?.response?.status === 404 || delErr?.response?.status === 405) {
          await api.post("/api/wishlist/remove", { gearId: idToDelete }, config);
        } else {
          throw delErr;
        }
      }

      setWishlist((prev) =>
        prev.filter((item) => (item._id || item.id) !== itemId && item.gearId !== gearId)
      );
      toast.success("Gear removed from your wishlist!", { autoClose: 1500 });
    } catch {
      setWishlist((prev) =>
        prev.filter((item) => (item._id || item.id) !== itemId && item.gearId !== gearId)
      );
      toast.info("Item removed.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // সার্চ ফিল্টার লজিক
  const filteredWishlist = useMemo(() => {
    return wishlist.filter((item) => {
      const title = (
        item.title ||
        item.name ||
        item.gear?.title ||
        item.gear?.name ||
        ""
      ).toLowerCase();
      const cat = (item.category || item.gear?.category || "").toLowerCase();
      const query = searchTerm.toLowerCase();

      return title.includes(query) || cat.includes(query);
    });
  }, [wishlist, searchTerm]);

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-gray-700 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
            <span>My Wishlist</span>
            {!loading && wishlist.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#2e5328]/10 text-[#2e5328] dark:bg-[#5fa352]/20 dark:text-[#5fa352]">
                {wishlist.length}
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
            Keep track of gear and equipment you want to rent for upcoming trips.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchWishlist}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-gray-700 hover:bg-zinc-50 dark:hover:bg-gray-700/60 text-xs font-semibold text-zinc-700 dark:text-gray-300 transition cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh Wishlist"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/gear"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Gear</span>
          </Link>
        </div>
      </div>

      {/* 2. Search & Counter */}
      {wishlist.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search saved gear by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-8 pr-8 py-2 text-xs text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-200 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-gray-400">
            Showing <span className="font-bold text-zinc-800 dark:text-gray-200">{filteredWishlist.length}</span> saved items
          </p>
        </div>
      )}

      {/* 3. Wishlist Content */}
      {loading ? (
        <WishlistGridSkeleton count={6} />
      ) : filteredWishlist.length === 0 ? (
        <div className="bg-zinc-50/50 dark:bg-gray-800/50 border border-dashed border-zinc-200 dark:border-gray-700 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-gray-700 text-zinc-400 dark:text-gray-300 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 stroke-1" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-gray-200">
              {searchTerm ? "No saved items match your search" : "Your wishlist is empty"}
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {searchTerm
                ? "Try searching with another keyword or category."
                : "You haven't saved any gear to your wishlist yet. Explore equipment catalog and click the heart icon to save for later."}
            </p>
          </div>
          <Link
            href="/gear"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white text-xs font-bold transition shadow-xs"
          >
            <span>Explore Gear Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWishlist.map((item) => {
            const itemId = item._id || item.id || "";
            const targetGearId =
              item.gearId || item.gear?._id || item.gear?.id || itemId;
            const title =
              item.title ||
              item.name ||
              item.gear?.title ||
              item.gear?.name ||
              "Outdoor Equipment";
            const category = item.category || item.gear?.category || "General Gear";
            const price =
              item.pricePerDay ||
              item.gear?.pricePerDay ||
              item.gear?.price ||
              item.gear?.rentalPrice ||
              0;
            const imageSrc =
              item.image ||
              item.gear?.image ||
              (item.gear?.images && item.gear.images[0]) ||
              DEFAULT_IMAGE;

            const isDeleting = actionLoadingId === (itemId || targetGearId);

            return (
              <div
                key={itemId || targetGearId}
                className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xs hover:shadow-sm transition flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Delete Icon */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 dark:bg-gray-700">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleRemove(itemId, targetGearId)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition shadow-xs cursor-pointer disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Gear Details */}
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-gray-400">
                      {category}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-gray-100 truncate" title={title}>
                      {title}
                    </h3>
                    <p className="text-xs font-extrabold text-[#2e5328] dark:text-[#5fa352] pt-1">
                      ৳ {Number(price).toLocaleString()}{" "}
                      <span className="text-[10px] text-zinc-400 font-normal">/ day</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0">
                  <Link
                    href={`/gear/${targetGearId}`}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
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
    </div>
  );
}