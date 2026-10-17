'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/lib/axios';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  UserCheck,
  Briefcase,
  ShieldAlert,
} from 'lucide-react';

const clearAuthCookies = () => {
  Cookies.remove('accessToken');
  Cookies.remove('userRole');
  Cookies.remove('userName');
};

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRoleLoggingIn, setActiveRoleLoggingIn] = useState<string | null>(null);

  // Direct login execution function (Redirects directly to '/')
  const executeLogin = async (loginEmail: string, loginPass: string, roleName?: string) => {
    setLoading(true);
    if (roleName) setActiveRoleLoggingIn(roleName);

    try {
      const res = await api.post('/api/auth/login', {
        email: loginEmail,
        password: loginPass,
      });
      const resData = res.data;

      const token =
        resData?.data?.accessToken ||
        resData?.data?.token ||
        resData?.accessToken ||
        resData?.token ||
        resData?.result?.accessToken ||
        resData?.result?.token;

      const user = resData?.data?.user || resData?.user || resData?.data;
      const role = (user?.role || resData?.role || roleName || 'CUSTOMER').toUpperCase();

      if (!token) {
        throw new Error('Invalid email or password');
      }

      // Save credentials in Cookies
      Cookies.set('accessToken', token, { expires: 7 });
      Cookies.set('userRole', role, { expires: 7 });
      Cookies.set('userName', user?.name || user?.fullName || `${role} User`, {
        expires: 7,
      });

      toast.success(`${role} Login Successful`, {
        position: 'top-center',
        autoClose: 3000,
      });

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 700);
    } catch (err: any) {
      clearAuthCookies();
      console.error('Login Error Details:', err);

      const status = err?.response?.status;
      let errorMsg = 'Invalid email or password';

      if (status === 400 || status === 401 || status === 404) {
        errorMsg = 'Invalid email or password';
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }

      toast.error(errorMsg, {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setActiveRoleLoggingIn(null);
    }
  };

  // 1-Click Direct Login Handler (Input field fill-up হবে না, সরাসরি ব্যাকগ্রাউন্ডে কল হবে)
  const handleQuickRoleLogin = (role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN') => {
    let creds = { email: '', password: '' };

    if (role === 'CUSTOMER') {
      creds = { email: 'customer1@gearup.com', password: 'securePassword123' };
    } else if (role === 'PROVIDER') {
      creds = { email: 'shimon.dev@example.com', password: 'securePassword123' };
    } else if (role === 'ADMIN') {
      creds = { email: 'admin@gearup.com', password: 'admin123' };
    }

    executeLogin(creds.email, creds.password, role);
  };

  const handleManualFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.warning('Please enter both email and password.');
      return;
    }
    executeLogin(email, password);
  };

  const handleGoogleLogin = () => {
    toast.info('Google login will be connected to your auth provider.', {
      position: 'top-center',
      autoClose: 3000,
    });
  };

  return (
    <div className="space-y-5">
      {/* 1. Manual Login Form */}
      <form onSubmit={handleManualFormSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-800 dark:text-gray-200">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-zinc-50/50 dark:bg-gray-700 border border-zinc-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-800 dark:text-gray-200">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-[#285724] dark:text-[#5fa352] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-zinc-50/50 dark:bg-gray-700 border border-zinc-200 dark:border-gray-600 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder-zinc-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-300 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#285724] hover:bg-[#1f441c] dark:bg-[#3b663b] dark:hover:bg-[#315531] disabled:bg-zinc-400 text-white py-3 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition mt-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading && !activeRoleLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center pt-1">
        <div className="border-t border-zinc-200 dark:border-gray-700 w-full" />
        <span className="bg-white dark:bg-gray-800 px-3 text-[11px] text-zinc-400 dark:text-gray-400 uppercase tracking-wider absolute">
          Or Quick Access
        </span>
      </div>

      {/* 2. 🚀 One-Click Instant Login Buttons (Login বাটনের নিচে) */}
      <div className="space-y-2 pt-1">
        <label className="text-[11px] font-bold text-zinc-500 dark:text-gray-400 uppercase tracking-wider block text-center">
          One-Click Instant Login
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Customer Login Button */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickRoleLogin('CUSTOMER')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-zinc-200 dark:border-gray-700 bg-zinc-50 dark:bg-gray-700/80 hover:bg-[#285724]/10 dark:hover:bg-[#285724]/20 hover:border-[#285724] dark:hover:border-[#5fa352] text-zinc-700 dark:text-gray-200 transition group cursor-pointer disabled:opacity-50"
          >
            {loading && activeRoleLoggingIn === 'CUSTOMER' ? (
              <Loader2 className="w-4 h-4 text-[#285724] dark:text-[#5fa352] animate-spin mb-1" />
            ) : (
              <UserCheck className="w-4 h-4 text-[#285724] dark:text-[#5fa352] mb-1 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[11px] font-bold leading-tight">Customer</span>
          </button>

          {/* Provider Login Button */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickRoleLogin('PROVIDER')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-zinc-200 dark:border-gray-700 bg-zinc-50 dark:bg-gray-700/80 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500 text-zinc-700 dark:text-gray-200 transition group cursor-pointer disabled:opacity-50"
          >
            {loading && activeRoleLoggingIn === 'PROVIDER' ? (
              <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin mb-1" />
            ) : (
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[11px] font-bold leading-tight">Provider</span>
          </button>

          {/* Admin Login Button */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickRoleLogin('ADMIN')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-zinc-200 dark:border-gray-700 bg-zinc-50 dark:bg-gray-700/80 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-500 text-zinc-700 dark:text-gray-200 transition group cursor-pointer disabled:opacity-50"
          >
            {loading && activeRoleLoggingIn === 'ADMIN' ? (
              <Loader2 className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin mb-1" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[11px] font-bold leading-tight">Admin</span>
          </button>
        </div>
      </div>

      {/* 3. 🌐 Google Login Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleGoogleLogin}
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
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
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

      <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-xl my-auto transition-colors duration-300">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-gray-50">
            Login to <span className="text-[#285724] dark:text-[#5fa352]">Gear</span>
            <span className="text-[#3b7c35] dark:text-[#6db865]">Up</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-gray-400">
            Enter your details or use instant one-click login below.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-12 flex justify-center items-center">
              <Loader2 className="w-6 h-6 text-[#285724] animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-zinc-600 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-[#285724] dark:text-[#5fa352] font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}