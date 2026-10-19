"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Rocket,
  Eye,
  Gem,
  Award,
  Compass,
  ArrowRight,
  CheckCircle2,
  Plus,
  Minus,
} from "lucide-react";

const highlightCards = [
  {
    icon: Rocket,
    title: "Our Mission",
    primary: "Accessible Outdoors",
    secondary: "To make gear rental affordable & hassle-free for everyone.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    primary: "Top Trusted Platform",
    secondary: "The go-to rental marketplace for adventure lovers.",
  },
  {
    icon: Gem,
    title: "Our Values",
    primary: "Safety & Sustainability",
    secondary: "Committed to eco-friendly gear & trusted community.",
  },
  {
    icon: Award,
    title: "Quality First",
    primary: "100% Verified Gear",
    secondary: "Thoroughly tested and cleaned before every booking.",
  },
];

// 3. Why Choose Us / Guarantees Accordion
const whyChooseUs = [
  {
    id: 1,
    question: "Why should I rent instead of buying?",
    answer:
      "Quality camping and hiking gear is expensive and takes up storage space for items only used a few times a year. Renting with GearUp saves up to 80% on upfront costs and ensures you always get professional-grade, well-maintained equipment.",
  },
  {
    id: 2,
    question: "How do you inspect and sanitize equipment?",
    answer:
      "Every single piece of equipment goes through a 3-step safety check: physical structural verification, hospital-grade cleaning/sanitization, and safe waterproof packaging before reaching your door.",
  },
  {
    id: 3,
    question: "What happens if gear gets damaged accidentally?",
    answer:
      "We understand that accidents happen on rough terrain. We offer an optional micro-insurance protection plan at checkout that covers regular trail wear-and-tear.",
  },
  {
    id: 4,
    question: "Do you deliver gear anywhere in Bangladesh?",
    answer:
      "Yes! We deliver across all major cities and divisional headquarters, as well as pick-up lockers positioned near popular outdoor transit hubs in Dhaka.",
  },
];

export default function AboutPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfa] dark:bg-gray-900 text-zinc-900 dark:text-gray-100 font-sans antialiased selection:bg-[#285724] selection:text-white transition-colors duration-300">
      
      {/* 1. HERO BANNER & BREADCRUMB */}
      <section className="relative bg-linear-to-b from-[#eaf2e8] to-[#f9fbf8] dark:bg-none dark:bg-gray-900 pt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl overflow-hidden min-h-60 flex flex-col justify-center px-6 sm:px-10 py-8 bg-cover bg-right mt-9 border border-zinc-200/50 dark:border-gray-800"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-950/85 sm:bg-white/65 sm:dark:bg-gray-950/80 backdrop-blur-[1.5px] transition-colors duration-300" />

            <div className="relative z-10 max-w-xl space-y-2.5">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-gray-50">
                About <span className="text-[#285724] dark:text-[#5fa352]">Us</span>
              </h1>
              <p className="text-zinc-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                Your trusted outdoor partner. We empower explorers by making premium
                camping, hiking, and travel gear accessible, affordable, and hassle-free.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-gray-400 pt-2">
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-zinc-800 dark:hover:text-gray-200 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-zinc-900 dark:text-gray-100 font-semibold">About Us</span>
              </div>
            </div>
          </div>

          {/* Core Pillars Quick Cards (Matches Contact Quick Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {highlightCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-[#eff6ed] dark:bg-gray-800 border border-[#ddead9] dark:border-gray-700 p-4 rounded-2xl flex items-start gap-3.5 shadow-xs transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-[#d8ecd3] dark:bg-gray-700 flex items-center justify-center text-[#285724] dark:text-[#5fa352] shrink-0">
                  <card.icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-gray-400">
                    {card.title}
                  </span>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-gray-100">
                    {card.primary}
                  </h4>
                  <p className="text-[10px] text-zinc-600 dark:text-gray-400 leading-tight">
                    {card.secondary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. OUR STORY & VISUAL SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Our Story Card */}
          <div className="lg:col-span-6 bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between space-y-6 transition-colors duration-300">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#285724] dark:text-[#5fa352]">
                Our Journey
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-gray-100">
                How GearUp <span className="text-[#285724] dark:text-[#5fa352]">Began</span>
              </h2>
              <div className="space-y-3.5 text-zinc-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                <p>
                  GearUp was founded with a single, clear objective: to ensure that budget, 
                  gear storage, or high retail markups never prevent anyone from experiencing 
                  nature's best trails.
                </p>
                <p>
                  We noticed adventurers struggling between cheap, unreliable equipment 
                  or paying thousands for gear used only once or twice a year. We built GearUp 
                  to bridge this gap — providing certified top-tier trekking, camping, and watersport 
                  kits at daily rental rates.
                </p>
              </div>

              {/* Bullet checklist highlights */}
              <div className="space-y-2 pt-2">
                {[
                  "Verified, inspected, and trail-tested outdoor gear",
                  "Flexible daily & weekly rates with simple security deposits",
                  "Same-day doorstep delivery & pickup service within Dhaka",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#285724] dark:text-[#5fa352] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/gear"
                className="inline-flex items-center gap-2 bg-[#285724] hover:bg-[#1f441c] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white px-5 py-3 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition"
              >
                <span>Explore Available Gear</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Adventure Polaroid Stack & Image Showcase */}
          <div className="lg:col-span-6 bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between space-y-6 transition-colors duration-300">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-gray-100">
                Explore. Rent. Repeat.
              </h3>
              <p className="text-zinc-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                From high-altitude mountain trekking to lakeside weekend campouts, 
                our curated inventory is tailored to make every escape seamless.
              </p>
            </div>

            {/* Visual Grid Gallery */}
            <div className="grid grid-cols-2 gap-3.5 h-64 sm:h-72">
              <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-gray-700 relative group">
                <img
                  src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
                  alt="Camping Tent"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">
                  Camping Kit
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-gray-700 relative group">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80"
                  alt="Kayaking & Water Gear"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">
                  Kayaks & Water Gear
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* 4. ACCORDION / WHY TRUST US (Matches Contact FAQ section style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm transition-colors duration-300">
          
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#d8ecd3] dark:bg-gray-700 text-[#285724] dark:text-[#5fa352] flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#285724] dark:text-[#5fa352]">
                Reliability & Trust
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-gray-100">
                Why Adventurers Choose Us
              </h3>
              <p className="text-xs text-zinc-500 dark:text-gray-400 max-w-xl">
                Get to know our commitment to quality, cleanliness, and outdoor safety before you pack your bags.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {whyChooseUs.map((item) => (
              <div
                key={item.id}
                className="bg-[#fbfdfb] dark:bg-gray-900 border border-zinc-200/80 dark:border-gray-700 rounded-2xl p-4 shadow-2xs transition-colors duration-300"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-zinc-900 dark:text-gray-100 focus:outline-none cursor-pointer"
                >
                  <span>{item.question}</span>
                  {openAccordion === item.id ? (
                    <Minus className="w-4 h-4 text-[#285724] dark:text-[#5fa352] shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-zinc-400 dark:text-gray-400 shrink-0" />
                  )}
                </button>

                {openAccordion === item.id && (
                  <p className="text-[11px] text-zinc-500 dark:text-gray-300 mt-2.5 pt-2.5 border-t border-zinc-200/60 dark:border-gray-800 leading-relaxed">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}