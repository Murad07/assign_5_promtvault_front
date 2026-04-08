"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, ShieldCheck, Loader2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await fetchWithAuth("/contact", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-bold leading-7 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Get in touch</h2>
                    <p className="mt-2 text-4xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
                        We'd love to hear from you
                    </p>
                    <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                        Have questions about a prompt or interested in partnership? Our team is always here to help you scale with AI.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="flex gap-x-6 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 transition-all hover:border-indigo-500/50">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Email Us</h3>
                                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Our team usually responds within 2 hours.</p>
                                <p className="mt-2 text-indigo-600 dark:text-indigo-400 font-bold">murad.pi22@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex gap-x-6 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 transition-all hover:border-indigo-500/50">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                                <Phone className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Phone Support</h3>
                                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Available Mon-Fri, 9am - 6pm (BST).</p>
                                <p className="mt-2 text-indigo-600 dark:text-indigo-400 font-bold">+8801927574610</p>
                            </div>
                        </div>

                        <div className="flex gap-x-6 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 transition-all hover:border-indigo-500/50">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Our Headquarters</h3>
                                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Dhaka, Bangladesh.</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="relative rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm overflow-hidden">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in-95 duration-500">
                                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white">Message Received!</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Thank you for reaching out. We've saved your message to our vault.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-sm font-bold text-indigo-600 hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Subject</label>
                                    <select
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option>General Inquiry</option>
                                        <option>Become a Seller</option>
                                        <option>Technical Support</option>
                                        <option>Partnership</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 p-4 text-sm font-black text-white hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send size={18} /> Send Message</>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
