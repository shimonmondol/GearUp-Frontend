"use client";

import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
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

// User Table Skeleton Loader Component
function UserTableSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-zinc-100 dark:border-gray-700/60">
          {/* User Details Skeleton */}
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-gray-700 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-[150px]">
                <div className="h-3.5 bg-zinc-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-2.5 bg-zinc-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          </td>
          {/* Role Skeleton */}
          <td className="p-4">
            <div className="h-5 w-16 bg-zinc-200 dark:bg-gray-700 rounded-full" />
          </td>
          {/* Account Status Skeleton */}
          <td className="p-4">
            <div className="h-5 w-20 bg-zinc-200 dark:bg-gray-700 rounded-full" />
          </td>
          {/* Joined Date Skeleton */}
          <td className="p-4">
            <div className="h-3.5 w-20 bg-zinc-200 dark:bg-gray-700 rounded" />
          </td>
          {/* Action Button Skeleton */}
          <td className="p-4 text-right">
            <div className="h-7 w-20 bg-zinc-200 dark:bg-gray-700 rounded-xl inline-block" />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function AdminDashboardPage() {
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

      const usersRes = await api.get(
        `/api/admin/users?search=${encodeURIComponent(
          search.trim()
        )}&page=${page}&limit=${limit}&_t=${Date.now()}`,
        config
      );

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-200/80 dark:border-gray-700 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-gray-100 tracking-tight">
            User Management & Access Control
          </h1>
          <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
            Search, inspect user roles, and enforce moderation policies across accounts.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="p-2 border border-zinc-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-gray-700 text-zinc-600 dark:text-gray-300 transition cursor-pointer shadow-xs self-start sm:self-auto"
          title="Reload records"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-gray-800 border border-zinc-200/80 dark:border-gray-700 rounded-3xl shadow-xs overflow-hidden">
        {/* Search Bar Container */}
        <div className="p-5 sm:p-6 border-b border-zinc-200/80 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-zinc-100 dark:bg-gray-700 text-zinc-700 dark:text-gray-200">
              <Users className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-gray-100">Registered Accounts</h2>
              <p className="text-[11px] text-zinc-400 dark:text-gray-400">Total: {totalCount} users</p>
            </div>
          </div>

          {/* Search Box with dark mode styles */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="w-full bg-zinc-50 dark:bg-gray-900/60 border border-zinc-200 dark:border-gray-700 rounded-xl pl-10 pr-8 py-2 text-xs text-zinc-900 dark:text-gray-100 placeholder:text-zinc-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1.5 focus:ring-[#2e5328] dark:focus:ring-[#5fa352] focus:border-[#2e5328] dark:focus:border-[#5fa352] transition-colors"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-gray-200 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Table Content / State */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-50/70 dark:bg-gray-700/50 border-b border-zinc-200/80 dark:border-gray-700 text-zinc-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Account Status</th>
                <th className="p-4 font-bold">Joined Date</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-gray-700/60">
              {loading ? (
                <UserTableSkeleton count={limit} />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <p className="text-xs text-zinc-500 dark:text-gray-400">
                      No users found matching &ldquo;{search}&rdquo;
                    </p>
                    {search && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setPage(1);
                        }}
                        className="mt-2 text-xs text-[#2e5328] dark:text-[#5fa352] font-semibold underline cursor-pointer"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const suspended = isUserSuspended(u);
                  const isRoleAdmin = (u.role || "").toUpperCase() === "ADMIN";
                  const isUpdating = updatingId === u.id;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-zinc-50/60 dark:hover:bg-gray-700/40 transition"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#2e5328]/15 dark:bg-[#3b663b]/30 text-[#2e5328] dark:text-emerald-400 font-bold flex items-center justify-center uppercase shrink-0">
                            {u.name ? u.name[0] : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-gray-100">{u.name || "User"}</p>
                            <p className="text-[11px] text-zinc-400 dark:text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-zinc-100 dark:bg-gray-700 border-zinc-200 dark:border-gray-600 text-zinc-700 dark:text-gray-300 uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {suspended ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                            <ShieldAlert className="w-3 h-3" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-zinc-500 dark:text-gray-400">
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
                          className={`min-w-22 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-40 transition shadow-xs ${
                            suspended
                              ? "bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531] text-white"
                              : "bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-4 sm:p-5 border-t border-zinc-200/80 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500 dark:text-gray-400">
          <div>
            Showing{" "}
            <strong className="text-zinc-800 dark:text-gray-200">
              {totalCount > 0 ? (page - 1) * limit + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong className="text-zinc-800 dark:text-gray-200">
              {Math.min(page * limit, totalCount)}
            </strong>{" "}
            of <strong className="text-zinc-800 dark:text-gray-200">{totalCount}</strong> users
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 border border-zinc-200 dark:border-gray-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-gray-700 disabled:opacity-40 cursor-pointer transition text-zinc-600 dark:text-gray-300"
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
                      <span className="px-1 text-zinc-400 dark:text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`min-w-7 h-7 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                        page === p
                          ? "bg-[#2e5328] dark:bg-[#3b663b] text-white shadow-xs"
                          : "border border-zinc-200 dark:border-gray-700 text-zinc-600 dark:text-gray-300 hover:bg-zinc-50 dark:hover:bg-gray-700"
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
              className="p-1.5 border border-zinc-200 dark:border-gray-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-gray-700 disabled:opacity-40 cursor-pointer transition text-zinc-600 dark:text-gray-300"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200/80 dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-2xl ${
                  isUserSuspended(modalUser)
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                }`}
              >
                {isUserSuspended(modalUser) ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-gray-100">
                  {isUserSuspended(modalUser) ? "Activate Account?" : "Suspend Account?"}
                </h3>
                <p className="text-xs text-zinc-400">Action Confirmation</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to{" "}
              <strong>
                {isUserSuspended(modalUser) ? "activate" : "suspend"}
              </strong>{" "}
              the account for{" "}
              <span className="font-semibold text-zinc-900 dark:text-gray-100">
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
                className="px-3.5 py-2 text-xs font-semibold text-zinc-600 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-gray-700 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmToggle}
                className={`px-4 py-2 text-xs font-bold rounded-xl text-white transition cursor-pointer shadow-xs ${
                  isUserSuspended(modalUser)
                    ? "bg-[#2e5328] hover:bg-[#244220] dark:bg-[#3b663b] dark:hover:bg-[#315531]"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Confirm {isUserSuspended(modalUser) ? "Activation" : "Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}