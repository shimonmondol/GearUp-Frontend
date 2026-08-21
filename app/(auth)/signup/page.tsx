'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 Characters', {
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
        name,
        email,
        password,
        role: 'customer',
      });

      toast.success('SignUp Successful', {
        position: 'top-center',
        autoClose: 3000,
      });

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Signup Error Details:', err.response?.data);

      const serverData = err.response?.data;
      let errorMsg = 'SignUp Failed';
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

  return (
    <div className="min-h-screen bg-[#fcfdfa] text-zinc-900 font-sans antialiased flex items-center justify-center p-4 selection:bg-[#285724] selection:text-white">
      
      {/* Centered Register Card */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-12 w-full max-w-md shadow-xl my-auto">
        
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            Create an <span className="text-[#285724]">Account</span>
          </h2>
          <p className="text-xs text-zinc-500">Join GearUp and start your outdoor journey.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
              />
            </div>
          </div>

          {/* Email Address Input */}
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
            <label className="text-xs font-semibold text-zinc-800">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
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

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724] focus:border-[#285724] transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                <span>Signing up...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#285724] font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}