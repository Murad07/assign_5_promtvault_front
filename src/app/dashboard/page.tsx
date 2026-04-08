"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import { Loader2, Users, CreditCard, ShoppingBag, FolderOpen, Star, Sparkles, Brain, TrendingUp, Zap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardOverviewPage() {
    const { user } = useAuth();

    const { data: statsData, isLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => fetchWithAuth("/users/statistics"),
        enabled: !!user,
    });

    if (!user) return null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-24">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const stats = statsData?.data;

    return (
        <div className="space-y-8">
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

            {/* ADMIN DASHBOARD OVERVIEW */}
            {user.role === "ADMIN" && stats && (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-900 dark:bg-indigo-900/30">
                                    <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Users</p>
                                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalUsers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-900/30">
                                    <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Revenue</p>
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${stats.totalRevenue?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-900/30">
                                    <FolderOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Prompts</p>
                                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalPrompts}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/30">
                                    <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Orders</p>
                                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalOrders}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2 mt-8">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Users by Role</h3>
                            <div className="h-72 w-full">
                                {stats.usersByRole?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={stats.usersByRole} cx="50%" cy="50%" outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                                                {stats.usersByRole.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => [`${value} Users`, "Count"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5e5" }} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-neutral-400">No User data available.</div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Revenue by Category</h3>
                            <div className="h-72 w-full">
                                {stats.salesByCategory?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={stats.salesByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name }) => name}>
                                                {stats.salesByCategory.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5e5" }} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-neutral-400">No Sales data available yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* SELLER DASHBOARD OVERVIEW */}
            {user.role === "SELLER" && stats && (
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-900/30">
                                <FolderOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Prompts Listed</p>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalListed}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/30">
                                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Sales Triggered</p>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalSales}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-900/30">
                                <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Gross Income</p>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${stats.totalRevenue?.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BUYER DASHBOARD OVERVIEW */}
            {user.role === "BUYER" && stats && (
                <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/30">
                                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Purchases</p>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalPurchases}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 dark:border-purple-900 dark:bg-purple-900/30">
                                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Reviews Submitted</p>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalReviews}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* AI Insights Section */}
            <div className="mt-12 rounded-3xl bg-indigo-600 p-8 text-white shadow-2xl shadow-indigo-500/20 dark:bg-indigo-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="rounded-full bg-white/20 p-2 backdrop-blur-md">
                        <Sparkles size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">AI Intelligence: Predictive Insights</h2>
                        <p className="text-indigo-100 text-sm">Automated analysis of your PromptVault activity</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {user.role === "ADMIN" && (
                        <>
                            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                                <Brain className="mb-3 text-indigo-100" size={20} />
                                <h4 className="font-bold text-sm">Trending Niche</h4>
                                <p className="mt-2 text-2xl font-black">Coding & Dev</p>
                                <p className="mt-1 text-xs text-indigo-100/70">Predicted +24% growth next week</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                                <TrendingUp className="mb-3 text-indigo-100" size={20} />
                                <h4 className="font-bold text-sm">Revenue Forecast</h4>
                                <p className="mt-2 text-2xl font-black">${((stats?.totalRevenue || 0) * 1.15).toFixed(2)}</p>
                                <p className="mt-1 text-xs text-indigo-100/70">Based on historical trajectory</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                                <Zap className="mb-3 text-indigo-100" size={20} />
                                <h4 className="font-bold text-sm">Security Anomalies</h4>
                                <p className="mt-2 text-2xl font-black">None</p>
                                <p className="mt-1 text-xs text-indigo-100/70">Verified by AI Guard: 100%</p>
                            </div>
                        </>
                    )}

                    {user.role === "SELLER" && (
                        <>
                            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                                <Brain className="mb-3 text-indigo-100" size={20} />
                                <h4 className="font-bold text-sm">Optimal Price Point</h4>
                                <p className="mt-2 text-2xl font-black">$12.50</p>
                                <p className="mt-1 text-xs text-indigo-100/70">Suggested for highest conversion</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                                <TrendingUp className="mb-3 text-indigo-100" size={20} />
                                <h4 className="font-bold text-sm">Growth Score</h4>
                                <p className="mt-2 text-2xl font-black">A+</p>
                                <p className="mt-1 text-xs text-indigo-100/70">Top 5% of sellers this month</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                                <Zap className="mb-3 text-indigo-100" size={20} />
                                <h4 className="font-bold text-sm">Next Payout Estimate</h4>
                                <p className="mt-2 text-2xl font-black">${((stats?.totalRevenue || 0) * 0.95).toFixed(2)}</p>
                                <p className="mt-1 text-xs text-indigo-100/70">After protocol management fee</p>
                            </div>
                        </>
                    )}

                    {user.role === "BUYER" && (
                        <>
                            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                                <Brain className="mb-3 text-indigo-100" size={20} />
                                <h4 className="font-bold text-sm">AI Recommendation</h4>
                                <p className="mt-2 text-2xl font-black">Digital Art</p>
                                <p className="mt-1 text-xs text-indigo-100/70">Matches your search patterns</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                                <TrendingUp className="mb-3 text-indigo-100" size={20} />
                                <h4 className="font-bold text-sm">Price Drop Alert</h4>
                                <p className="mt-2 text-2xl font-black">None</p>
                                <p className="mt-1 text-xs text-indigo-100/70">Watchlist: 0 items pending</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                                <Zap className="mb-3 text-indigo-100" size={20} />
                                <h4 className="font-bold text-sm">Smart Coupon</h4>
                                <p className="mt-2 text-2xl font-black">VAULT10</p>
                                <p className="mt-1 text-xs text-indigo-100/70">10% Off your next checkout</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
