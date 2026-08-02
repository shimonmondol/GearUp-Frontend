'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  // 🔄 Update user state from cookies on initial load or route change
  useEffect(() => {
    const token = Cookies.get('accessToken');
    const name = Cookies.get('userName');
    const role = Cookies.get('userRole');

    if (token) {
      setIsLoggedIn(true);
      setUserName(name || 'Profile');
      setUserRole(role || 'CUSTOMER');
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserRole('');
    }
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    // Remove cookies
    Cookies.remove('accessToken');
    Cookies.remove('userRole');
    Cookies.remove('userName');
    setIsLoggedIn(false);
    closeMenu();

    // 🌟 React Toastify Alert for Logout
    toast.success('Logged Out Successfully!', {
      position: 'top-center',
      autoClose: 3000,
    });

    // Redirect to home page
    router.push('/');
    router.refresh();
  };

  // Get appropriate dashboard URL based on role
  const getDashboardLink = () => {
    if (userRole === 'ADMIN') return '/dashboard/admin';
    if (userRole === 'PROVIDER') return '/dashboard/provider';
    return '/dashboard/customer';
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
            isOpen ? 'block' : 'hidden'
          } w-full md:block md:w-auto transition-all duration-300 ease-in-out`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-blue-800 rounded-lg bg-blue-900 md:flex-row md:items-center md:space-x-8 md:mt-0 md:border-0">
            <li>
              <Link
                href="/"
                onClick={closeMenu}
                className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 focus:outline-none focus:ring-0"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/gear"
                onClick={closeMenu}
                className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 focus:outline-none focus:ring-0"
              >
                Gear
              </Link>
            </li>

            {/* Dynamic Auth Links */}
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    href={getDashboardLink()}
                    onClick={closeMenu}
                    className="flex items-center gap-2 py-2 px-3 text-white rounded bg-blue-800 md:bg-blue-800/80 hover:bg-blue-700 md:py-1.5 md:px-3 text-sm focus:outline-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    {userName} ({userRole})
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left md:w-auto block py-2 px-3 text-white rounded hover:bg-blue-800 cursor-pointer hover:text-red-500 md:hover:bg-transparent md:p-0 focus:outline-none"
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
                    className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 focus:outline-none focus:ring-0"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="block py-2 px-3 text-white rounded hover:bg-blue-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-200 md:p-0 focus:outline-none focus:ring-0"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;