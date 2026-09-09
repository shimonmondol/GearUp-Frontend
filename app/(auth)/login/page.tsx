'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import api from '@/lib/axios';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      const resData = res.data;

      const token =
        resData?.data?.accessToken ||
        resData?.data?.token ||
        resData?.accessToken ||
        resData?.token ||
        resData?.result?.accessToken ||
        resData?.result?.token;

      const user = resData?.data?.user || resData?.user || resData?.data;
      const role = user?.role || resData?.role || 'CUSTOMER';

      if (!token) {
        throw new Error('Token missing');
      }

      // Save credentials in Cookies
      Cookies.set('accessToken', token, { expires: 7 });
      Cookies.set('userRole', role, { expires: 7 });
      Cookies.set('userName', user?.name || user?.fullName || 'User', {
        expires: 7,
      });

      toast.success('Login successful!', {
        position: 'top-center',
        autoClose: 2000,
      });

      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 2000);
    } catch (err: any) {
      console.error('Login Error Details:', err);
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Login Failed';
      toast.error(errorMsg, {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-800">Email Address</label>
        <div className="relative">
          <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-800">Password</label>
          <Link href="/forgot-password" className="text-[11px] font-semibold text-[#285724] hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#285724] hover:bg-[#1f441c] disabled:bg-zinc-400 text-white py-3 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition mt-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
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
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased flex items-center justify-center p-4 selection:bg-[#285724] selection:text-white">
      {/* Centered Card */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-12 w-full max-w-md shadow-xl my-auto">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            Login to <span className="text-[#285724]">Gear</span><span className="text-[#3b7c35]">Up</span>
          </h2>
          <p className="text-xs text-zinc-500">Welcome back! Please enter your details.</p>
        </div>

        {/* Suspense Wrapper to prevent Next.js build-time prerendering failure */}
        <Suspense
          fallback={
            <div className="py-12 flex justify-center items-center">
              <Loader2 className="w-6 h-6 text-[#285724] animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Login Redirect */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#285724] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}