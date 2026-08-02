import React from "react";
import Link from "next/link";

const Homepage = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4 py-16">
      {/* Badge / Announcement */}
      <div className="inline-flex items-center gap-2 p-1.5 pr-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mt-12">
        <span className="bg-[#545BF8] border border-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
          New
        </span>
        <p className="text-xs text-gray-200">Built your order rental platfrom</p>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl lg:text-6xl text-center font-bold max-w-4xl mt-6 bg-linear-to-r from-[#858AFF] via-indigo-200 to-white text-transparent bg-clip-text leading-tight">
        GearUp is a application for sports and outdoor equipment rental service.
      </h1>
      <p className="text-slate-300 text-sm md:text-base text-center max-w-lg mt-4 leading-relaxed">
        Rent top-quality sports and outdoor equipment on demand. Choose your
        rental dates, complete secure payments, and get ready for your next
        adventure without the high cost of buying gear.
      </p>
    </section>
  );
};

export default Homepage;
