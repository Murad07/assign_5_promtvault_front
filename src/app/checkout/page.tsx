"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuth } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

// Native dynamic TS Stripe Injection
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const { cart, clearCart, totalPrice } = useCart();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required", // Prevent native Stripe routing breaking SPA experience
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // STEP 2: STRIKE COMPLETED SAFELY -> Trigger API securely mapping Order natively
            try {
                const payload = { items: cart.map(item => ({ promptId: item.id })) };
                await fetchWithAuth("/orders", {
                    method: "POST",
                    body: JSON.stringify(payload)
                });

                clearCart();
                router.push("/dashboard/orders?payment=success");
            } catch (err: any) {
                setMessage("Payment succeeded, but we failed mapping the Order securely. Please contact support.");
                setIsLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement className="mb-6" />
            {message && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-sm font-semibold text-red-600">
                    {message}
                </div>
            )}
            <button
                disabled={!stripe || isLoading}
                className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold disabled:opacity-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
                {isLoading ? (
                    <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</>
                ) : (
                    <><Lock size={18} className="mr-2" /> Pay ${totalPrice.toFixed(2)}</>
                )}
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState("");
    const { totalPrice, cart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || cart.length === 0) {
            router.push("/cart");
            return;
        }

        // Fire single instantiation mapping native Stripe payloads calculating price intents natively
        fetchWithAuth("/payments/create-intent", {
            method: "POST",
            body: JSON.stringify({ amount: totalPrice }),
        })
            .then(res => setClientSecret(res.data.clientSecret))
            .catch(err => {
                console.error("Stripe Intent generation completely failed: ", err);
            });
    }, [isAuthenticated, totalPrice, cart.length, router]);

    if (!clientSecret) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950">
                <Loader2 className="animate-spin h-12 w-12 text-indigo-600 mb-4" />
                <p className="text-neutral-500 text-sm animate-pulse">Establishing encrypted connection to Stripe...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12">
            <div className="max-w-xl mx-auto px-4">

                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-8 border border-neutral-100 dark:border-neutral-800">
                    <div className="text-center mb-10">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-4 dark:bg-indigo-900/30">
                            <ShieldCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">Complete Payment</h1>
                        <p className="text-neutral-500 mt-2 text-sm">Encrypted processing secured by Stripe.</p>
                    </div>

                    {/* Inject Elements Wrapper mapping Native Stripe Objects natively */}
                    <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                        <Elements stripe={stripePromise} options={{
                            clientSecret,
                            appearance: {
                                theme: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'stripe',
                                variables: {
                                    colorPrimary: '#4f46e5',
                                }
                            }
                        }}>
                            <CheckoutForm clientSecret={clientSecret} />
                        </Elements>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mx-auto">
                    By confirming your payment, you agree to our Terms of Service and acknowledge all digital transactions are fully final.
                </p>
            </div>
        </div>
    );
}
