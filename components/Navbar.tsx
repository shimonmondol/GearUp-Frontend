"use client";

import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-900 text-white fixed w-full z-20 top-0 left-0 border-b border-blue-800">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Brand Logo */}
        <Link
          className="font-semibold text-2xl tracking-wide focus:outline-none focus:ring-0"
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
            /* Close (X) Icon */
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
            /* Hamburger Icon */
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

        {/* Navigation Links (Responsive Container) */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full md:block md:w-auto transition-all duration-300 ease-in-out`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-blue-800 rounded-lg bg-blue-900 md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 focus:outline-none focus:ring-0"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/gear"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 focus:outline-none focus:ring-0"
              >
                Gear
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 focus:outline-none focus:ring-0"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 focus:outline-none focus:ring-0"
              >
                SignUp
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;