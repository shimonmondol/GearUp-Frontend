import React from 'react';
import { Send } from 'lucide-react';

export const Newsletter = () => {
  return (
    <section className="bg-[#eef3eb] py-10 border-b border-zinc-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#3b663b] text-white flex items-center justify-center shrink-0">
            <Send className="w-5 h-5 -ml-0.5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-base">Stay Updated for New Adventures</h3>
            <p className="text-xs text-zinc-500">Subscribe to get special offers, new gear alerts, and adventure tips.</p>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#3b663b] w-full md:w-72" 
          />
          <button className="bg-[#3b663b] hover:bg-[#315531] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};