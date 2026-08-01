import React from "react";
import Link from "next/link";

const Homepage = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4 py-16">
      {/* Badge / Announcement */}
      <div className="inline-flex items-center gap-2 p-1.5 pr-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
        <span className="bg-[#545BF8] border border-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
          New
        </span>
        <p className="text-xs text-gray-200">Built your order rental platfrom</p>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold max-w-4xl mt-6 bg-linear-to-r from-[#858AFF] via-indigo-200 to-white text-transparent bg-clip-text leading-tight">
        GearUp is a modern equipment rental platform
      </h1>

      {/* Subtitle */}
      <p className="text-slate-300 text-sm md:text-base text-center max-w-lg mt-4 leading-relaxed">
        Rent top-quality sports and outdoor equipment on demand. Choose your
        rental dates, complete secure payments, and get ready for your next
        adventure without the high cost of buying gear.
      </p>

      {/* Call to Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 text-sm">
        <Link
          href="/signup"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full transition-all cursor-pointer shadow-lg shadow-indigo-500/25 active:scale-95"
        >
          Get started for free
        </Link>

        <Link
          href="/templates"
          className="p-px rounded-full bg-linear-to-r from-white/80 to-white/20 inline-block transition-all hover:scale-105 active:scale-95"
        >
          <div className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-full transition cursor-pointer">
            Explore template
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Homepage;
