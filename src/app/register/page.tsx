"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Loader2, Key } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");

    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    const registerMutation = useMutation({
        mutationFn: async () => {
            return await fetchWithAuth("/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password, role }),
            });
        },
        onSuccess: () => {
            // Auto-redirect to login after successful register
            router.push("/login?registered=success");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) return;
        registerMutation.mutate();
    };

    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-center">
                    <Key className="mx-auto h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                        Join PromptVault
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Start discovering and selling premium prompts
                    </p>
                </div>

                {registerMutation.isError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>{(registerMutation.error as any).message || "Failed to register"}</p>
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="grid gap-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="block w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:text-sm"
                                placeholder="Jane Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={registerMutation.isPending}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                className="block w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:text-sm"
                                placeholder="jane@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={registerMutation.isPending}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="block w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={registerMutation.isPending}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    disabled={registerMutation.isPending}
                                    onClick={() => setRole("BUYER")}
                                    className={`rounded-lg border px-4 py-2 text-sm font-medium ${role === "BUYER"
                                        ? "border-transparent bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                                        : "border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    Buyer
                                </button>
                                <button
                                    type="button"
                                    disabled={registerMutation.isPending}
                                    onClick={() => setRole("SELLER")}
                                    className={`rounded-lg border px-4 py-2 text-sm font-medium ${role === "SELLER"
                                        ? "border-transparent bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                                        : "border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    Seller
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={registerMutation.isPending || !email || !password || !name}
                            className="group relative flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-neutral-900"
                        >
                            {registerMutation.isPending ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
