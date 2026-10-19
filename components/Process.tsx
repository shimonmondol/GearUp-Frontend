import React from "react";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const Process = () => {
  const steps = [
    {
      step: "01",
      title: "Select Your Gear",
      desc: "Browse hundreds of clean, tested sports & camping items.",
    },
    {
      step: "02",
      title: "Choose Dates",
      desc: "Select rental duration with real-time transparent pricing.",
    },
    {
      step: "03",
      title: "Pick Up or Delivery",
      desc: "Collect from local dispatch hubs or choose direct doorstep delivery.",
    },
    {
      step: "04",
      title: "Return with Ease",
      desc: "Drop off or request doorstep pickup once your trip ends.",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#3b663b]/10 dark:bg-[#5fa352]/15 border border-[#3b663b]/20 dark:border-[#5fa352]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#3b663b] dark:text-[#5fa352]" />
            <span className="text-[10px] font-bold text-[#3b663b] dark:text-[#5fa352] uppercase tracking-wider">
              Simple 4-Step Process
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            How GearUp Rental{" "}
            <span className="text-[#3b663b] dark:text-[#5fa352]">Works</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-gray-300">
            Getting premium outdoor equipment has never been this seamless and straightforward.
          </p>
        </div>

        {/* 50% - 50% Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Side: 50% Adventure Equipment Image */}
          <div className="w-full relative min-h-[380px] lg:min-h-full rounded-2xl overflow-hidden border border-[#d8e6d4] dark:border-gray-700 shadow-xs group">
            <Image
              src="https://i.ibb.co.com/KcgBCKB0/work.jpg"
              alt="Outdoor gear preparation"
              fill
              unoptimized
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {/* Subtle Gradient & Floating Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#3b663b]/90 text-white backdrop-blur-xs inline-block">
                Ready for Trail
              </span>
              <p className="text-base sm:text-lg font-extrabold leading-snug">
                Fully inspected, cleaned & sanitized before every handoff.
              </p>
              <Link
                href="/gear"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5fa352] hover:underline pt-1"
              >
                <span>Browse Available Gear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Side: 50% (2 Rows & 2 Columns Grid) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((item, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-linear-to-r from-[#eff6ed] via-[#f5f9f3] to-[#e4eee1] dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 border border-[#d8e6d4] dark:border-gray-700 hover:border-[#3b663b] dark:hover:border-[#5fa352] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-[#3b663b]/30 dark:text-[#5fa352]/30 group-hover:text-[#3b663b] dark:group-hover:text-[#5fa352] transition-colors block mb-2 font-mono">
                    {item.step}
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white group-hover:text-[#3b663b] dark:group-hover:text-[#5fa352] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#d8e6d4]/70 dark:border-gray-700/80 flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-gray-400 group-hover:text-[#3b663b] dark:group-hover:text-[#5fa352] transition-colors">
                  <span>Step {i + 1} of 4</span>
                  <span className="text-xs">➔</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};