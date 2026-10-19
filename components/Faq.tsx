"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export const Faq = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is required to rent equipment from GearUp?",
      a: "A valid National ID card / Passport and active phone number verification. For high-value electronics or bikes, a refundable security deposit is held until return.",
    },
    {
      q: "How does the rental duration and billing cycle work?",
      a: "Rental days are counted per 24-hour block from the scheduled pickup date to the return date. Partial delays can be extended easily from your customer dashboard.",
    },
    {
      q: "What happens if gear gets accidentally damaged during a trip?",
      a: "Normal wear and minor dirt are completely covered by our complimentary cleaning guarantee. For structural damage, our transparent replacement policy only charges repair costs.",
    },
    {
      q: "Can I cancel or reschedule my booking?",
      a: "Yes! Free cancellation is supported up to 24 hours prior to the scheduled rental dispatch time with 100% refund.",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#3b663b]/10 dark:bg-[#5fa352]/15 border border-[#3b663b]/20 dark:border-[#5fa352]/30">
            <span className="text-[10px] font-bold text-[#3b663b] dark:text-[#5fa352] uppercase tracking-wider">
              Got Questions?
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Frequently Asked{" "}
            <span className="text-[#3b663b] dark:text-[#5fa352]">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            Everything you need to know about our outdoor gear rental process.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden self-start h-full flex flex-col justify-between border transition-all duration-300 ${
                  isOpen
                    ? "bg-linear-to-r from-[#eff6ed] via-[#f5f9f3] to-[#e4eee1] dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 border-[#3b663b] dark:border-[#5fa352] shadow-xs"
                    : "bg-[#f9fcf8] dark:bg-gray-800/50 border-[#d8e6d4] dark:border-gray-700 hover:border-[#3b663b]/50 dark:hover:border-gray-600"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-start justify-between p-5 text-left text-xs sm:text-sm font-bold text-zinc-900 dark:text-white cursor-pointer gap-2"
                >
                  <span className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isOpen
                          ? "bg-[#e0ecd9] dark:bg-gray-700 text-[#3b663b] dark:text-[#5fa352]"
                          : "bg-[#eef5eb] dark:bg-gray-700/60 text-zinc-500 dark:text-gray-400"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="pt-0.5">{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 mt-1.5 transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 text-[#3b663b] dark:text-[#5fa352]"
                        : "text-zinc-400 dark:text-gray-400"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-600 dark:text-gray-300 leading-relaxed border-t border-[#d8e6d4]/70 dark:border-gray-700/80 pt-3.5 flex-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};