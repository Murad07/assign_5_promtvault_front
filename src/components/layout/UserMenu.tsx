"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
    User,
    LayoutDashboard,
    LogOut,
    Settings,
    ChevronDown,
    ShieldCheck,
    ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserMenu() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                    isOpen && "ring-2 ring-indigo-500/20 dark:ring-indigo-400/20"
                )}
            >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                    <User size={14} />
                </div>
                <span className="max-w-[80px] truncate text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    {user.name}
                </span>
                <ChevronDown
                    size={14}
                    className={cn("text-neutral-400 transition-transform duration-200", isOpen && "rotate-180")}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                className={cn(
                    "absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-950",
                    isOpen
                        ? "pointer-events-auto scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0"
                )}
            >
                {/* Header */}
                <div className="border-b border-neutral-100 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Active Account
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                        <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
                            {user.name}
                        </p>
                        <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                            {user.role}
                        </span>
                    </div>
                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {user.email}
                    </p>
                </div>

                {/* Body Links */}
                <div className="p-1.5">
                    <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                        <LayoutDashboard size={16} className="text-neutral-400" />
                        Dashboard
                    </Link>
                    {user.role === "ADMIN" && (
                        <Link
                            href="/dashboard/users"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                            <ShieldCheck size={16} className="text-neutral-400" />
                            Admin Panel
                        </Link>
                    )}
                    <Link
                        href="/dashboard/orders"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                        <ShoppingBag size={16} className="text-neutral-400" />
                        My Orders
                    </Link>
                    <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                        <Settings size={16} className="text-neutral-400" />
                        Settings
                    </Link>
                </div>

                {/* Footer */}
                <div className="border-t border-neutral-100 p-1.5 dark:border-neutral-800">
                    <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        <LogOut size={16} />
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}
