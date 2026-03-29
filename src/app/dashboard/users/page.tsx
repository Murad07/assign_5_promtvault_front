"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import React, { useState } from "react";
import { Users, Trash2, Loader2, ShieldAlert, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ManageUsersPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Search and Pagination State
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; email: string } | null>(null);

    const { data: usersData, isLoading, isError } = useQuery({
        queryKey: ["admin-users"],
        queryFn: () => fetchWithAuth("/users"),
        enabled: user?.role === "ADMIN",
    });

    const roleMutation = useMutation({
        mutationFn: async ({ id, role }: { id: string; role: string }) => {
            return await fetchWithAuth(`/users/${id}/role`, {
                method: "PATCH",
                body: JSON.stringify({ role })
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (err: any) => {
            alert(err.message || "Failed to update role.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await fetchWithAuth(`/users/${id}`, { method: "DELETE" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (err: any) => {
            alert(err.message || "Failed to delete user.");
        }
    });

    if (user?.role !== "ADMIN") return null;

    // Filter & Pagination Logic
    const allUsers = usersData?.data || [];

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    const filteredUsers = allUsers.filter((u: any) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return u.name.toLowerCase().includes(searchLower) || u.email.toLowerCase().includes(searchLower);
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Access Control Center
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Manage all platform users, assign strict roles, or permanently terminate accounts natively.
                    </p>
                </div>
            </div>

            {/* Search Filter input */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by User Name or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : isError ? (
                    <div className="p-8 text-center text-red-500">
                        <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        Access completely denied. Strict system constraints failed or authentication expired.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-4 font-medium">User / Email</th>
                                    <th className="px-6 py-4 font-medium">Joined Date</th>
                                    <th className="px-6 py-4 font-medium w-48">System Role</th>
                                    <th className="px-6 py-4 font-medium text-right">Terminate Account</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {paginatedUsers.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold dark:bg-indigo-900/40 dark:text-indigo-400">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-neutral-900 dark:text-white">{u.name}</div>
                                                    <div className="text-xs text-neutral-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={u.role}
                                                disabled={u.id === user.id} // Stop admin from accidentally locking out themselves!
                                                onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value })}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-2 appearance-none transition-colors w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${u.role === "ADMIN" ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" :
                                                    u.role === "SELLER" ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400" :
                                                        "bg-neutral-50 border-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300"
                                                    }`}
                                            >
                                                <option value="BUYER">BUYER</option>
                                                <option value="SELLER">SELLER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.id !== user.id && (
                                                <button
                                                    onClick={() => setDeleteTarget({ id: u.id, email: u.email })}
                                                    className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                    title="Permanently Delete Native User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {!isLoading && !isError && (usersData?.data?.length > 0) && (
                    <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="py-1.5 px-3 border border-neutral-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white text-sm"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                            </select>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap hidden sm:block">
                                Showing <span className="font-semibold text-neutral-900 dark:text-white">
                                    {filteredUsers.length > 0 ? startIndex + 1 : 0}
                                </span> to <span className="font-semibold text-neutral-900 dark:text-white">
                                    {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                                </span> of <span className="font-semibold text-neutral-900 dark:text-white">
                                    {filteredUsers.length}
                                </span> results
                            </div>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1 rounded-md text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1 rounded-md text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Block Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-4 text-amber-600 dark:text-amber-400 mb-4">
                            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                                <ShieldAlert size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Suspend User Account</h2>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 font-medium">
                            Are you strictly sure you want to deactivate <span className="font-bold text-neutral-900 dark:text-white">{deleteTarget.email}</span>? They will lose access to the platform natively.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-5 py-2.5 rounded-xl font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Cancel Action
                            </button>
                            <button
                                onClick={() => {
                                    deleteMutation.mutate(deleteTarget.id);
                                    setDeleteTarget(null);
                                }}
                                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-500/20 transition-all dark:bg-amber-600 dark:hover:bg-amber-700 active:scale-95 flex items-center gap-2"
                            >
                                <ShieldAlert size={16} /> Suspend User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
