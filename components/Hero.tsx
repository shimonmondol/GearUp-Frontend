import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Wallet,
  RefreshCw,
  Headphones,
} from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6 z-10">
            <div className="inline-flex items-center gap-1.5">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#477a3d] dark:text-[#5fa352]">
                GEARUP
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Your{" "}
              <span className="text-[#3b663b] dark:text-[#5fa352]">
                Adventure
              </span>{" "}
              Awaits
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-lg leading-relaxed">
              GearUp is a sports equipment rental platform built a seamless booking lifecycle secured by role-based authentication, allowing users to easily browse, rent, and manage sporting gear.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/gear" className="flex items-center gap-2 bg-[#3b663b] hover:bg-[#315531] text-white px-6 py-3.5 rounded-lg font-medium transition-all shadow-sm cursor-pointer">
                <span>Browse Gear</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-zinc-200 dark:hover:bg-gray-950 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-6 py-3.5 rounded-lg font-medium transition-all shadow-sm cursor-pointer">
                <span>About Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-4/3 lg:aspect-5/4 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 ml-0 lg:ml-20">
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