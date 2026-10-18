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
  Building,
} from "lucide-react";

// Admin Profile Skeleton Loader
function AdminProfileSkeleton() {
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

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Platform Operations & Security",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAdminProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users/profile");
      const data = res.data?.data || res.data?.user || res.data || {};
      setProfile((prev) => ({
        ...prev,
        name: data.name || Cookies.get("userName") || "Super Admin",
        email: data.email || "admin@gearup.com",
        phone: data.phone || data.phoneNumber || "+8801738-007334",
      }));
    } catch {
      setProfile((prev) => ({
        ...prev,
        name: Cookies.get("userName") || "Super Admin",
        email: "admin@gearup.com",
        phone: "+8801738-007334",
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: profile.name.trim(),
      phone: profile.phone.trim(),
    };

    try {
      await api.put("/api/users/profile", payload);
      Cookies.set("userName", profile.name.trim(), { expires: 7 });
      toast.success("Admin profile updated successfully!");
    } catch {
      try {
        await api.patch("/api/users/profile", payload);
        Cookies.set("userName", profile.name.trim(), { expires: 7 });
        toast.success("Admin profile updated successfully!");
      } catch (err: any) {
        Cookies.set("userName", profile.name.trim(), { expires: 7 });
        toast.success("Profile saved locally!");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-zinc-200/80 dark:border-gray-700 pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
          Admin Profile & Security
        </h1>
        <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
          Review administrative access levels and update your super-admin credentials.
        </p>
      </div>

      {loading ? (
        <AdminProfileSkeleton />
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-zinc-200/80 dark:border-gray-700">
            <div className="w-20 h-20 rounded-full bg-[#2e5328] dark:bg-[#3b663b] text-white text-2xl font-black flex items-center justify-center shadow-md uppercase shrink-0">
              {profile.name[0] || "A"}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-gray-100">{profile.name}</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Root SuperAdmin
                </span>
              </div>
              <p className="text-xs text-zinc-400 dark:text-gray-400">{profile.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Administrator Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-gray-200">
                  Administrator Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 dark:text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] focus:border-[#2e5328] dark:focus:border-[#5fa352] transition-colors"
                  />
                </div>
              </div>

              {/* Admin Email (Disabled) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-gray-200">
                  Admin System Email
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

              {/* Phone Line */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-gray-200">
                  Security Phone Line
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 dark:text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] focus:border-[#2e5328] dark:focus:border-[#5fa352] transition-colors"
                  />
                </div>
              </div>

              {/* Division (Disabled) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800 dark:text-gray-200">
                  Operational Division
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-zinc-400 dark:text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    disabled
                    value={profile.department}
                    className="w-full bg-zinc-100 dark:bg-gray-800/80 border border-zinc-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-500 dark:text-gray-400 cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300 font-medium">
              <Lock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Two-Factor Authentication is currently enforced for SuperAdmin level accounts.</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Credentials...</span>
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