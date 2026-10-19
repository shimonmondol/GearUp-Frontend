import React from "react";
import { ShieldCheck, Wallet, RefreshCw, Headphones } from "lucide-react";

export const Features = () => {
  const items = [
    {
      icon: ShieldCheck,
      title: "Verified Quality",
      desc: "Rigorous safety inspection after every rental trip.",
    },
    {
      icon: Wallet,
      title: "Zero Purchase Cost",
      desc: "Pay only for the exact days you actually adventure.",
    },
    {
      icon: RefreshCw,
      title: "Flexible Returns",
      desc: "Doorstep drop-off and easy scheduling extension.",
    },
    {
      icon: Headphones,
      title: "24/7 Field Support",
      desc: "Instant gear assistance anytime on your trail.",
    },
  ];

  return (
    <section className=" bg-white dark:bg-gray-900 transition-colors duration-300 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <div className="p-2.5 rounded-xl bg-[#3b663b]/10 text-[#3b663b] dark:bg-[#5fa352]/15 dark:text-[#5fa352] shrink-0 mt-0.5">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};