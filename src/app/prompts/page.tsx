"use client";

import { useState, Suspense } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    Loader2,
    Search,
    Filter,
    ArrowRight,
    PackageOpen,
    Star,
    TrendingUp,
    RotateCcw,
    DollarSign
} from "lucide-react";

const fetchPublicPrompts = async ({ pageParam = 1, queryKey }: any) => {
    const [_key, { searchTerm, category, sortOrder, minPrice, maxPrice }] = queryKey;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: "10",
        searchTerm: searchTerm || "",
        category: category || "ALL",
        sortOrder: sortOrder || "NEWEST",
        minPrice: minPrice || "",
        maxPrice: maxPrice || ""
    });

    const res = await fetch(`${API_URL}/prompts?${params.toString()}`, {
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("Failed to fetch prompts");
    return res.json();
};

function PromptsInner() {
    const searchParams = useSearchParams();
    const queryCat = searchParams.get("category");

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>(queryCat || "ALL");
    const [sortOrder, setSortOrder] = useState<"NEWEST" | "PRICE_ASC" | "PRICE_DESC">("NEWEST");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["public-prompts", {
            searchTerm: searchQuery,
            category: selectedCategory,
            sortOrder,
            minPrice,
            maxPrice
        }],
        queryFn: fetchPublicPrompts,
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            if (lastPage.meta && lastPage.meta.page < lastPage.meta.totalPages) {
                return lastPage.meta.page + 1;
            }
            return undefined;
        }
    });

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("ALL");
        setSortOrder("NEWEST");
        setMinPrice("");
        setMaxPrice("");
    };

    const categories = ["ALL", "IMAGES", "MARKETING", "CODING", "WRITING"];
    const filteredPrompts = data?.pages.flatMap((page: any) => page.data) || [];

    return (
        <div className="bg-neutral-50 min-h-screen dark:bg-neutral-950 pb-24">

            {/* Header Banner */}
            <div className="bg-white border-b border-neutral-200 py-12 dark:bg-neutral-900 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                        Explore Premium Prompts
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-500 dark:text-neutral-400">
                        Discover engineered generative structures saving you countless hours of rendering iterations.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {/* Search & Filters Bar */}
                <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search by title or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white"
                            />
                        </div>

                        <div className="flex items-center gap-2 relative w-full md:w-auto">
                            <Filter className="h-5 w-5 text-neutral-400 absolute left-3 pointer-events-none" />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as any)}
                                className="w-full md:w-auto pl-10 pr-8 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-950 dark:border-neutral-700 dark:text-white appearance-none cursor-pointer"
                            >
                                <option value="NEWEST">Newest First</option>
                                <option value="PRICE_ASC">Price: Low to High</option>
                                <option value="PRICE_DESC">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        {/* Categories List */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 hide-scrollbar flex-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all uppercase tracking-wider ${selectedCategory === cat
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                                        : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    {cat === "ALL" ? "All Categories" : cat}
                                </button>
                            ))}
                        </div>

                        {/* Price Filters */}
                        <div className="flex items-center gap-2">
                            <div className="relative max-w-[100px]">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full pl-6 pr-2 py-2 text-xs rounded-lg border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <span className="text-neutral-400 text-xs">-</span>
                            <div className="relative max-w-[100px]">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full pl-6 pr-2 py-2 text-xs rounded-lg border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Reset Toggle */}
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-neutral-500 hover:text-indigo-600 transition-colors border border-dashed border-neutral-200 rounded-lg hover:border-indigo-300 dark:border-neutral-700 font-sans"
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Skeleton Loader Grid */}
                {isLoading && (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
                                <div className="aspect-[4/3] w-full bg-neutral-200 dark:bg-neutral-800" />
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <div className="h-5 w-20 bg-neutral-200 rounded dark:bg-neutral-800" />
                                        <div className="h-5 w-12 bg-neutral-200 rounded dark:bg-neutral-800" />
                                    </div>
                                    <div className="h-6 w-3/4 bg-neutral-200 rounded dark:bg-neutral-800" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-neutral-200 rounded dark:bg-neutral-800" />
                                        <div className="h-4 w-2/3 bg-neutral-200 rounded dark:bg-neutral-800" />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between">
                                        <div className="h-4 w-24 bg-neutral-200 rounded dark:bg-neutral-800" />
                                        <div className="h-4 w-4 bg-neutral-200 rounded dark:bg-neutral-800" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="text-center py-24 text-red-500">
                        Error mapping database. Please try again!
                    </div>
                )}

                {!isLoading && !isError && filteredPrompts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-neutral-200 dark:bg-neutral-800 p-4 rounded-full mb-4">
                            <PackageOpen className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No Prompts Found</h3>
                        <p className="text-neutral-500 max-w-sm mt-2">
                            We couldn't find any prompts matching your exact search pattern. Try adjusting your filters.
                        </p>
                    </div>
                )}

                {/* Prompt Cards Grid */}
                {!isLoading && !isError && filteredPrompts.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPrompts.map((prompt: any) => (
                            <Link
                                href={`/prompts/${prompt.id}`}
                                key={prompt.id}
                                className="group flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden dark:bg-neutral-900 dark:border-neutral-800"
                            >
                                <div className="aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
                                    {prompt.outputPreview ? (
                                        (() => {
                                            const url = prompt.outputPreview;
                                            const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
                                            const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
                                            const isDrive = url.includes("drive.google.com");

                                            if (isImage) {
                                                return <img src={url} alt={prompt.title} className="object-cover w-full h-full" />;
                                            } else if (isVideo) {
                                                return <video src={url} className="object-cover w-full h-full" muted loop playsInline />;
                                            } else if (isDrive) {
                                                const embedUrl = url.replace('/view', '/preview');
                                                return <iframe src={embedUrl} className="w-full h-full border-0 pointer-events-none" />;
                                            } else {
                                                return <span className="text-4xl">📎</span>;
                                            }
                                        })()
                                    ) : (
                                        <span className="text-4xl">✨</span>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                                                {prompt.category}
                                            </span>
                                            {(() => {
                                                if (prompt.reviews && prompt.reviews.length > 0) {
                                                    const avg = (prompt.reviews.reduce((a: any, c: any) => a + c.rating, 0) / prompt.reviews.length).toFixed(1);
                                                    return (
                                                        <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-1 rounded">
                                                            <Star size={12} className="fill-amber-500 text-amber-500" /> {avg}
                                                        </span>
                                                    );
                                                }
                                            })()}
                                        </div>
                                        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                                            ${prompt.price.toFixed(2)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {prompt.title}
                                    </h3>

                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">
                                        {prompt.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                                        <span className="text-xs text-neutral-500 truncate mr-2">
                                            By <span className="font-medium text-neutral-700 dark:text-neutral-300">{prompt.seller?.name || "Verified Seller"}</span>
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {prompt._count?.orderItems !== undefined && prompt._count.orderItems > 0 && (
                                                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md flex items-center gap-1">
                                                    <TrendingUp size={12} /> {prompt._count.orderItems} Sales
                                                </span>
                                            )}
                                            <ArrowRight className="h-4 w-4 text-neutral-300 group-hover:text-indigo-600 transition-colors dark:group-hover:text-indigo-400 shrink-0" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Infinite Scroll Controller */}
                {hasNextPage && (
                    <div className="mt-12 flex justify-center pb-8 border-t border-neutral-200 dark:border-neutral-800 pt-12">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="group relative shadow-sm inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-neutral-900 border border-neutral-200 transition-all hover:bg-neutral-50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={20} />
                                    Unlocking records...
                                </>
                            ) : (
                                <>
                                    Load More Results
                                    <ArrowRight className="text-neutral-400 group-hover:text-indigo-600 transition-colors dark:text-neutral-500 dark:group-hover:text-indigo-400" size={18} />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BrowsePromptsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}>
            <PromptsInner />
        </Suspense>
    );
}
