"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Trash2, ArrowRight, Loader2, ShieldCheck, CreditCard } from "lucide-react";

export default function CartPage() {
    const { cart, removeFromCart, clearCart, totalPrice } = useCart();
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();


    const handleCheckout = () => {
        if (!isAuthenticated) {
            router.push("/login?redirect=/cart");
            return;
        }

        if (user?.role !== "BUYER") {
            alert("Only BUYER accounts can checkout items!");
            return;
        }

        // Push to Secure Stripe Checkout natively
        router.push("/checkout");
    };

    return (
        <div className="bg-neutral-50 min-h-screen dark:bg-neutral-950 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-8 tracking-tight">
                    Your Cart
                </h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                        <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 dark:bg-neutral-800">
                            <ShoppingCart className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Cart is empty</h2>
                        <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
                            You haven't added any prompts to your cart yet. Discover engineered AI structures in our marketplace.
                        </p>
                        <Link
                            href="/prompts"
                            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            Explore Prompts <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-all hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md dark:bg-indigo-900/40 dark:text-indigo-400">
                                                {item.category}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-neutral-100 sm:border-0 dark:border-neutral-800">
                                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                            ${item.price.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between items-center pt-4 pl-2">
                                <Link href="/prompts" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 dark:text-indigo-400">
                                    <ArrowRight size={14} className="rotate-180" /> Continue Shopping
                                </Link>
                                <button
                                    onClick={clearCart}
                                    className="text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Checkout Block */}
                        <div className="lg:col-span-1 border-t-2 border-dashed border-neutral-200 lg:border-t-0 lg:border-l-2 lg:pl-8 pt-8 lg:pt-0 dark:border-neutral-800">
                            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm sticky top-24 dark:bg-neutral-900 dark:border-neutral-800">
                                <h3 className="text-lg font-bold text-neutral-900 mb-6 dark:text-white">Order Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span className="font-semibold text-neutral-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                        <span>Platform Fee</span>
                                        <span className="font-semibold text-neutral-900 dark:text-white">$0.00</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-base font-bold text-neutral-900 dark:text-white">Total</span>
                                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-neutral-900"
                                >
                                    <CreditCard size={18} />
                                    Secure Stripe Checkout
                                </button>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                        <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
                                        <span>Instant access to Secret Prompts after payment verification.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
