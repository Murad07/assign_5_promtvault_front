"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    FileCode2,
    History,
    LogOut,
    Menu,
    X
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    // Dynamic role-based navigation links
    const getNavLinks = () => {
        const baseLinks = [
            { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        ];

        if (user.role === "ADMIN") {
            return [
                ...baseLinks,
                { name: "Manage Users", href: "/dashboard/users", icon: Users },
                { name: "All Orders", href: "/dashboard/orders", icon: ShoppingCart },
                { name: "Manage Prompts", href: "/dashboard/prompts", icon: FileCode2 },
            ];
        }

        if (user.role === "SELLER") {
            return [
                ...baseLinks,
                { name: "My Native Prompts", href: "/dashboard/prompts", icon: FileCode2 },
            ];
        }

        if (user.role === "BUYER") {
            return [
                ...baseLinks,
                { name: "Orders & Purchases", href: "/dashboard/orders", icon: History },
            ];
        }

        return baseLinks;
    };

    const navLinks = getNavLinks();

    return (
        <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900">
            {/* Mobile sidebar toggle */}
            <div className="absolute top-4 left-4 z-50 md:hidden">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="rounded-md p-2 text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Layout */}
            <aside
                className={`absolute inset-y-0 left-0 z-40 w-64 transform border-r border-neutral-200 bg-white transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-950 md:relative md:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Sidebar Header */}
                    <Link href="/" className="flex h-16 shrink-0 items-center border-b border-neutral-200 px-6 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                            PromptVault
                        </span>
                        <span className="ml-2 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                            {user.role}
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                        {navLinks.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                        : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                                        }`}
                                >
                                    <Icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-neutral-400 group-hover:text-neutral-500 dark:text-neutral-500"
                                            }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer User Card */}
                    <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
                        <div className="flex items-center w-full">
                            <div className="flex-1 truncate">
                                <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                    {user.email}
                                </p>
                            </div>
                            <button
                                onClick={logout}
                                className="ml-auto rounded-md p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                title="Log out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Render Box */}
            <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-8 dark:bg-neutral-900">
                <div className="mx-auto max-w-7xl pt-10 md:pt-0">
                    {children}
                </div>
            </main>

            {/* Mobile backdrop guard */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-neutral-900/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </div>
    );
}
