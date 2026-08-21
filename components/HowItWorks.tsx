import React from 'react';
import { Search, CalendarCheck, PackageCheck } from 'lucide-react';

const steps = [
  {
    num: 1,
    title: "Choose Gear",
    desc: "Browse and select the equipment you need.",
    icon: Search
  },
  {
    num: 2,
    title: "Book & Rent",
    desc: "Pick your dates and place your order.",
    icon: CalendarCheck
  },
  {
    num: 3,
    title: "Enjoy Adventure",
    desc: "We deliver. You enjoy. Return it when done.",
    icon: PackageCheck
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span className="text-xs font-bold text-[#3b663b] tracking-wider uppercase">How It Works</span>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 relative">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-3">
            <div className="relative w-16 h-16 rounded-full bg-[#edf4eb] border border-[#d6e7d2] flex items-center justify-center text-[#3b663b]">
              <step.icon className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 bg-[#3b663b] text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {step.num}
              </span>
            </div>
            <h4 className="font-bold text-zinc-900 text-base">{step.title}</h4>
            <p className="text-zinc-500 text-xs max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};