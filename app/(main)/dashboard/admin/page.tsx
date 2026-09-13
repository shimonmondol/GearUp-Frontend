"use client";

import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import {
  Users,
  Package,
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/lib/axios";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeGear: 0,
    totalRentals: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ব্যবহারকারী সাসপেন্ডেড কিনা তা পরীক্ষা করার হেল্পার
  const isUserSuspended = (u: UserItem) => {
    if (u.status) {
      return u.status.toUpperCase() === "SUSPENDED" || u.status.toUpperCase() === "BLOCKED";
    }
    if (typeof u.isActive === "boolean") {
      return !u.isActive;
    }
    return Boolean(u.isBlocked);
  };

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const [statsRes, usersRes] = await Promise.all([
        api.get(`/api/admin/stats?_t=${Date.now()}`, config),
        api.get(
          `/api/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=8&_t=${Date.now()}`,
          config
        ),
      ]);

      setStats(statsRes.data?.data || stats);
      setUsers(usersRes.data?.data?.users || []);
      setTotalPages(usersRes.data?.data?.pagination?.totalPages || 1);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load admin records");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdminData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchAdminData]);

  const handleToggleStatus = async (user: UserItem) => {
    const suspended = isUserSuspended(user);
    const nextStatus = suspended ? "ACTIVE" : "SUSPENDED";
    const nextIsActive = suspended;

    setUpdatingId(user.id);
    try {
      const token = Cookies.get("accessToken");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await api.patch(
        `/api/admin/users/${user.id}`,
        {
          status: nextStatus,
          isActive: nextIsActive,
          isBlocked: !suspended,
        },
        config
      );

      toast.success(`User ${suspended ? "activated" : "suspended"} successfully`);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                status: nextStatus,
                isActive: nextIsActive,
                isBlocked: !suspended,
              }
            : u
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 mt-16 sm:mt-20">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Platform Administration</h1>
          <p className="text-sm text-zinc-500">
            Monitor platform operations and enforce moderation policies.
          </p>
        </div>
        <button
          onClick={fetchAdminData}
          className="p-2 border border-zinc-200 bg-white rounded-xl hover:bg-zinc-50 text-zinc-600 transition cursor-pointer shadow-sm self-start sm:self-auto"
          title="Reload table"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium">Total Registered Users</p>
            <h3 className="text-2xl font-bold text-zinc-900">{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="bg-white p-5 border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-[#285724] rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium">Active Available Gear</p>
            <h3 className="text-2xl font-bold text-zinc-900">{stats.activeGear}</h3>
          </div>
        </div>

        <div className="bg-white p-5 border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium">Total Rental Bookings</p>
            <h3 className="text-2xl font-bold text-zinc-900">{stats.totalRentals}</h3>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">User Management</h2>
            <p className="text-xs text-zinc-500">Search, inspect roles, and manage user accounts.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#285724]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin text-[#285724]" /> Loading records...
          </div>
        ) : users.length === 0 ? (
          <p className="py-12 text-center text-xs text-zinc-500">No users found matching query.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => {
                  const suspended = isUserSuspended(u);
                  const isRoleAdmin = (u.role || "").toUpperCase() === "ADMIN";

                  return (
                    <tr key={u.id} className="hover:bg-zinc-50/50 transition">
                      <td className="p-4">
                        <p className="font-semibold text-zinc-900">{u.name || "N/A"}</p>
                        <p className="text-[11px] text-zinc-400">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-zinc-100 text-zinc-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {suspended ? (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <ShieldAlert className="w-3 h-3" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-zinc-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          disabled={updatingId === u.id || isRoleAdmin}
                          onClick={() => handleToggleStatus(u)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 transition ${
                            suspended
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {suspended ? "Activate" : "Suspend"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}