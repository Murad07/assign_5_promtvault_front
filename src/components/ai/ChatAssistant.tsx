"use client";

import { useState, useRef, useEffect } from "react";
import {
    MessageSquare,
    X,
    Send,
    Bot,
    Sparkles,
    Search,
    ShoppingBag,
    ExternalLink,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Message {
    role: "assistant" | "user";
    content: string;
    links?: { label: string; href: string }[];
}

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I'm Vaulty, your AI guide. Need help finding a high-quality prompt or navigating the platform?",
            links: [
                { label: "Search Prompts", href: "/prompts" },
                { label: "Pricing Categories", href: "/prompts?category=IMAGES" }
            ]
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI Thinking
        setTimeout(() => {
            const response = getAIResponse(userMsg.toLowerCase());
            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1500);
    };

    const getAIResponse = (text: string): Message => {
        if (text.includes("find") || text.includes("search") || text.includes("look")) {
            return {
                role: "assistant",
                content: "I recommend checking our Marketplace! We have categories for Images, Coding, and Writing. What specific niche are you interested in?",
                links: [{ label: "Browse All Prompts", href: "/prompts" }]
            };
        }
        if (text.includes("sell") || text.includes("seller") || text.includes("earn")) {
            return {
                role: "assistant",
                content: "Becoming a seller is easy! You just need to register an account and select the 'Seller' role. You can then upload your engineered prompts and start earning.",
                links: [{ label: "Start Selling", href: "/register" }]
            };
        }
        if (text.includes("price") || text.includes("cost") || text.includes("cheap")) {
            return {
                role: "assistant",
                content: "Our prompts vary in price, starting from as low as $4.99. You can use the price filters on our explore page to find something that fits your budget.",
                links: [{ label: "View Cheap Prompts", href: "/prompts?sortOrder=PRICE_ASC" }]
            };
        }
        if (text.includes("support") || text.includes("help") || text.includes("contact")) {
            return {
                role: "assistant",
                content: "If you need human assistance, our support team is available 24/7. You can reach out via the settings page or email us directly.",
            };
        }

        return {
            role: "assistant",
            content: "That's an interesting query! While I'm still learning, I can tell you that PromptVault is the best place to buy and sell premium AI instructions. Would you like to see our latest drops?",
            links: [{ label: "View Newest Prompts", href: "/prompts?sortOrder=NEWEST" }]
        };
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl animate-in slide-in-from-bottom-5 duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">Vaulty Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
                                        <span className="text-[10px] text-indigo-100">AI Engine Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full bg-white/10 p-1.5 hover:bg-white/20 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth hide-scrollbar bg-neutral-50/50 dark:bg-neutral-900/50"
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex flex-col gap-1 max-w-[85%]",
                                    msg.role === "user" ? "ml-auto items-end" : "items-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                        msg.role === "user"
                                            ? "bg-indigo-600 text-white rounded-tr-none"
                                            : "bg-white border border-neutral-200 text-neutral-800 rounded-tl-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                                    )}
                                >
                                    {msg.content}
                                </div>
                                {msg.links && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {msg.links.map((link, li) => (
                                            <Link
                                                key={li}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 transition-all hover:bg-indigo-100 hover:scale-105 active:scale-95 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300"
                                            >
                                                {link.label}
                                                <ExternalLink size={10} />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-neutral-400">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <Bot size={14} className="animate-bounce" />
                                </div>
                                <div className="flex gap-1">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"></span>
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0.2s]"></span>
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Input */}
                    <div className="border-t border-neutral-100 p-4 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Ask about prompts, sellers, or safety..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 bg-neutral-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:bg-neutral-900 dark:text-white"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-90 disabled:opacity-50 disabled:shadow-none"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Bubble Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
            >
                {isOpen ? (
                    <X size={28} className="animate-in fade-in zoom-in duration-300" />
                ) : (
                    <div className="relative">
                        <MessageSquare size={28} className="animate-in fade-in zoom-in duration-300" />
                        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-indigo-600 bg-emerald-500 text-[10px] font-bold">
                            1
                        </div>
                    </div>
                )}
                <div className="absolute -left-36 hidden rounded-xl bg-white px-4 py-2 text-xs font-bold text-neutral-800 shadow-xl group-hover:block dark:bg-neutral-800 dark:text-white">
                    Need help from AI? ✨
                </div>
            </button>
        </div>
    );
}
