import React from "react";
import { Percent } from "lucide-react";
import Image from "next/image";

export const PromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="relative bg-linear-to-r from-[#eff6ed] via-[#f5f9f3] to-[#e4eee1] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden border border-[#d8e6d4]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#e0ecd9] rounded-2xl flex items-center justify-center text-[#3b663b] shrink-0">
            <Percent className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
              Adventure More, Spend Less
            </h3>
            <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
              High-quality gear at affordable prices. Because memories are
              priceless!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center md:text-right">
            <span className="text-xs uppercase font-medium text-zinc-500">
              Up to
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#3b663b]">
              30% OFF
            </div>
            <span className="text-xs text-zinc-600 font-medium">
              on First Rental
            </span>
          </div>
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-md hidden sm:block shrink-0">
            <Image
              src="/images/bag.jpg"
              alt="Backpack gear promo"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
