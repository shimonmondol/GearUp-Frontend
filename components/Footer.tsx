import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaGithub, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white text-gray-900 dark:bg-gray-900 dark:text-zinc-100 pt-10 pb-8 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-200 dark:border-zinc-800">
        {/* Brand & Social */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              GEARUP
            </span>
          </div>
          <p className="text-gray-600 dark:text-zinc-400 text-md leading-relaxed">
            Your trusted partner for sports and outdoor equipment rental. Gear
            up. Adventure more.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/shimon.mondol"
              aria-label="Facebook"
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#3b663b] text-gray-700 hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[#3b663b] dark:hover:text-white flex items-center justify-center transition"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/shimonmondol"
              aria-label="Github"
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#3b663b] text-gray-700 hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[#3b663b] dark:hover:text-white flex items-center justify-center transition"
            >
              <FaGithub className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/shimon-mondol"
              aria-label="Linkedin"
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#3b663b] text-gray-700 hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[#3b663b] dark:hover:text-white flex items-center justify-center transition"
            >
              <FaLinkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-gray-900 dark:text-white font-bold tracking-wider uppercase text-[11px]">
            Quick Links
          </h4>
          <ul className="space-y-2 text-gray-600 dark:text-zinc-400">
            <li>
              <a
                href="/"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/gear"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Browse Gear
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-3">
          <h4 className="text-gray-900 dark:text-white font-bold tracking-wider uppercase text-[11px]">
            Customer Service
          </h4>
          <ul className="space-y-2 text-gray-600 dark:text-zinc-400 text-xs">
            <li>
              <Link
                href="/help/delivery-pickup"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Delivery & Pickup
              </Link>
            </li>
            <li>
              <Link
                href="/help/returns-refunds"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link
                href="/help/terms-conditions"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/help/privacy-policy"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-gray-900 dark:text-white font-bold tracking-wider uppercase text-[11px]">
            Contact Us
          </h4>
          <div className="space-y-2 text-gray-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#3b663b] dark:text-[#8ec584]" />
              <span>+8801738-007334</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#3b663b] dark:text-[#8ec584]" />
              <span>hello@gearup.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#3b663b] dark:text-[#8ec584] shrink-0 mt-0.5" />
              <span>
                House 12, Road 5<br />
                Banasree, Dhaka 1205
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h4 className="text-gray-900 dark:text-white font-bold tracking-wider uppercase text-[11px]">
            We Accept
          </h4>
          <div className="flex items-center gap-2 rounded-md bg-transparent p-1">
            <Image
              src="/images/visa.png"
              alt="Visa Payment"
              width={32}
              height={32}
              className="object-contain"
            />
            <Image
              src="/images/bkash.png"
              alt="bKash logo"
              width={120}
              height={60}
              className="w-10 h-auto"
            />
            <Image
              src="/images/nagad.png"
              alt="Nagad Payment"
              width={32}
              height={32}
              className="object-contain"
            />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 dark:text-zinc-500">
        <p>© 2026 GearUp. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
