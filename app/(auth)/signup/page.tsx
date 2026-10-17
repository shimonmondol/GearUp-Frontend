'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/lib/axios';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning('Please enter your full name.', {
        position: 'top-center',
        autoClose: 2500,
      });
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'customer',
      });

      toast.success('Registration successful! Redirecting to login...', {
        position: 'top-center',
        autoClose: 2000,
      });

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      console.error('Signup Error Details:', err.response?.data || err);

      const serverData = err.response?.data;
      let errorMsg = 'Signup failed. Please try again.';

      if (serverData?.errorDetails && Array.isArray(serverData.errorDetails)) {
        errorMsg = serverData.errorDetails
          .map((item: any) => item.message)
          .join(', ');
      } else if (serverData?.message) {
        errorMsg = Array.isArray(serverData.message)
          ? serverData.message.join(', ')
          : serverData.message;
      }

      toast.error(errorMsg, {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.info('Google signup will be connected to your auth provider.', {
      position: 'top-center',
      autoClose: 2500,
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfdfa] dark:bg-gray-900 text-zinc-900 dark:text-gray-100 font-sans antialiased flex items-center justify-center p-4 selection:bg-[#285724] selection:text-white transition-colors duration-300">
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Centered Register Card */}
      <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-xl my-auto transition-colors duration-300">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-gray-50">
            Create an <span className="text-[#285724] dark:text-[#5fa352]">Account</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-gray-400">
            Join GearUp and start your outdoor journey today.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 dark:text-gray-200">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-zinc-50/50 dark:bg-gray-700 border border-zinc-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 dark:text-gray-200">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-zinc-50/50 dark:bg-gray-700 border border-zinc-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 dark:text-gray-200">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-zinc-50/50 dark:bg-gray-700 border border-zinc-200 dark:border-gray-600 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-300 focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 dark:text-gray-200">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-zinc-50/50 dark:bg-gray-700 border border-zinc-200 dark:border-gray-600 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-300 focus:outline-none cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#285724] hover:bg-[#1f441c] dark:bg-[#3b663b] dark:hover:bg-[#315531] disabled:bg-zinc-400 text-white py-3 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition mt-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 🌐 Google Signup Button */}
        <div className="space-y-3 pt-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-200 dark:border-gray-700 w-full" />
            <span className="bg-white dark:bg-gray-800 px-3 text-[11px] text-zinc-400 dark:text-gray-400 uppercase tracking-wider absolute">
              Or register with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:bg-zinc-100 dark:hover:bg-gray-900 text-xs font-semibold text-zinc-700 dark:text-gray-200 shadow-xs transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Login Redirect */}
        <p className="text-center text-xs text-zinc-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#285724] dark:text-[#5fa352] font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}