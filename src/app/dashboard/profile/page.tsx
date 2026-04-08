"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import {
    User,
    Mail,
    Shield,
    Calendar,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function ProfilePage() {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [success, setSuccess] = useState(false);

    const updateProfileMutation = useMutation({
        mutationFn: async (newName: string) => {
            return await fetchWithAuth("/users/profile", {
                method: "PATCH",
                body: JSON.stringify({ name: newName }),
            });
        },
        onSuccess: (data) => {
            // Update the local auth context with new user data
            if (user) {
                login(data.data, localStorage.getItem("token") || "");
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(name);
    };

    if (!user) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Account Profile</h1>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                    Manage your public identity and account settings.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                        <div className="px-6 pb-6">
                            <div className="-mt-12 mb-4 flex justify-center">
                                <div className="h-24 w-24 rounded-full border-4 border-white bg-indigo-100 p-1 dark:border-neutral-950 dark:bg-neutral-800">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-600 text-white">
                                        <User size={40} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{user.name}</h2>
                                <p className="text-sm font-medium text-neutral-500">{user.email}</p>
                                <div className="mt-4 flex justify-center">
                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                        {user.role} Account
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                        <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-neutral-400" />
                            Account Security
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Status</span>
                                <span className="font-semibold text-emerald-600">Verified</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">2FA</span>
                                <span className="font-semibold text-neutral-400 text-xs italic">Disabled</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden">
                        <div className="border-b border-neutral-100 px-8 py-4 dark:border-neutral-800">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Personal Information</h3>
                        </div>

                        <div className="p-8 space-y-6">
                            {success && (
                                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 animate-in fade-in zoom-in-95 duration-300">
                                    <CheckCircle2 size={20} />
                                    <p className="font-medium text-sm">Profile updated successfully!</p>
                                </div>
                            )}

                            {updateProfileMutation.isError && (
                                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                    <AlertCircle size={20} />
                                    <p className="font-medium text-sm">{(updateProfileMutation.error as any).message || "Failed to update profile"}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your display name"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-500"
                                        />
                                    </div>
                                    <p className="text-[10px] text-neutral-400">Email cannot be changed for security purposes.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                        Account Type
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <input
                                            type="text"
                                            value={user.role}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                        Member Since
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <input
                                            type="text"
                                            value={new Date(user.createdAt).toLocaleDateString()}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-50 px-8 py-4 dark:bg-neutral-900/50 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
                            <button
                                type="button"
                                onClick={() => setName(user.name)}
                                className="px-6 py-2.5 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                                Reset Changes
                            </button>
                            <button
                                type="submit"
                                disabled={updateProfileMutation.isPending || name === user.name}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                            >
                                {updateProfileMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
