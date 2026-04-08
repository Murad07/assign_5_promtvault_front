"use client";

import { Brain, Star, ShieldCheck, Globe, Trophy, Users } from "lucide-react";

export default function AboutPage() {
    const stats = [
        { label: "Active Prompts", value: "25,000+", icon: Brain },
        { label: "Global Sellers", value: "5,200+", icon: Users },
        { label: "Community Rating", value: "4.9/5", icon: Star },
        { label: "Years of Trust", value: "3+", icon: Trophy },
    ];

    const values = [
        {
            title: "Expert Curation",
            description: "Every prompt on our marketplace is manually vetted by our team of prompt engineers to ensure high-quality output.",
            icon: ShieldCheck,
        },
        {
            title: "Global Marketplace",
            description: "We connect creators from 150+ countries, making elite AI engineering accessible to everyone, everywhere.",
            icon: Globe,
        },
        {
            title: "Fair Revenue",
            description: "We believe in creators. That's why we take the lowest commission in the industry, giving 95% back to sellers.",
            icon: Star,
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            {/* Hero Section */}
            <div className="relative overflow-hidden py-24 sm:py-32">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),theme(colors.white))] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900/0.2),theme(colors.neutral.950))]" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
                            Empowering the <span className="text-indigo-600 dark:text-indigo-400">AI Revolution</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                            PromptVault is the world's leading marketplace for state-of-the-art AI prompts. We empower creators and businesses to unlock the full potential of Large Language Models.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700">
                                <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2" />
                                <div className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">{stat.value}</div>
                                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-bold leading-7 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Our Values</h2>
                        <p className="mt-2 text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                            Everything you need to scale with AI
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {values.map((value, i) => (
                                <div key={i} className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-bold leading-7 text-neutral-900 dark:text-white">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                            <value.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        {value.title}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-neutral-600 dark:text-neutral-400">
                                        <p className="flex-auto">{value.description}</p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Call to action */}
            <div className="bg-indigo-600">
                <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Ready to join the community?<br />Start selling your prompts today.
                        </h2>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="/register"
                                className="rounded-full bg-white px-8 py-3.5 text-sm font-black text-indigo-600 shadow-sm hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:scale-105 active:scale-95"
                            >
                                Register Now
                            </a>
                            <a href="/prompts" className="text-sm font-bold leading-6 text-white hover:underline">
                                Explore Prompts <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
