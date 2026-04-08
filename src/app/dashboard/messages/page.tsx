"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import { Mail, Calendar, CheckCircle, MessageSquare, Loader2, AlertCircle, Trash2 } from "lucide-react";

export default function AdminMessagesPage() {
    const queryClient = useQueryClient();

    const { data: messages, isLoading, isError } = useQuery({
        queryKey: ["admin-messages"],
        queryFn: async () => {
            const res = await fetchWithAuth("/contact");
            return res.data;
        },
    });

    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            return await fetchWithAuth(`/contact/${id}/read`, {
                method: "PATCH",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] text-red-500">
                <AlertCircle size={40} className="mb-2" />
                <p>Failed to load messages</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-neutral-900 dark:text-white">Support Messages</h1>
                    <p className="text-sm text-neutral-500">View and manage latest inquiries from your users.</p>
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-neutral-500">{messages?.length || 0} Total</span>
                </div>
            </div>

            <div className="grid gap-4">
                {messages && messages.length > 0 ? (
                    messages.map((msg: any) => (
                        <div
                            key={msg.id}
                            className={`group relative p-5 rounded-2xl border transition-all duration-300 ${msg.isRead
                                    ? 'bg-white/50 dark:bg-neutral-900/40 border-neutral-100 dark:border-neutral-800'
                                    : 'bg-white dark:bg-neutral-900 border-indigo-500/20 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/5'
                                }`}
                        >
                            {/* Action Buttons - Top Right (Professional & Small) */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!msg.isRead && (
                                    <button
                                        onClick={() => markReadMutation.mutate(msg.id)}
                                        disabled={markReadMutation.isPending}
                                        title="Mark as read"
                                        className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-100 dark:border-indigo-800"
                                    >
                                        <CheckCircle size={16} />
                                    </button>
                                )}
                                <a
                                    href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                    title="Reply via Email"
                                    className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all border border-neutral-200 dark:border-neutral-700"
                                >
                                    <Mail size={16} />
                                </a>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${msg.isRead
                                            ? 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500'
                                            : 'bg-indigo-600 text-white'
                                        }`}>
                                        {msg.subject}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>

                                <div className="pr-16">
                                    <h3 className="text-sm font-black text-neutral-900 dark:text-white">
                                        {msg.name} <span className="font-normal text-neutral-400 ml-1 opacity-60">({msg.email})</span>
                                    </h3>
                                    <div className="mt-3 relative">
                                        <p className={`text-sm leading-relaxed ${msg.isRead ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-700 dark:text-neutral-300 font-medium'}`}>
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 text-center bg-neutral-50/50 dark:bg-neutral-900/20">
                        <MessageSquare size={40} className="text-neutral-200 dark:text-neutral-800 mb-4" />
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">Vault is Empty</h3>
                        <p className="text-sm text-neutral-500 max-w-[200px] mx-auto mt-1">No user messages found in the system yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
