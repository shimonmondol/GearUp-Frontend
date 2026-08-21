"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("userRole");
    Cookies.remove("userName");

    setIsLoggedIn(false);
    closeMenu();

    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 1500,
    });
    router.refresh();
  };

  const getDashboardLink = () => {
    if (userRole === "ADMIN") return "/dashboard/admin";
    if (userRole === "PROVIDER") return "/dashboard/provider";
    return "/dashboard/customer";
  };

  return (
    <nav className="bg-blue-900 text-white fixed w-full z-20 top-0 left-0 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand Logo */}
          <Link
            className="font-semibold text-3xl tracking-wide focus:outline-none focus:ring-0"
            href="/"
          >
            GearUp
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-200 rounded-lg md:hidden hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
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

          {/* Navigation Links (Desktop) */}
          <div
            className="hidden md:flex md:items-center md:w-auto"
            id="navbar-default"
          >
            <ul className="font-medium flex flex-row items-center space-x-8 text-sm">
              <li>
                <Link
                  href="/"
                  className="block text-white font-normal text-lg hover:text-blue-200 transition-colors focus:outline-none"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/gear"
                  className="block text-white font-normal text-lg hover:text-blue-200 transition-colors focus:outline-none"
                >
                  Gear
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-white font-normal text-lg hover:text-blue-200 transition-colors focus:outline-none"
                >
                  Contact
                </Link>
              </li>
              {/* Dynamic Auth Links */}
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center font-normal text-lg gap-2 py-1.5 px-3 text-white rounded bg-blue-800 hover:bg-blue-700 transition-colors focus:outline-none"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      {userName} ({userRole})
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block text-white font-normal text-lg cursor-pointer hover:text-red-600 transition-colors focus:outline-none"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="block text-white font-normal text-lg hover:text-blue-200 transition-colors focus:outline-none"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="block bg-blue-800 font-normal text-lg hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors focus:outline-none"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-800">
            <ul className="font-medium flex flex-col space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block py-1 text-white hover:text-blue-200"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/gear"
                  onClick={closeMenu}
                  className="block py-1 text-white hover:text-blue-200"
                >
                  Gear
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href={getDashboardLink()}
                      onClick={closeMenu}
                      className="inline-flex items-center gap-2 py-1.5 px-3 text-white rounded bg-blue-800 text-xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      {userName} ({userRole})
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block py-1 text-white text-left hover:text-red-400"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="block py-1 text-white hover:text-blue-200"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="inline-block bg-blue-800 text-white px-4 py-2 rounded text-xs"
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
