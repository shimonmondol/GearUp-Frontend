"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // 🔄 Update user state from cookies on initial load or route change
  useEffect(() => {
    const token = Cookies.get("accessToken");
    const name = Cookies.get("userName");
    const role = Cookies.get("userRole");

    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "Profile");
      setUserRole(role || "CUSTOMER");
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setUserRole("");
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("userRole");
    Cookies.remove("userName");

    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    closeMenu();

    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 1500,
    });

    router.push("/");
    router.refresh();
  };

  const getDashboardLink = () => {
    if (userRole === "ADMIN") return "/dashboard/admin";
    if (userRole === "PROVIDER") return "/dashboard/provider";
    return "/dashboard/customer";
  };

  // 🌟 Active route check helper
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed w-full z-20 top-0 left-0 bg-white/95 dark:bg-gray-900 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand Logo */}
          <Link
            className="font-bold text-3xl tracking-wide text-[#477a3d] dark:text-[#5fa352] focus:outline-none"
            href="/"
          >
            GearUp
          </Link>

          {/* Right Action Area (Mobile Toggle + Hamburger) */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
              aria-controls="navbar-default"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              )}
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <div
            className="hidden md:flex md:items-center md:w-auto"
            id="navbar-default"
          >
            <ul className="font-medium flex flex-row items-center space-x-7 text-sm">
              <li>
                <Link
                  href="/"
                  className={`block font-semibold text-sm transition-colors focus:outline-none relative py-1 ${
                    isActive("/")
                      ? "text-[#477a3d] dark:text-[#5fa352]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#477a3d] dark:hover:text-[#5fa352]"
                  }`}
                >
                  Home
                  {isActive("/") && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#477a3d] dark:bg-[#5fa352] rounded-full" />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`block font-semibold text-sm transition-colors focus:outline-none relative py-1 ${
                    isActive("/about")
                      ? "text-[#477a3d] dark:text-[#5fa352]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#477a3d] dark:hover:text-[#5fa352]"
                  }`}
                >
                  About
                  {isActive("/about") && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#477a3d] dark:bg-[#5fa352] rounded-full" />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/gear"
                  className={`block font-semibold text-sm transition-colors focus:outline-none relative py-1 ${
                    isActive("/gear")
                      ? "text-[#477a3d] dark:text-[#5fa352]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#477a3d] dark:hover:text-[#5fa352]"
                  }`}
                >
                  Gear
                  {isActive("/gear") && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#477a3d] dark:bg-[#5fa352] rounded-full" />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`block font-semibold text-sm transition-colors focus:outline-none relative py-1 ${
                    isActive("/contact")
                      ? "text-[#477a3d] dark:text-[#5fa352]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#477a3d] dark:hover:text-[#5fa352]"
                  }`}
                >
                  Contact
                  {isActive("/contact") && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#477a3d] dark:bg-[#5fa352] rounded-full" />
                  )}
                </Link>
              </li>

              {/* Dynamic Auth Links */}
              {isLoggedIn ? (
                <li className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    type="button"
                    className="flex items-center font-semibold text-xs gap-2 py-2 px-3.5 text-white rounded-xl bg-[#477a3d] hover:bg-[#3b6632] dark:bg-[#477a3d] dark:hover:bg-[#3b6632] transition-colors focus:outline-none shadow-sm cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                    <span>
                      {userName} ({userRole})
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setIsDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${
                          isActive("/dashboard")
                            ? "bg-[#477a3d]/10 text-[#477a3d] dark:text-[#5fa352]"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#477a3d] dark:text-[#5fa352]" />
                        Dashboard
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-800 my-1.5"></div>

                      <button
                        onClick={handleLogout}
                        type="button"
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className={`block font-semibold text-sm transition-colors focus:outline-none relative py-1 ${
                        isActive("/login")
                          ? "text-[#477a3d] dark:text-[#5fa352]"
                          : "text-gray-700 dark:text-gray-300 hover:text-[#477a3d] dark:hover:text-[#5fa352]"
                      }`}
                    >
                      Login
                      {isActive("/login") && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#477a3d] dark:bg-[#5fa352] rounded-full" />
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="block bg-[#477a3d] hover:bg-[#3b6632] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors focus:outline-none shadow-xs"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}

              {/* Theme Switcher Toggle */}
              <li className="pl-2 border-l border-gray-200 dark:border-gray-800">
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <ul className="font-medium flex flex-col space-y-1.5 text-sm">
              <li>
                <Link
                  href="/"
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive("/")
                      ? "bg-[#477a3d]/10 text-[#477a3d] dark:text-[#5fa352]"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive("/")
                      ? "bg-[#477a3d]/10 text-[#477a3d] dark:text-[#5fa352]"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/gear"
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive("/gear")
                      ? "bg-[#477a3d]/10 text-[#477a3d] dark:text-[#5fa352]"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Gear
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive("/contact")
                      ? "bg-[#477a3d]/10 text-[#477a3d] dark:text-[#5fa352]"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Contact
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  <li className="pt-2 px-3">
                    <div className="flex items-center gap-2 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {userName} ({userRole})
                    </div>
                  </li>
                  <li>
                    <Link
                      href={getDashboardLink()}
                      onClick={closeMenu}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        isActive("/dashboard")
                          ? "bg-[#477a3d]/10 text-[#477a3d] dark:text-[#5fa352]"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#477a3d] dark:text-[#5fa352]" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="pt-2">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        isActive("/login")
                          ? "bg-[#477a3d]/10 text-[#477a3d] dark:text-[#5fa352]"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="block text-center bg-[#477a3d] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;