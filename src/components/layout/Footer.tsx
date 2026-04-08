"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

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
                            <a href="https://github.com/Murad07" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 Transition-colors">
                                <span className="sr-only">GitHub</span>
                                <Github size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/murad-pi22/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 Transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">Product</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/prompts" className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors">
                                    Explore Prompts
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors">
                                    Seller Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">Company</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/about" className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/help" className="text-sm text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors">
                                    Help & Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">Contact Us</h3>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                <Mail size={14} className="text-indigo-500" />
                                murad.pi22@gmail.com
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                <MapPin size={14} className="text-indigo-500" />
                                Dhaka, Bangladesh
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                <Phone size={14} className="text-indigo-500" />
                                +8801927574610
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
