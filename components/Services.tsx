import React from "react";
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Compass, 
  Sparkles,
} from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: ShieldCheck,
      badge: "Quality & Safety",
      title: "Field-Tested Gear Inspection",
      desc: "Every tent, mountain bike, and camp kit is mechanically tested, cleaned, and UV-sanitized before every dispatch.",
    },
    {
      icon: Truck,
      badge: "Convenience",
      title: "Doorstep & Hub Dispatch",
      desc: "Collect equipment from our central pickup hubs or get everything delivered directly to your doorstep before departure.",
    },
    {
      icon: RotateCcw,
      badge: "Flexibility",
      title: "Easy Extend & Transparent Return",
      desc: "Running late on the trail? Extend your rental days directly from your customer dashboard with zero hidden penalties.",
    },
    {
      icon: Compass,
      badge: "Adventure Guide",
      title: "Expert Expedition Consultation",
      desc: "Not sure what size tent or backpack you need? Our outdoor specialists help match the exact gear for your destination.",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#3b663b]/10 dark:bg-[#5fa352]/15 border border-[#3b663b]/20 dark:border-[#5fa352]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#3b663b] dark:text-[#5fa352]" />
              <span className="text-[10px] font-bold text-[#3b663b] dark:text-[#5fa352] uppercase tracking-wider">
                GearUp Services
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Rent Smarter,{" "}
              <span className="text-[#3b663b] dark:text-[#5fa352]">
                Adventure Harder
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-gray-300 max-w-xl leading-relaxed">
              We eliminate expensive upfront equipment purchases so you can access pro-tier outdoor and sports gear whenever you need it.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-2xl bg-linear-to-r from-[#eff6ed] via-[#f5f9f3] to-[#e4eee1] dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800 border border-[#d8e6d4] dark:border-gray-700 hover:border-[#3b663b] dark:hover:border-[#5fa352] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#e0ecd9] dark:bg-gray-700 text-[#3b663b] dark:text-[#5fa352] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <item.icon className="w-6 h-6" />
                </div>

                {/* Text Information */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-gray-400 uppercase tracking-wider block">
                    {item.badge}
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white group-hover:text-[#3b663b] dark:group-hover:text-[#5fa352] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-gray-300 leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Subtle Bar */}
              <div className="mt-6 pt-3 border-t border-[#d8e6d4]/70 dark:border-gray-700/80 flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-gray-400 group-hover:text-[#3b663b] dark:group-hover:text-[#5fa352] transition-colors">
                <span>Included with booking</span>
                <span className="text-sm">✓</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};