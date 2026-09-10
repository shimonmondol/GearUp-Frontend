import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-[#0b140e] text-zinc-300 pt-16 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-zinc-800">
        {/* Brand & Social */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight text-white">
              GEARUP
            </span>
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Your trusted partner for sports and outdoor equipment rental. Gear
            up. Adventure more.
          </p>
          <div className="flex items-center gap-3 text-zinc-400">
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-[#3b663b] flex items-center justify-center transition text-white"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-[#3b663b] flex items-center justify-center transition text-white"
            >
              <FaInstagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-[#3b663b] flex items-center justify-center transition text-white"
            >
              <FaYoutube className="w-3.5 h-3.5" />
            </a>
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-[#3b663b] flex items-center justify-center transition text-white"
            >
              <FaTwitter className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
            Quick Links
          </h4>
          <ul className="space-y-2 text-zinc-400">
            <li>
              <a href="#" className="hover:text-white transition">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Browse Equipment
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Categories
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
            Customer Service
          </h4>
          <ul className="space-y-2 text-zinc-400">
            <li>
              <a href="#" className="hover:text-white transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Delivery & Pickup
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
            Contact Us
          </h4>
          <div className="space-y-2 text-zinc-400">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#8ec584]" />
              <span>+8801738-007334</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#8ec584]" />
              <span>hello@gearup.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#8ec584] shrink-0 mt-0.5" />
              <span>
                House 12, Road 5<br />
                Banasree, Dhaka 1205
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
            We Accept
          </h4>
          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            {/* VISA */}
            <h1 className="mr-4">Payment</h1>
            <Image
              src="/images/visa.png"
              alt="Visa Payment"
              width={32}
              height={32}
              className="object-contain"
            />
            {/* bKash */}
            <Image
              src="/images/bkash.png"
              alt="bKash logo"
              width={120}
              height={60}
              className="w-10 h-auto"
            />
            {/* Nagad */}
            <Image
              src="/images/nagad.png"
              alt="Nagad Payment"
              width={32}
              height={32}
              className="object-contain"
            />
            {/* Rocket */}
            <Image
              src="/images/rocket.png"
              alt="Rocket icon"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-zinc-500">
        <p>© 2026 GearUp. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
