"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import { Users, Trash2, Loader2, ShieldAlert } from "lucide-react";

export default function ManageUsersPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

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
                                {usersData?.data?.map((u: any) => (
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
                                                    onClick={() => {
                                                        if (confirm(`Are you strictly sure you want to permanently erase ${u.email}?`)) {
                                                            deleteMutation.mutate(u.id);
                                                        }
                                                    }}
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
            </div>
        </div>
    );
}
