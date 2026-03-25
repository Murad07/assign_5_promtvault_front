"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { LogIn, UserPlus, ShoppingCart } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();
    const { cart } = useCart();

    // Do not render the public Navbar inside the Dashboard route
    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                            PromptVault
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link href="/prompts" className="text-sm font-medium text-neutral-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400">
                            Explore Prompts
                        </Link>
                        <Link href="/cart" className="text-sm font-medium text-neutral-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400">
                            Pricing
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            {user?.role === "BUYER" || !isAuthenticated ? (
                                <Link href="/cart" className="flex items-center text-neutral-600 hover:text-indigo-600 dark:text-neutral-300 transition-colors relative mr-4">
                                    <ShoppingCart size={22} />
                                    {cart.length > 0 && (
                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-neutral-950">
                                            {cart.length}
                                        </span>
                                    )}
                                </Link>
                            ) : null}
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                            >
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400 sm:flex"
                            >
                                <LogIn size={16} />
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                            >
                                <UserPlus size={16} />
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
