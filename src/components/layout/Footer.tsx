"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    // Hide the footer inside the Dashboard routes
    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    return (
        <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <span className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                            PromptVault
                        </span>
                        <p className="mt-4 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
                            The premium marketplace to discover, buy, and sell state-of-the-art AI prompts for Midjourney, ChatGPT, and Claude.
                        </p>
                        <div className="mt-6 flex space-x-6">
                            <a href="#" className="text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                <span className="sr-only">Twitter</span>
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                <span className="sr-only">GitHub</span>
                                <Github size={20} />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">Product</h3>
                        <ul className="mt-4 space-y-3 hidden sm:block">
                            <li>
                                <Link href="/prompts" className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400">
                                    Explore Prompts
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400">
                                    Seller Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">Company</h3>
                        <ul className="mt-4 space-y-3 hidden sm:block">
                            <li>
                                <a href="#" className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
                    <p className="text-sm text-neutral-400 xl:text-center">
                        &copy; {new Date().getFullYear()} PromptVault, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
