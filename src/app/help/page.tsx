"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, LifeBuoy, CreditCard, UserCheck, ShieldAlert, Sparkles } from "lucide-react";

export default function HelpPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            category: "General",
            icon: LifeBuoy,
            questions: [
                { q: "What is PromptVault?", a: "PromptVault is a curated marketplace where you can buy and sell high-quality AI prompts for platforms like Midjourney, ChatGPT, and Claude." },
                { q: "Do I own the prompts I buy?", a: "Yes, once purchased, you have a perpetual license to use the prompt for your personal or commercial projects. However, you cannot resell the prompt itself on this or other marketplaces." },
            ]
        },
        {
            category: "Payments",
            icon: CreditCard,
            questions: [
                { q: "How do I get paid as a seller?", a: "Your earnings are accumulated in your Seller Dashboard. You can withdraw them via your linked bank account or PayPal. Withdrawals are processed within 2-5 business days." },
                { q: "What is the processing fee?", a: "PromptVault maintains a transparent 5% processing fee on seller earnings to cover platform maintenance and curation. You keep 95% of your sales!" },
            ]
        },
        {
            category: "Account & Safety",
            icon: ShieldAlert,
            questions: [
                { q: "How do you ensure prompt quality?", a: "Every prompt submitted is tested by our AI experts. We verify that it actually produces the results shown in the preview images before approving it for sale." },
                { q: "Can I use Google to login?", a: "Absolutely! We support secure Google Social Auth for both buyers and sellers for a seamless experience." },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-bold leading-7 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Help Center</h2>
                    <p className="mt-2 text-4xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
                        How can we help?
                    </p>

                    {/* Search Bar */}
                    <div className="mt-10 relative max-w-md mx-auto">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white shadow-lg shadow-indigo-500/5 text-sm"
                            placeholder="Search for articles, guides..."
                        />
                    </div>
                </div>

                {/* FAQ Sections */}
                <div className="mx-auto mt-20 max-w-3xl space-y-16">
                    {faqs.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900/40">
                                    <section.icon size={20} />
                                </div>
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white">{section.category}</h3>
                            </div>

                            <div className="space-y-4">
                                {section.questions.map((faq, idx) => {
                                    const globalIdx = sectionIdx * 10 + idx;
                                    const isOpen = openIndex === globalIdx;

                                    return (
                                        <div
                                            key={idx}
                                            className={`rounded-2xl border transition-all duration-300 ${isOpen
                                                ? 'border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-950/20'
                                                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                                                }`}
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                                                className="w-full flex items-center justify-between p-5 text-left"
                                            >
                                                <span className="text-sm font-bold text-neutral-900 dark:text-white">{faq.q}</span>
                                                {isOpen ? <ChevronUp className="h-4 w-4 text-indigo-500" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                                            </button>
                                            {isOpen && (
                                                <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                        {faq.a}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 rounded-3xl bg-indigo-600 p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles size={120} />
                    </div>
                    <h3 className="text-2xl font-black mb-4">Still need assistance?</h3>
                    <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Our support team is available 24/7 to help you with any technical or billing issues.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/contact" className="px-8 py-3 bg-white text-indigo-600 rounded-full font-black text-sm hover:bg-neutral-100 transition-all active:scale-95 shadow-lg">
                            Open a Ticket
                        </a>
                        <button
                            className="px-8 py-3 bg-indigo-500 text-white rounded-full font-black text-sm hover:bg-indigo-400 transition-all border border-indigo-400/30"
                            onClick={() => {
                                // Close FAQ and scroll to top for Vaulty integration? 
                                // Or we just guide them to the floating assistant
                            }}
                        >
                            Talk to Vaulty AI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
