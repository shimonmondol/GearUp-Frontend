import React from "react";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  ShieldCheck,
  Wallet,
  RefreshCw,
  Headphones,
} from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    desc: "Top gear, well maintained",
  },
  {
    icon: Wallet,
    title: "Affordable Rental",
    desc: "Pay less, adventure more",
  },
  {
    icon: RefreshCw,
    title: "Easy & Flexible",
    desc: "Rent, enjoy, return easy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "We're here for you anytime",
  },
];

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#eef4ec] to-[#fcfdfa] pt-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6 z-10">
            <div className="inline-flex items-center gap-1.5">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-950">
                GEAR
              </span>
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#477a3d]">
                UP
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
              Your <span className="text-[#3b663b]">Adventure</span> Awaits
            </h1>

            <p className="text-zinc-600 text-base sm:text-lg max-w-lg leading-relaxed">
              Rent premium sports and outdoor equipment for any adventure. Save
              money, travel light, and explore more.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="flex items-center gap-2 bg-[#3b663b] hover:bg-[#315531] text-white px-6 py-3.5 rounded-lg font-medium transition-all shadow-sm">
                <span>Browse Equipment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 px-6 py-3.5 rounded-lg font-medium transition-all shadow-sm">
                <Play className="w-4 h-4 text-[#3b663b] fill-[#3b663b]" />
                <span>How It Works</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-zinc-200/80">
              {badges.map((badge, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <badge.icon className="w-6 h-6 text-[#3b663b] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 leading-tight">
                      {badge.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-4/3 lg:aspect-5/4 rounded-2xl overflow-hidden shadow-2xl border-4 border-white ml-20">
              <Image
                src="/images/hero.png"
                alt="Hiker overlooking scenic mountain and lake view"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
