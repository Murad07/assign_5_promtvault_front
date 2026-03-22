"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader2, Star, CheckCircle2, ShoppingCart, User } from "lucide-react";

// Native fetch to Public `/prompts/:id` and `/reviews/:id`
const fetchPromptDetails = async (id: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${API_URL}/prompts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch prompt details");
    return res.json();
};

const fetchPromptReviews = async (id: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${API_URL}/reviews/${id}`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
};

export default function PromptDetailPage() {
    const params = useParams();
    const router = useRouter();
    const promptId = params.id as string;

    const { addToCart, cart } = useCart();
    const { isAuthenticated, user } = useAuth();

    // Queries
    const { data: promptData, isLoading: promptLoading, isError: promptError } = useQuery({
        queryKey: ["prompt", promptId],
        queryFn: () => fetchPromptDetails(promptId),
    });

    const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
        queryKey: ["reviews", promptId],
        queryFn: () => fetchPromptReviews(promptId),
    });

    if (promptLoading) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-neutral-500">Loading prompt details...</p>
            </div>
        );
    }

    if (promptError || !promptData?.data) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Prompt not found</h1>
                <p className="text-neutral-500 mt-2">The prompt you're looking for doesn't exist or was removed.</p>
                <Link href="/prompts" className="mt-6 text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Browse
                </Link>
            </div>
        );
    }

    const prompt = promptData.data;
    const reviews = reviewsData?.data || [];

    // Check if item already in cart
    const inCart = cart.some(item => item.id === prompt.id);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/prompts/${promptId}`);
            return;
        }

        if (user?.role !== "BUYER") {
            // Technically admin could buy, but assignment mostly focuses on BUYER journey.
            alert("Only buyers can purchase prompts!");
            return;
        }

        addToCart({
            id: prompt.id,
            title: prompt.title,
            price: prompt.price,
            category: prompt.category
        });

        router.push("/cart");
    };

    return (
        <div className="bg-neutral-50 min-h-screen dark:bg-neutral-950 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <Link href="/prompts" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to all prompts
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm dark:bg-neutral-900 dark:border-neutral-800">

                            {/* Render an output preview image if URL looks valid, otherwise a gradient block */}
                            {prompt.outputPreview && prompt.outputPreview.includes("http") ? (
                                <div className="aspect-video w-full relative bg-neutral-100 flex items-center justify-center">
                                    <img
                                        src={prompt.outputPreview}
                                        alt={prompt.title}
                                        className="object-cover w-full h-full"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video w-full bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
                                    <span className="text-4xl px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl font-bold text-indigo-700 dark:bg-black/50 dark:text-indigo-400">
                                        Preview Block
                                    </span>
                                </div>
                            )}

                            <div className="p-8">
                                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                    {prompt.category}
                                </span>

                                <h1 className="mt-4 text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                                    {prompt.title}
                                </h1>

                                <div className="mt-6 prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400">
                                    <p className="whitespace-pre-line leading-relaxed">{prompt.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                                Verified Reviews ({reviews.length})
                            </h2>

                            {reviewsLoading ? (
                                <div className="flex justify-center py-6"><Loader2 className="animate-spin text-neutral-400" /></div>
                            ) : reviews.length === 0 ? (
                                <p className="text-neutral-500 italic text-sm py-4">No reviews yet for this prompt. Be the first to try it!</p>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((review: any) => (
                                        <div key={review.id} className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold dark:bg-indigo-900/50 dark:text-indigo-400">
                                                    <User size={18} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                                                        {review.user?.name || "Verified Buyer"}
                                                    </h4>
                                                    <span className="text-xs text-neutral-400">&bull;</span>
                                                    <span className="text-xs text-neutral-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-neutral-300 dark:text-neutral-700"}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Action / Checkout block */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">

                            <div className="flex items-end justify-between border-b border-neutral-100 pb-6 dark:border-neutral-800">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1 dark:text-neutral-400">Total Price</p>
                                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white">
                                        ${prompt.price.toFixed(2)}
                                    </h2>
                                </div>
                            </div>

                            <ul className="py-6 space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle2 size={18} className="text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-neutral-600 dark:text-neutral-300">Immediate prompt delivery</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 size={18} className="text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-neutral-600 dark:text-neutral-300">Lifetime access to updates</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 size={18} className="text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-neutral-600 dark:text-neutral-300">100% money-back guarantee</span>
                                </li>
                            </ul>

                            <button
                                onClick={handleAddToCart}
                                disabled={inCart}
                                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${inCart
                                        ? "bg-neutral-100 text-neutral-500 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-400"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md focus:ring-indigo-500"
                                    }`}
                            >
                                <ShoppingCart size={18} />
                                {inCart ? "Already in Cart" : "Add to Cart"}
                            </button>

                            {!isAuthenticated && (
                                <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
                                    You will be redirected to Log In to complete purchase.
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
