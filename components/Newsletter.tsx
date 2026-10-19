"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    toast.success("Welcome aboard! 15% discount code sent to your email.");
    setEmail("");
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300 pt-6 pb-8">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
        <div className="relative bg-linear-to-r from-[#eff6ed] via-[#f5f9f3] to-[#e4eee1] dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden border border-[#d8e6d4] dark:border-gray-700 shadow-xs transition-colors">
          {/* Left Side: Icon, Badge, Title & Copy */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#e0ecd9] dark:bg-gray-700 rounded-2xl flex items-center justify-center text-[#3b663b] dark:text-[#5fa352] shrink-0 transition-colors">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3b663b]/10 dark:bg-[#5fa352]/15 text-[#3b663b] dark:text-[#5fa352] text-[10px] font-bold uppercase tracking-wider">
                Special Welcome Offer
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Ready to Plan Your Next{" "}
                <span className="text-[#3b663b] dark:text-[#5fa352]">
                  Adventure?
                </span>
              </h3>
              <p className="text-zinc-600 dark:text-gray-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Join 20,000+ outdoor explorers. Get 15% off your first gear rental
                and receive trail updates directly to your inbox.
              </p>
            </div>
          </div>

          {/* Right Side: Email Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full md:w-auto items-center gap-2 shrink-0"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="bg-white dark:bg-gray-900 border border-[#d8e6d4] dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#3b663b] dark:focus:ring-[#5fa352] w-full md:w-80 shadow-2xs transition-colors"
            />
            <button
              type="submit"
              className="bg-[#3b663b] hover:bg-[#315531] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer shadow-xs inline-flex items-center gap-1.5 shrink-0"
            >
              <span>Get Discount</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};