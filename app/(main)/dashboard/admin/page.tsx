"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
  ExternalLink,
  X,
  UserCheck,
  UserX,
  AlertTriangle,
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
    totalGear: 0,
    totalOrders: 0,
  });
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<UserItem | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 8;

  const isUserSuspended = (u: UserItem) => {
    if (u.status) {
      const s = String(u.status).toLowerCase();
      return s === "suspended" || s === "blocked";
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
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const [statsRes, usersRes] = await Promise.all([
        api.get(`/api/admin/stats?_t=${Date.now()}`, config),
        api.get(
          `/api/admin/users?search=${encodeURIComponent(
            search.trim()
          )}&page=${page}&limit=${limit}&_t=${Date.now()}`,
          config
        ),
      ]);

      const data = statsRes.data?.data;
      setStats({
        totalUsers: data?.totalUsers || 0,
        totalGear: data?.totalGear ?? data?.activeGear ?? 0,
        totalOrders: data?.totalRentals || 0,
      });

      const userData = usersRes.data?.data;
      setUsers(userData?.users || []);
      setTotalPages(userData?.pagination?.totalPages || 1);
      setTotalCount(userData?.pagination?.total || 0);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load admin records", {
        position: "top-center",
      });
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

  const handleConfirmToggle = async () => {
    if (!modalUser) return;

    const user = modalUser;
    const currentlySuspended = isUserSuspended(user);
    const nextStatus = currentlySuspended ? "active" : "suspended";
    const nextIsActive = currentlySuspended;

    setUpdatingId(user.id);
    setModalUser(null);

    try {
      const token = Cookies.get("accessToken");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const res = await api.patch(
        `/api/admin/users/${user.id}`,
        {
          status: nextStatus,
          isActive: nextIsActive,
        },
        config
      );

      const updated = res.data?.data;
      toast.success(
        `User account ${currentlySuspended ? "activated" : "suspended"} successfully`,
        { position: "top-center" }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                status: updated?.status || nextStatus,
                isActive:
                  updated?.isActive !== undefined ? updated.isActive : nextIsActive,
              }
            : u
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Status update failed", {
        position: "top-center",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white pt-16 sm:pt-20 pb-12">
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 mt-6">
              Admin Dashboard
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Global metrics, inventory control, and user moderation.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="p-2.5 border border-zinc-200 bg-white rounded-xl hover:bg-zinc-50 text-zinc-600 transition cursor-pointer shadow-sm self-start sm:self-auto"
            title="Reload metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Overview Cards: Total Users | Total Gear | Total Orders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Users */}
          <div className="bg-white p-5 border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-zinc-900">{stats.totalUsers}</h3>
            </div>
          </div>

          {/* Total Gear */}
          <Link
            href="/dashboard/admin/gears?status=all"
            className="bg-white p-5 border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm hover:border-emerald-400 hover:shadow-md transition group cursor-pointer"
          >
            <div className="p-3 bg-emerald-50 text-[#285724] rounded-xl group-hover:bg-[#285724] group-hover:text-white transition">
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500 font-medium">Total Gear</p>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#285724] transition" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">{stats.totalGear}</h3>
            </div>
          </Link>

          {/* Total Orders */}
          <Link
            href="/dashboard/admin/orders"
            className="bg-white p-5 border border-zinc-200 rounded-2xl flex items-center gap-4 shadow-sm hover:border-purple-400 hover:shadow-md transition group cursor-pointer"
          >
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500 font-medium">Total Rental Orders</p>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-600 transition" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">{stats.totalOrders}</h3>
            </div>
          </Link>
        </div>

        {/* User Management Section */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header & Search Bar */}
          <div className="p-5 border-b border-zinc-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">User Management</h2>
              <p className="text-xs text-zinc-500">
                Search, inspect user roles, and enforce moderation policies.
              </p>
            </div>

            {/* Search Bar with Clear Button */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#285724] transition placeholder:text-zinc-400"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          {loading ? (
            <div className="py-16 flex justify-center items-center gap-2 text-xs text-zinc-500">
              <Loader2 className="w-5 h-5 animate-spin text-[#285724]" /> Loading records...
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-xs text-zinc-500">
                No users found matching &ldquo;{search}&rdquo;
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="mt-2 text-xs text-[#285724] font-semibold underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-zinc-50/70 border-b border-zinc-200 text-zinc-600">
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
                    const isUpdating = updatingId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-zinc-50/50 transition">
                        <td className="p-4">
                          <p className="font-semibold text-zinc-900">{u.name || "User"}</p>
                          <p className="text-[11px] text-zinc-400">{u.email}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-zinc-100 text-zinc-700">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {suspended ? (
                            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              <ShieldAlert className="w-3 h-3" /> Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              <ShieldCheck className="w-3 h-3" /> Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-zinc-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            disabled={isUpdating || isRoleAdmin}
                            onClick={() => setModalUser(u)}
                            title={
                              isRoleAdmin
                                ? "Admin accounts cannot be suspended"
                                : suspended
                                ? "Restore user access"
                                : "Temporarily suspend user"
                            }
                            className={`min-w-22 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 transition ${
                              suspended
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : suspended ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Activate
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                Suspend
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Enhanced Pagination Controls */}
          <div className="p-4 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500">
            <div>
              Showing{" "}
              <strong className="text-zinc-800">
                {totalCount > 0 ? (page - 1) * limit + 1 : 0}
              </strong>{" "}
              to{" "}
              <strong className="text-zinc-800">
                {Math.min(page * limit, totalCount)}
              </strong>{" "}
              of <strong className="text-zinc-800">{totalCount}</strong> users
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 cursor-pointer transition"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-1 text-zinc-400">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`min-w-7 h-7 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                          page === p
                            ? "bg-[#285724] text-white"
                            : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 cursor-pointer transition"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Confirmation Pop-up Modal */}
      {modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-zinc-200 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  isUserSuspended(modalUser)
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {isUserSuspended(modalUser) ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  {isUserSuspended(modalUser)
                    ? "Activate Account?"
                    : "Suspend Account?"}
                </h3>
                <p className="text-xs text-zinc-500">Action Confirmation</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to{" "}
              <strong>
                {isUserSuspended(modalUser) ? "activate" : "suspend"}
              </strong>{" "}
              the account for{" "}
              <span className="font-semibold text-zinc-900">
                {modalUser.name || modalUser.email}
              </span>
              ?{" "}
              {isUserSuspended(modalUser)
                ? "This will restore full access to their rentals and listings."
                : "This will revoke their access to login and rent equipment."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalUser(null)}
                className="px-3.5 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmToggle}
                className={`px-4 py-2 text-xs font-semibold rounded-xl text-white transition cursor-pointer shadow-xs ${
                  isUserSuspended(modalUser)
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Confirm {isUserSuspended(modalUser) ? "Activation" : "Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}