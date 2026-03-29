"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, TrendingUp, CheckCircle, XCircle, Clock, Loader2, DollarSign } from "lucide-react";

export default function WithdrawalsDashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [payoutAddress, setPayoutAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState<{ title: string; message: string; type: "error" | "success" | "warning" } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch Withdrawals
    const { data: withdrawalsData, isLoading } = useQuery({
        queryKey: ["withdrawals", user?.role],
        queryFn: async () => {
            const res = await fetchWithAuth("/withdrawals");
            return res.data;
        },
    });

    const requestMutation = useMutation({
        mutationFn: async (amount: number) => {
            setIsSubmitting(true);
            return await fetchWithAuth("/withdrawals", {
                method: "POST",
                body: JSON.stringify({ amount, payoutAddress }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
            setWithdrawAmount("");
            setIsSubmitting(false);
            setAlertMessage({ title: "Transfer Requested", message: "Withdrawal correctly logged! Awaiting Administrator mapping.", type: "success" });
        },
        onError: (err: any) => {
            setIsSubmitting(false);
            setAlertMessage({ title: "Transfer Failed", message: err.message || "Failed natively to request withdrawal.", type: "error" });
        }
    });

    const approveMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) => {
            return await fetchWithAuth(`/withdrawals/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
        },
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage, withdrawalsData]);

    const handleRequest = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = Number(withdrawAmount);
        const availableBalance = withdrawalsData?.availableBalance || 0;

        if (amount < 10) {
            return setAlertMessage({ title: "Invalid Limit", message: "Minimum withdrawal constraint is $10 natively.", type: "warning" });
        }
        if (!payoutAddress.trim()) {
            return setAlertMessage({ title: "Destination Missing", message: "Please provide a valid PayPal Email or Bank Target natively.", type: "warning" });
        }
        if (amount > availableBalance) {
            return setAlertMessage({ title: "Insufficient Balance", message: `You only have $${availableBalance.toFixed(2)} available for withdrawal.`, type: "error" });
        }

        requestMutation.mutate(amount);
    };

    if (isLoading) return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;

    const withdrawals = withdrawalsData?.items || [];
    const availableBalance = withdrawalsData?.availableBalance || 0;

    const platformRevenue = user?.role === "ADMIN"
        ? withdrawals.filter((w: any) => w.status === "APPROVED").reduce((acc: number, curr: any) => acc + curr.fee, 0)
        : 0;

    // Pagination Logic
    const totalPages = Math.ceil(withdrawals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedWithdrawals = withdrawals.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                            <Wallet className="h-8 w-8 text-emerald-500" />
                            {user?.role === "ADMIN" ? "Platform Payouts" : "My Withdrawals"}
                        </h1>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                            {user?.role === "ADMIN" ? "Manage and orchestrate structured payout constraints securely." : "Request pipeline transitions directly to your bank globally."}
                        </p>
                    </div>
                    {user?.role === "ADMIN" && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-xl px-5 py-3 flex flex-col items-end sm:items-start shadow-sm">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-400 flex items-center gap-1.5">
                                <TrendingUp size={14} /> Total Profit (5% Fees)
                            </span>
                            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-500">+${platformRevenue.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                {user?.role === "SELLER" && (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                                <ArrowUpRight className="h-5 w-5 text-indigo-500" />
                                Request New Payout
                            </h2>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl px-4 py-2">
                                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Available Balance: </span>
                                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">${availableBalance.toFixed(2)}</span>
                            </div>
                        </div>
                        <form onSubmit={handleRequest} className="p-6 flex flex-col sm:flex-row gap-4 items-end">
                            <div className="w-full sm:max-w-xs">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Requested Amount ($)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><DollarSign size={16} /></span>
                                    <input
                                        type="number"
                                        min="10"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="w-full sm:max-w-xs">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Target Address</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={payoutAddress}
                                        onChange={(e) => setPayoutAddress(e.target.value)}
                                        placeholder="PayPal / Bank IBAN"
                                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !withdrawAmount || Number(withdrawAmount) < 10}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request Transfer"}
                            </button>
                        </form>
                        <div className="px-6 pb-6 pt-0 text-sm text-neutral-500 dark:text-neutral-400">
                            PromptVault extracts a dynamic 5% platform pipeline fee explicitly on all withdrawal volumes seamlessly. Minimum constraint: $10.00.
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300">
                                <tr>
                                    {user?.role === "ADMIN" && <th className="px-6 py-4 font-medium">Native Seller Target</th>}
                                    <th className="px-6 py-4 font-medium">Destination Routing</th>
                                    <th className="px-6 py-4 font-medium">Net Value</th>
                                    <th className="px-6 py-4 font-medium">Platform Fee (5%)</th>
                                    <th className="px-6 py-4 font-medium">Status Array</th>
                                    <th className="px-6 py-4 font-medium">Date Tracked</th>
                                    {user?.role === "ADMIN" && <th className="px-6 py-4 font-medium text-right">Approval Mapping</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {withdrawals.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">No structured payout arrays successfully detected natively.</td>
                                    </tr>
                                ) : (
                                    paginatedWithdrawals.map((w: any) => (
                                        <tr key={w.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                            {user?.role === "ADMIN" && (
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-neutral-900 dark:text-white">{w.seller?.name || 'Native Pipeline'}</div>
                                                    <div className="text-xs text-neutral-500">{w.seller?.email || 'N/A'}</div>
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex max-w-[12rem] truncate rounded bg-neutral-100 px-2 py-1 font-mono text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400" title={w.payoutAddress}>
                                                    {w.payoutAddress || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">${w.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400">+${w.fee.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${w.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    w.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}>
                                                    {w.status === 'APPROVED' ? <CheckCircle size={14} /> : w.status === 'REJECTED' ? <XCircle size={14} /> : <Clock size={14} />}
                                                    {w.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(w.createdAt).toLocaleDateString()}
                                            </td>
                                            {user?.role === "ADMIN" && (
                                                <td className="px-6 py-4 text-right">
                                                    {w.status === "PENDING" ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => approveMutation.mutate({ id: w.id, status: "APPROVED" })}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 transition-colors"
                                                            >
                                                                Auth
                                                            </button>
                                                            <button
                                                                onClick={() => approveMutation.mutate({ id: w.id, status: "REJECTED" })}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                                                            >
                                                                Drop
                                                            </button>
                                                        </div>
                                                    ) : <span className="text-xs text-neutral-400">Finalized</span>}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                                    Rows per page:
                                </span>
                                <select
                                    className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                                    Showing {withdrawals.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, withdrawals.length)} of {withdrawals.length}
                                </span>
                            </div>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 px-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Alert Modal Overlay */}
            {alertMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${alertMessage.type === "success" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            alertMessage.type === "warning" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                                "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                            {alertMessage.type === "success" ? <CheckCircle size={28} /> : alertMessage.type === "warning" ? <Clock size={28} /> : <XCircle size={28} />}
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{alertMessage.title}</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">{alertMessage.message}</p>
                        <button
                            onClick={() => setAlertMessage(null)}
                            className="w-full rounded-xl bg-neutral-100 px-4 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                        >
                            Acknowledge
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
