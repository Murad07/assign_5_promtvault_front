"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2, Store, ShoppingBag, ShieldCheck } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [googleRole, setGoogleRole] = useState<'BUYER' | 'SELLER'>('BUYER');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const { login, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    const loginMutation = useMutation({
        mutationFn: async () => {
            return await fetchWithAuth("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
        },
        onSuccess: (data) => {
            login(data.data.user, data.data.token);
            router.push("/dashboard");
        },
    });

    const googleLoginMutation = useMutation({
        mutationFn: async (credential: string) => {
            return await fetchWithAuth("/auth/google-login", {
                method: "POST",
                body: JSON.stringify({ idToken: credential, role: googleRole }),
            });
        },
        onSuccess: (data) => {
            login(data.data.user, data.data.token);
            router.push("/dashboard");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate();
    };

    const isGoogleButtonDisabled = googleRole === 'SELLER' && !termsAccepted;

    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        Enter your credentials to access PromptVault
                    </p>
                </div>

                {(loginMutation.isError || googleLoginMutation.isError) && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>
                            {(loginMutation.error as any)?.message ||
                                (googleLoginMutation.error as any)?.message ||
                                "Authentication failed"}
                        </p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                className="block w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:text-sm"
                                placeholder="developer@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loginMutation.isPending || googleLoginMutation.isPending}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="block w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loginMutation.isPending || googleLoginMutation.isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loginMutation.isPending || !email || !password || googleLoginMutation.isPending}
                            className="group relative flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-neutral-900 shadow-lg shadow-indigo-500/25"
                        >
                            {loginMutation.isPending ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                "Sign in"
                            )}
                        </button>

                        <div className="flex flex-col gap-3">
                            <div className="relative flex items-center justify-center py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-neutral-200 dark:border-neutral-800"></span>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase">
                                    <span className="bg-white px-2 text-neutral-400 dark:bg-neutral-950 font-bold tracking-widest leading-none">Or continue with Google as</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setGoogleRole('BUYER')}
                                    className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all ${googleRole === 'BUYER'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                                            : 'border-neutral-100 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 hover:border-neutral-200'
                                        }`}
                                >
                                    <ShoppingBag size={18} className={googleRole === 'BUYER' ? 'text-indigo-600' : ''} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Buyer</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGoogleRole('SELLER')}
                                    className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 transition-all ${googleRole === 'SELLER'
                                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                                            : 'border-neutral-100 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 hover:border-neutral-200'
                                        }`}
                                >
                                    <Store size={18} className={googleRole === 'SELLER' ? 'text-emerald-600' : ''} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Seller</span>
                                </button>
                            </div>

                            {/* Terms for Google Sellers */}
                            {googleRole === 'SELLER' && (
                                <div className="p-3 mb-2 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                                    <input
                                        type="checkbox"
                                        id="google-terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="mt-1 h-3.5 w-3.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <label htmlFor="google-terms" className="text-[10px] text-amber-800 dark:text-amber-400 leading-tight select-none">
                                        As a Seller, I agree to the <span className="underline cursor-pointer">Terms & Conditions</span> and the 5% marketplace processing fee.
                                    </label>
                                </div>
                            )}

                            <div className={`flex justify-center transition-all ${isGoogleButtonDisabled ? 'opacity-40 grayscale pointer-events-none' : 'hover:scale-[1.02] active:scale-[0.98]'}`}>
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        if (credentialResponse.credential) {
                                            googleLoginMutation.mutate(credentialResponse.credential);
                                        }
                                    }}
                                    onError={() => {
                                        console.error("Google Login Failed");
                                    }}
                                    useOneTap={false}
                                    shape="circle"
                                    theme={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline'}
                                />
                            </div>
                            {isGoogleButtonDisabled && (
                                <p className="text-[9px] text-center text-amber-600 font-semibold animate-pulse">
                                    Please accept seller terms to proceed
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-neutral-200 dark:border-neutral-800"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 font-bold">Quick Access</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setEmail("roni@gmail.com");
                                setPassword("roni123");
                                setTimeout(() => loginMutation.mutate(), 100);
                            }}
                            className="flex w-full justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 transition-all active:scale-95"
                        >
                            Demo Login (Roni)
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Sign up today
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
