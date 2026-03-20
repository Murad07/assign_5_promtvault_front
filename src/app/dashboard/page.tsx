"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardOverviewPage() {
    const { user } = useAuth();

    // Protect SSR flash
    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                        Dashboard Overview
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Welcome back to PromptVault, <span className="font-medium text-neutral-900 dark:text-neutral-200">{user.name}</span>!
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Placeholder UI Metric Cards mapping beautifully */}
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Role Type
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            {user.role}
                        </span>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Account Status
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                            Active
                        </span>
                    </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 flex flex-col justify-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">You are securely logged in as <b className="text-neutral-900 dark:text-white">{user.email}</b></p>
                </div>
            </div>
        </div>
    );
}
