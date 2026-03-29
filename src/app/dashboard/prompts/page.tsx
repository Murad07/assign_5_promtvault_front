"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, FileText, Loader2, Upload, Search, ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";

export default function PromptsDashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

    // Filter & Pagination State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const uploadData = new FormData();
            uploadData.append("file", file);
            uploadData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: uploadData,
            });
            const data = await res.json();

            if (data.secure_url) {
                setFormData(prev => ({ ...prev, outputPreview: data.secure_url }));
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed. Please try again or paste a URL.");
        } finally {
            setIsUploading(false);
        }
    };

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "IMAGES",
        price: 0,
        outputPreview: "",
        secretPrompt: "",
    });

    const endpoint = user?.role === "SELLER" ? "/prompts/my-prompts" : "/prompts";

    const { data: promptsData, isLoading, isError } = useQuery({
        queryKey: ["dashboard-prompts", user?.role],
        queryFn: () => fetchWithAuth(endpoint),
        enabled: !!user,
    });

    const saveMutation = useMutation({
        mutationFn: (payload: any) => {
            if (editingId) {
                return fetchWithAuth(`/prompts/${editingId}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
            }
            return fetchWithAuth("/prompts", {
                method: "POST",
                body: JSON.stringify(payload),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard-prompts"] });
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            fetchWithAuth(`/prompts/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard-prompts"] });
        },
    });

    const openModal = (prompt?: any) => {
        if (prompt) {
            setEditingId(prompt.id);
            setFormData({
                title: prompt.title || "",
                description: prompt.description || "",
                category: prompt.category || "IMAGES",
                price: prompt.price || 0,
                outputPreview: prompt.outputPreview || "",
                secretPrompt: prompt.secretPrompt || "",
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                description: "",
                category: "IMAGES",
                price: 0,
                outputPreview: "",
                secretPrompt: "",
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate({
            ...formData,
            price: Number(formData.price),
        });
    };

    if (!user) return null;

    // Filter & Paginate logic
    const allPrompts = promptsData?.data || [];

    // Reset to page 1 when search/filter/itemsPerPage changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterCategory, itemsPerPage]);

    const filteredPrompts = allPrompts.filter((prompt: any) => {
        const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "ALL" || prompt.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPrompts = filteredPrompts.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {user.role === "SELLER" ? "My Prompts" : "Manage Prompts"}
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {user.role === "SELLER"
                            ? "Create and manage your premium prompt listings natively."
                            : "Approve or moderate marketplace prompts."}
                    </p>
                </div>
                {user.role === "SELLER" && (
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                    >
                        <Plus size={16} />
                        Add New Prompt
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search prompts by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="py-2 px-4 border border-neutral-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white sm:max-w-xs"
                >
                    <option value="ALL">All Categories</option>
                    <option value="IMAGES">Midjourney Images</option>
                    <option value="CODING">Software Engineering</option>
                    <option value="MARKETING">SEO & Marketing</option>
                    <option value="WRITING">Business Strategy</option>
                </select>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : isError ? (
                    <div className="p-8 text-center text-red-500">
                        Failed to load prompts. Please try again.
                    </div>
                ) : (promptsData?.data?.length === 0 || !promptsData?.data) ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                            <FileText className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">No Prompts Found</h3>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {user.role === "SELLER" ? "You haven't listed any prompts yet." : "No prompts available."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">Title & Description</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {paginatedPrompts.map((prompt: any) => (
                                    <tr key={prompt.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-neutral-900 dark:text-white line-clamp-1">{prompt.title}</div>
                                            <div className="text-sm text-neutral-500 line-clamp-1 mt-1 dark:text-neutral-400">{prompt.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                {prompt.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-neutral-900 dark:text-emerald-400 text-sm">
                                                ${prompt.price.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {prompt.isBlocked ? (
                                                <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                    Blocked
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-emerald-100 px-2 text-xs font-semibold leading-5 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.role === "SELLER" && (
                                                    <button
                                                        onClick={() => openModal(prompt)}
                                                        className="rounded-md p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setDeleteTarget({ id: prompt.id, title: prompt.title })}
                                                    className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Delete Prompt"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="py-1.5 px-3 border border-neutral-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white text-sm"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </select>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap hidden sm:block">
                            Showing <span className="font-semibold text-neutral-900 dark:text-white">
                                {filteredPrompts.length > 0 ? startIndex + 1 : 0}
                            </span> to <span className="font-semibold text-neutral-900 dark:text-white">
                                {Math.min(startIndex + itemsPerPage, filteredPrompts.length)}
                            </span> of <span className="font-semibold text-neutral-900 dark:text-white">
                                {filteredPrompts.length}
                            </span> results
                        </div>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1 rounded-md text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1 rounded-md text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-neutral-900 max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-neutral-200 p-6 dark:border-neutral-800">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                {editingId ? "Edit Prompt Integration" : "Create New Prompt"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Prompt Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white sm:text-sm"
                                        placeholder="e.g. 8k Ultra-Realistic Marketing..."
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="block w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white sm:text-sm"
                                    >
                                        <option value="IMAGES">Midjourney/Dall-E (Images)</option>
                                        <option value="MARKETING">Marketing & SEO</option>
                                        <option value="CODING">Coding & Software</option>
                                        <option value="WRITING">Creative Writing</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Price ($)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value as any })}
                                        className="block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white sm:text-sm"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Public Description</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white sm:text-sm"
                                        placeholder="Describe what your prompt generates to the buyers..."
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Output Preview (Link or Upload)</label>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            required
                                            type="url"
                                            value={formData.outputPreview}
                                            onChange={(e) => setFormData({ ...formData, outputPreview: e.target.value })}
                                            className="block w-full flex-1 rounded-lg border border-neutral-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white sm:text-sm"
                                            placeholder="Paste URL (e.g. Google Drive, Imgur)"
                                        />
                                        <div className="relative shrink-0">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                disabled={isUploading}
                                            />
                                            <button
                                                type="button"
                                                disabled={isUploading}
                                                className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 transition-colors h-[38px]"
                                            >
                                                {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                                {isUploading ? "Uploading..." : "Upload Image"}
                                            </button>
                                        </div>
                                    </div>
                                    {formData.outputPreview && (
                                        <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium break-all">
                                            ✓ Active Preview URL: {formData.outputPreview}
                                        </div>
                                    )}
                                </div>

                                {/* Secret Prompt is only editable by the Seller */}
                                {user.role === "SELLER" && (
                                    <div className="col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                            Secret Prompt (Hidden Delivery)
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.secretPrompt}
                                            onChange={(e) => setFormData({ ...formData, secretPrompt: e.target.value })}
                                            className="block w-full rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-2 focus:border-indigo-600 focus:ring-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-white sm:text-sm"
                                            placeholder="Paste the exact mechanical prompt framework to deliver..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saveMutation.isPending}
                                    className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-neutral-900"
                                >
                                    {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingId ? "Update Prompt" : "Publish Prompt"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-4 text-red-600 dark:text-red-400 mb-4">
                            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                                <ShieldAlert size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Delete Prompt</h2>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 font-medium">
                            Are you strictly sure you want to permanently delete prompt <span className="font-bold text-neutral-900 dark:text-white">{deleteTarget.title}</span>? This action perfectly bypasses all recovery structures and cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-5 py-2.5 rounded-xl font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Cancel Action
                            </button>
                            <button
                                onClick={() => {
                                    deleteMutation.mutate(deleteTarget.id);
                                    setDeleteTarget(null);
                                }}
                                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-500/20 transition-all dark:bg-red-600 dark:hover:bg-red-700 active:scale-95 flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Permanently Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
