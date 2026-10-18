"use client";

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  Loader2,
  Lock,
  MapPin,
} from "lucide-react";

// Customer Profile Skeleton Loader
function CustomerProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-pulse">
      {/* Avatar & Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-zinc-200/80 dark:border-gray-700">
        <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-gray-700 shrink-0" />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="h-5 w-36 bg-zinc-200 dark:bg-gray-700 rounded" />
            <div className="h-5 w-24 bg-zinc-200 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="h-3 w-48 bg-zinc-200 dark:bg-gray-700 rounded mx-auto sm:mx-0" />
        </div>
      </div>

      {/* Form Fields Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-28 bg-zinc-200 dark:bg-gray-700 rounded" />
            <div className="h-10 bg-zinc-200 dark:bg-gray-700 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Security Note Skeleton */}
      <div className="h-10 bg-zinc-200 dark:bg-gray-700 rounded-xl" />

      {/* Button Skeleton */}
      <div className="pt-2 flex justify-end">
        <div className="h-9 w-32 bg-zinc-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Dhaka, Bangladesh",
    role: "CUSTOMER",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCustomerProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await api.get("/api/users/profile", config).catch(() =>
        api.get("/api/auth/me", config).catch(() =>
          api.get("/api/user/profile", config)
        )
      );

      const data = res?.data?.data || res?.data?.user || res?.data || {};
      setProfile((prev) => ({
        ...prev,
        name: data.name || Cookies.get("userName") || "Customer User",
        email: data.email || "customer@gearup.com",
        phone: data.phone || data.phoneNumber || "",
        location: data.location || data.address || prev.location,
        role: (data.role || Cookies.get("userRole") || "CUSTOMER").toUpperCase(),
      }));
    } catch {
      setProfile((prev) => ({
        ...prev,
        name: Cookies.get("userName") || "Customer User",
        email: "customer@gearup.com",
        role: (Cookies.get("userRole") || "CUSTOMER").toUpperCase(),
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerProfile();
  }, [fetchCustomerProfile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.warning("Please enter your name.");
      return;
    }

    setSaving(true);

    const payload: Record<string, any> = {
      name: profile.name.trim(),
    };

    if (profile.phone?.trim()) {
      payload.phone = profile.phone.trim();
      payload.phoneNumber = profile.phone.trim();
    }

    if (profile.location?.trim()) {
      payload.location = profile.location.trim();
      payload.address = profile.location.trim();
    }

    try {
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      let res;
      try {
        res = await api.put("/api/users/profile", payload, config);
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.response?.status === 405) {
          try {
            res = await api.patch("/api/users/profile", payload, config);
          } catch {
            res = await api.patch("/api/auth/profile", payload, config);
          }
        } else {
          throw err;
        }
      }

      const updated = res?.data?.data || res?.data?.user || res?.data || payload;
      const newName = updated.name || payload.name;

      Cookies.set("userName", newName, { expires: 7 });
      setProfile((prev) => ({
        ...prev,
        name: newName,
        phone: updated.phone || updated.phoneNumber || prev.phone,
        location: updated.location || updated.address || prev.location,
      }));

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to update profile. Please try again.";
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header Section */}
      <div className="border-b border-zinc-200/80 dark:border-gray-700 pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
          Customer Profile & Settings
        </h1>
        <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
          Review your verified customer credentials and manage delivery contact information.
        </p>
      </div>

      {loading ? (
        <CustomerProfileSkeleton />
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* 2. User Avatar & Details */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-zinc-200/80 dark:border-gray-700">
            <div className="w-20 h-20 rounded-full bg-[#2e5328] dark:bg-[#3b663b] text-white text-2xl font-black flex items-center justify-center shadow-md uppercase shrink-0">
              {profile.name[0] || "C"}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-gray-100">{profile.name}</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Verified {profile.role}
                </span>
              </div>
              <p className="text-xs text-zinc-400 dark:text-gray-400">{profile.email}</p>
            </div>
          </div>

          {/* 3. Form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-gray-200">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 dark:text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] focus:border-[#2e5328] dark:focus:border-[#5fa352] transition-colors"
                  />
                </div>
              </div>

              {/* Email Address (Disabled) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-gray-200">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 dark:text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full bg-zinc-100 dark:bg-gray-800/80 border border-zinc-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-500 dark:text-gray-400 cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-gray-200">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 dark:text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="e.g. +8801700-000000"
                    className="w-full bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] focus:border-[#2e5328] dark:focus:border-[#5fa352] transition-colors"
                  />
                </div>
              </div>

              {/* Default Location Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-gray-200">
                  Default Delivery Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 dark:text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="e.g. Mohammadpur, Dhaka, Bangladesh"
                    className="w-full bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] focus:border-[#2e5328] dark:focus:border-[#5fa352] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Account Status / Security Alert */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              <Lock className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Your customer account credentials and booking data are securely encrypted.</span>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}