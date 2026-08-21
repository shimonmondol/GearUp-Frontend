import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Rafiq Hasan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    review: "Great quality gear and super easy process. Made our camping trip amazing!"
  },
  {
    name: "Nusrat Jahan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    review: "Saved so much money and didn't have to carry heavy equipment while traveling."
  },
  {
    name: "Ariful Islam",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    review: "The bike was in perfect condition. Support team was really helpful and friendly."
  }
];

export const Testimonials = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-[#3b663b] tracking-wider uppercase">What Adventurers Say</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, idx) => (
          <div key={idx} className="relative bg-white border border-zinc-100 p-6 rounded-2xl shadow-sm space-y-4">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-zinc-200" />
            <div className="flex items-center gap-3">
              <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover border border-zinc-200" />
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">{item.name}</h4>
                <div className="flex text-amber-400 gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed italic">"{item.review}"</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-1.5 mt-8">
        <span className="w-2 h-2 rounded-full bg-[#3b663b]"></span>
        <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
        <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
        <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
      </div>
    </section>
  );
};