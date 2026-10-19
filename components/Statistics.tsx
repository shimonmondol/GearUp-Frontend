import React from "react";

export const Statistics = () => {
  const stats = [
    { val: "12,500+", label: "Expeditions Supported" },
    { val: "850+", label: "Verified Gear Units" },
    { val: "99.2%", label: "Positive Renter Rating" },
    { val: "৳ 4.5M+", label: "Renter Savings Generated" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl bg-linear-to-r from-[#eff6ed] via-[#f5f9f3] to-[#e4eee1] dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 border border-[#d8e6d4] dark:border-gray-700 shadow-xs hover:border-[#3b663b] dark:hover:border-[#5fa352] transition-all duration-300 space-y-1.5"
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#3b663b] dark:text-[#5fa352]">
                {stat.val}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-gray-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};