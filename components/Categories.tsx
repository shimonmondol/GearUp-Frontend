import React from 'react';
import { ArrowRight, Tent, Footprints, Bike, Waves, Snowflake } from 'lucide-react';

const categories = [
  {
    title: "Camping",
    desc: "Tents, Sleeping Bags & More",
    icon: Tent,
    img: "/images/campingtent.jpg"
  },
  {
    title: "Fitness",
    desc: "Backpacks, Poles & More",
    icon: Footprints,
    img: "/images/gym.jpg"
  },
  {
    title: "Cycling",
    desc: "Bikes, Helmets & More",
    icon: Bike,
    img: "/images/bike.jpg"
  },
  {
    title: "Water Sports",
    desc: "Kayaks, Life Jackets & More",
    icon: Waves,
    img: "/images/kayakset.jpg"
  },
  {
    title: "Winter Sports",
    desc: "Skis, Snowboards & More",
    icon: Snowflake,
    img: "/images/skiset.jpg"
  }
];

export const Categories = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-bold text-[#3b663b] tracking-wider uppercase">Popular Categories</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">Find the Perfect Gear for Your Next Adventure</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="group relative bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative h-44 w-full overflow-hidden">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute bottom-2 left-2 bg-[#3b663b] text-white p-2 rounded-full shadow">
                <cat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-zinc-900 text-sm">{cat.title}</h3>
              <p className="text-zinc-500 text-xs">{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="flex items-center gap-2 bg-[#3b663b] hover:bg-[#315531] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition">
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};