"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import { useState } from "react";
import { Copy, ShoppingBag, Eye, X, Loader2, CheckCircle2, Star, MessageSquare } from "lucide-react";

export default function OrdersDashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [reviewingPrompt, setReviewingPrompt] = useState<string | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    const endpoint = user?.role === "ADMIN" ? "/orders" : "/orders/my-orders";

    const { data: ordersData, isLoading, isError } = useQuery({
        queryKey: ["dashboard-orders", user?.role],
        queryFn: () => fetchWithAuth(endpoint),
        enabled: !!user,
    });

    const closeModal = () => {
        setSelectedOrder(null);
        setReviewingPrompt(null);
        setStatusMessage(null);
    };

    const handleCopySecret = (secret: string) => {
        navigator.clipboard.writeText(secret);
        alert("Secret prompt copied to clipboard!");
    };

    const reviewMutation = useMutation({
        mutationFn: async (payload: any) => {
            return await fetchWithAuth("/reviews", {
                method: "POST",
                body: JSON.stringify(payload)
            });
        },
        onSuccess: () => {
            setStatusMessage({ type: "success", text: "Your review was successfully published!" });
            queryClient.invalidateQueries({ queryKey: ["dashboard-orders"] });

            // Auto close professional inline success message after rendering momentarily
            setTimeout(() => {
                setReviewingPrompt(null);
                setRating(5);
                setComment("");
                setStatusMessage(null);
            }, 2000);
        },
        onError: (err: any) => {
            setStatusMessage({ type: "error", text: err.message || "Failed to publish review natively." });
        }
    });

    const submitReview = (promptId: string) => {
        if (!comment.trim()) {
            setStatusMessage({ type: "error", text: "Please provide a written comment alongside your valid stars." });
            return;
        }
        setStatusMessage(null);
        reviewMutation.mutate({ promptId, rating, comment });
    };

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {user.role === "ADMIN" ? "Platform Orders" : "Order History"}
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {user.role === "ADMIN"
                            ? "Monitor all transactions across the platform."
                            : "View your past purchases and access your secret prompts."}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : isError ? (
                    <div className="p-8 text-center text-red-500">
                        Failed to load orders. Please try again.
                    </div>
                ) : (ordersData?.data?.length === 0 || !ordersData?.data) ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                            <ShoppingBag className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">No Orders Found</h3>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {user.role === "ADMIN" ? "No orders have been placed yet." : "You haven't purchased anything yet."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Order ID</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    {user.role === "ADMIN" && <th className="px-6 py-4 font-medium">Buyer</th>}
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {ordersData.data.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        {user.role === "ADMIN" && (
                                            <td className="px-6 py-4">
                                                <div className="text-neutral-900 dark:text-white">{order.buyer?.name}</div>
                                                <div className="text-xs text-neutral-500">{order.buyer?.email}</div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.status === "COMPLETED" ? (
                                                <span className="inline-flex rounded-full bg-emerald-100 px-2 text-xs font-semibold leading-5 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-amber-100 px-2 text-xs font-semibold leading-5 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="inline-flex items-center rounded-md p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors"
                                                title="View Details & Secret Prompts"
                                            >
                                                <Eye size={18} className="mr-2" /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal Overlay */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-neutral-900 max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-neutral-200 p-6 dark:border-neutral-800">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                    Order Details
                                </h2>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    #{selectedOrder.id.toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            <div className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-4 border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800">
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Status</p>
                                    <p className="mt-1 font-semibold text-neutral-900 dark:text-white">{selectedOrder.status}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Total Paid</p>
                                    <p className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">${selectedOrder.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Purchased Items</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items?.map((item: any) => (
                                        <div key={item.id} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                                            <div className="flex gap-4 items-center mb-2">
                                                {item.prompt?.outputPreview && (
                                                    <div className="h-16 w-16 shrink-0 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center">
                                                        {(() => {
                                                            const url = item.prompt.outputPreview;
                                                            const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
                                                            const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
                                                            const isDrive = url.includes("drive.google.com");

                                                            if (isImage) {
                                                                return <img src={url} alt={item.prompt.title || "Preview"} className="h-full w-full object-cover border border-neutral-200 dark:border-neutral-800" />;
                                                            } else if (isVideo) {
                                                                return <video src={url} className="h-full w-full object-cover border border-neutral-200 dark:border-neutral-800" muted loop playsInline />;
                                                            } else if (isDrive) {
                                                                // Convert specific Native Google Drive share URLs safely mapping preview natively.
                                                                const embedUrl = url.replace('/view', '/preview');
                                                                return <iframe src={embedUrl} className="h-full w-full border-0 pointer-events-none scale-150 transform" />;
                                                            } else {
                                                                // Generic HTTP Image structural fallback
                                                                return <img src={url} alt={item.prompt.title || "Media"} className="h-full w-full object-cover" onError={(e) => { (e.target as any).style.display = 'none'; }} />;
                                                            }
                                                        })()}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-medium text-neutral-900 dark:text-white">{item.prompt?.title}</h4>
                                                    <p className="text-xs text-neutral-500 mt-1">Price: ${item.price.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            {/* Display secret prompt if available */}
                                            {item.prompt?.secretPrompt && (
                                                <div className="mt-4 rounded-md bg-indigo-50 border border-indigo-100 p-4 dark:bg-indigo-950/20 dark:border-indigo-900/50">
                                                    <div className="flex items-center justify-between mb-3 border-b border-indigo-100 dark:border-indigo-900/50 pb-2">
                                                        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                                                            <CheckCircle2 size={14} /> Secret Prompt Unlocked
                                                        </span>
                                                        <div className="flex items-center gap-2 relative">
                                                            <button
                                                                onClick={() => setReviewingPrompt(reviewingPrompt === item.prompt.id ? null : item.prompt.id)}
                                                                className="text-neutral-500 hover:text-amber-500 dark:text-neutral-400 dark:hover:text-amber-400 flex items-center gap-1 text-xs"
                                                            >
                                                                <Star size={14} /> Leave Review
                                                            </button>
                                                            <span className="text-neutral-300 dark:text-neutral-700">|</span>
                                                            <button
                                                                onClick={() => handleCopySecret(item.prompt.secretPrompt)}
                                                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 text-xs"
                                                            >
                                                                <Copy size={14} /> Copy
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-mono text-neutral-800 dark:text-neutral-300 break-words whitespace-pre-wrap selection:bg-indigo-200 dark:selection:bg-indigo-900">
                                                        {item.prompt.secretPrompt}
                                                    </p>

                                                    {/* Inline Review Form expansion natively scoped per-item */}
                                                    {reviewingPrompt === item.prompt.id && (
                                                        <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/50 animate-in fade-in slide-in-from-top-2">
                                                            <h5 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                                                <MessageSquare size={14} /> Write your review
                                                            </h5>
                                                            <div className="flex gap-1 mb-3">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <button
                                                                        key={star}
                                                                        onClick={() => setRating(star)}
                                                                        className="focus:outline-none focus:scale-110 transition-transform"
                                                                    >
                                                                        <Star size={20} className={star <= rating ? "fill-amber-400 text-amber-400" : "text-neutral-300 dark:text-neutral-600"} />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <textarea
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                                placeholder="How did this setup work for you?"
                                                                rows={3}
                                                                className="w-full text-sm rounded-lg border border-neutral-300 p-3 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:ring-indigo-800 mb-3"
                                                            />
                                                            <div className="flex justify-between items-center gap-2">
                                                                <div className="flex-1">
                                                                    {statusMessage && (
                                                                        <span className={`text-xs font-semibold flex items-center gap-1 ${statusMessage.type === "success" ? "text-emerald-500" : "text-red-500"
                                                                            }`}>
                                                                            {statusMessage.type === "success" && <CheckCircle2 size={12} />}
                                                                            {statusMessage.text}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2 shrink-0">
                                                                    <button onClick={() => { setReviewingPrompt(null); setStatusMessage(null); }} className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg dark:text-neutral-400 dark:hover:bg-neutral-800">
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => submitReview(item.prompt.id)}
                                                                        disabled={reviewMutation.isPending || statusMessage?.type === "success"}
                                                                        className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1"
                                                                    >
                                                                        {reviewMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                                                                        Publish Review
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-neutral-200 p-6 dark:border-neutral-800 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                            >
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
