"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  Plus,
  Minus,
  ArrowRight,
  Navigation,
} from "lucide-react";

const contactCards = [
  {
    icon: Phone,
    title: "Call Us",
    primary: "+8801738-007334",
    secondary: "Sat – Thu, 9AM – 6PM",
  },
  {
    icon: Mail,
    title: "Email Us",
    primary: "hello@gearup.com",
    secondary: "We'll reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    primary: "House 12, Road 5",
    secondary: "Banasree, Dhaka-1205, Bangladesh",
  },
  {
    icon: Clock,
    title: "Business Hours",
    primary: "Sun – Thu: 9AM – 6PM",
    secondary: "Friday, Saturday: Closed",
  },
];

const faqs = [
  {
    id: 1,
    question: "How can I place an order?",
    answer:
      'Browse our collection, select your desired gear, choose your rental dates, and click "Rent Now" to proceed through our secure checkout.',
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept VISA, Mastercard, bKash, Nagad, Rocket, and American Express cards for all bookings.",
  },
  {
    id: 3,
    question: "How long does delivery take?",
    answer:
      "Inside Dhaka, delivery typically takes 4–6 hours. For locations outside Dhaka, delivery takes 24–48 hours before your booking start date.",
  },
  {
    id: 4,
    question: "Can I return or exchange a product?",
    answer:
      "Yes, you can request an exchange or cancel up to 24 hours prior to the scheduled delivery date with zero penalty fees.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased selection:bg-[#285724] selection:text-white">
      {/* 2. HERO BANNER */}
      <section className="relative bg-linear-to-b from-[#eaf2e8] to-[#f9fbf8] pt-10 pb-8 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden min-h-60 flex flex-col justify-center px-6 sm:px-12 py-8 text-zinc-900 bg-cover bg-right shadow-sm"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-white/80 sm:bg-white/65 backdrop-blur-[1.5px]" />

            <div className="relative z-10 max-w-xl space-y-2.5">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950">
                Contact <span className="text-[#285724]">Us</span>
              </h1>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                We'd love to hear from you! Get in touch with our team for any
                questions, support or partnership opportunities.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 pt-2">
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-zinc-800"
                >
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-zinc-900 font-semibold">Contact</span>
              </div>
            </div>
          </div>

          {/* Contact Highlight Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {contactCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-[#eff6ed] border border-[#ddead9] p-4 rounded-2xl flex items-start gap-3.5 shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-[#d8ecd3] flex items-center justify-center text-[#285724] shrink-0">
                  <card.icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-zinc-500">
                    {card.title}
                  </span>
                  <h4 className="text-xs font-bold text-zinc-900">
                    {card.primary}
                  </h4>
                  <p className="text-[10px] text-zinc-600 leading-tight">
                    {card.secondary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SEND US A MESSAGE & FIND US (MAP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-6 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-zinc-900">
                Send Us a <span className="text-[#285724]">Message</span>
              </h2>
              <p className="text-sm text-zinc-500">
                Have a question, suggestion or need support? Fill out the form
                below and we'll get back to you soon.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#fbfdfb] border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#fbfdfb] border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full bg-[#fbfdfb] border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-[#fbfdfb] border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#285724] hover:bg-[#1f441c] text-white py-3 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Right Map Preview */}
          <div className="lg:col-span-6 bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between space-y-6">
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                Find Us Here
              </h3>
              <p className="text-slate-600 text-sm sm:text-sm leading-relaxed">
                We are located in the heart of Dhaka. Easy to reach and always
                ready to welcome you.
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 hover:border-amber-400 bg-white rounded-xl text-xs font-bold text-slate-800 shadow-sm hover:text-amber-600 transition-all"
              >
                <Navigation className="w-4 h-4 text-amber-500" />
                Get Directions
              </a>
            </div>
            {/* Simulated Clean Vector Map View */}
            <div className="lg:col-span-8 relative h-64 sm:h-72 bg-slate-100 rounded-2xl overflow-hidden border border-gray-100">
              <iframe
                title="GearUP Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14606.070806497217!2d90.42194605000001!3d23.764506300000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7892d32691b%3A0x8e836113b2d1c681!2sBanasree%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#eff5ed] border border-[#dfead9] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#285724] text-white flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#285724]">
                  Frequently Asked Questions
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">
                  Need Help?
                </h3>
                <p className="text-xs text-zinc-500 max-w-xl">
                  Find answers to the most common questions below. Still can't
                  find what you need? Feel free to reach out to us directly.
                </p>
              </div>
            </div>
            <Link
              href="/faqs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#285724] border border-[#285724]/30 bg-white/70 hover:bg-white px-4 py-2 rounded-xl transition self-start sm:self-auto shrink-0"
            >
              <span>View All FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-2xs transition"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-zinc-900 focus:outline-none cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {openFaq === faq.id ? (
                    <Minus className="w-4 h-4 text-[#285724] shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>

                {openFaq === faq.id && (
                  <p className="text-[11px] text-zinc-500 mt-2.5 pt-2.5 border-t border-zinc-100 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER */}
      <section className="bg-[#eef3eb] py-10 border-b border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#285724] text-white flex items-center justify-center shrink-0">
              <Send className="w-5 h-5 -ml-0.5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base">
                Stay Updated for New Adventures
              </h3>
              <p className="text-xs text-zinc-500">
                Subscribe to get special offers, new gear alerts, and adventure
                tips.
              </p>
            </div>
          </div>

          <div className="flex w-full md:w-auto items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#285724] w-full md:w-72"
            />
            <button className="bg-[#285724] hover:bg-[#1f441c] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition whitespace-nowrap cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      <footer />
    </div>
  );
}
