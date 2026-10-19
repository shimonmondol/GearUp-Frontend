import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Tent,
  Footprints,
  Bike,
  Waves,
} from "lucide-react";

const categories = [
  {
    title: "4 Person Camping Tent",
    desc: "Tents, Sleeping Bags & More",
    icon: Tent,
    img: "https://i.ibb.co.com/PsGVLnyx/campingtent.jpg",
  },
  {
    title: "Trekking Backpack 60L",
    desc: "Backpacks, Poles & More",
    icon: Footprints,
    img: "https://i.ibb.co.com/N6pFCxps/bag.jpg",
  },
  {
    title: "Mountain Bike",
    desc: "Bikes, Helmets & More",
    icon: Bike,
    img: "https://i.ibb.co.com/tp5c8hTn/bike.jpg",
  },
  {
    title: "Kayak Set",
    desc: "Kayaks, Life Jackets & More",
    icon: Waves,
    img: "https://i.ibb.co.com/3ybVJv5g/kayakset.jpg",
  },
];

export const Categories = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300 pt-10">
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-[#3b663b] dark:text-[#5fa352] tracking-wider uppercase">
            Popular Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Find the Perfect Gear for Your Next Adventure
          </h2>
        </div>

        {/* 4 Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-gray-800 border border-zinc-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md dark:hover:border-gray-600 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-gray-800">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-[#3b663b] text-white p-2 rounded-full shadow">
                  <cat.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base group-hover:text-[#3b663b] dark:group-hover:text-[#5fa352] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-zinc-500 dark:text-gray-300 text-xs">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/gear" className="flex items-center gap-2 bg-[#3b663b] hover:bg-[#315531] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer shadow-sm">
            <span>View All Gears</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};