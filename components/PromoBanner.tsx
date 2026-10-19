import React from "react";
import { Percent, Ticket } from "lucide-react";
import Image from "next/image";

export const PromoBanner = () => {
  return (
    <div className="bg-white dark:bg-gray-900 pt-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="relative bg-linear-to-r from-[#eff6ed] via-[#f5f9f3] to-[#e4eee1] dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden border border-[#d8e6d4] dark:border-gray-700 shadow-xs">
          {/* Left Content */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#e0ecd9] dark:bg-gray-700 rounded-2xl flex items-center justify-center text-[#3b663b] dark:text-[#5fa352] shrink-0 transition-colors">
              <Percent className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3b663b]/10 dark:bg-[#5fa352]/20 border border-[#3b663b]/20 dark:border-[#5fa352]/30 text-[10px] font-bold text-[#3b663b] dark:text-[#5fa352] uppercase tracking-wider">
                First 10 Customers Only
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                Early Bird Advantage: Flat 10% OFF
              </h3>
              <p className="text-zinc-600 dark:text-gray-300 text-xs sm:text-sm">
                Apply coupon on your first rental order. Fast fingers
                win—limited to the first 10 adventurers!
              </p>
            </div>
          </div>

          {/* Right Content & Coupon Box */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center md:items-end">
              <span className="text-xs uppercase font-semibold text-zinc-500 dark:text-gray-400">
                Special Offer
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#3b663b] dark:text-[#5fa352]">
                10% OFF
              </div>

              {/* Coupon Code Pill */}
              <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-md border border-dashed border-[#3b663b] dark:border-[#5fa352] bg-white/70 dark:bg-gray-900/60 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                <Ticket className="w-3.5 h-3.5 text-[#3b663b] dark:text-[#5fa352]" />
                <span>FIRST10</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
