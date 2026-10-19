import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    name: "Shimon Kumar Mondol",
    location: "Dhaka, Bangladesh",
    review: "Great quality gear and super easy process. Made our camping trip amazing!"
  },
  {
    name: "Rafat Choudhury",
    location: "Chattogram, Bangladesh",
    review: "Saved so much money and didn't have to carry heavy equipment while traveling."
  },
  {
    name: "Sharmin Islam",
    location: "Rajshahi, Bangladesh",
    review: "The bike was in perfect condition. Support team was really helpful and friendly."
  }
];

export const Testimonials = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="text-center mb-10 space-y-1">
          <span className="text-xs font-bold text-[#2e5328] dark:text-[#5fa352] tracking-wider uppercase">
            What Adventurers Say
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
            Real Feedback from Real Renters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => {
            const initial = item.name.charAt(0);

            return (
              <div
                key={idx}
                className="relative bg-zinc-50/60 dark:bg-gray-800 border border-zinc-200/80 dark:border-zinc-700/80 p-6 rounded-2xl shadow-xs space-y-4 transition-all duration-300 hover:border-[#2e5328] dark:hover:border-[#5fa352]"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-zinc-200 dark:text-zinc-700/50" />
                
                <div className="flex items-center gap-3">
                  {/* লেটার বেসড মিনিমালিস্ট অ্যাভাটার */}
                  <div className="w-11 h-11 rounded-xl bg-[#2e5328]/10 dark:bg-[#3b663b]/25 border border-[#2e5328]/20 dark:border-[#5fa352]/30 flex items-center justify-center text-[#2e5328] dark:text-[#5fa352] font-black text-base shrink-0 select-none">
                    {initial}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                        {item.name}
                      </h4>
                      
                    </div>
                    <div className="flex text-amber-400 gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed italic">
                  "{item.review}"
                </p>

                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{item.location}</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Verified Rental</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};