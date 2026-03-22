import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, Code, Image as ImageIcon, Briefcase, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-neutral-950 px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"></div>

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
            The #1 AI Prompt Marketplace
          </span>
          <h1 className="mt-8 text-5xl font-black tracking-tight text-white sm:text-7xl">
            Unlock the true power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Generative AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
            Discover, buy, and sell state-of-the-art text and image prompts engineered by top prompt architects. Save hundreds of hours and get perfect AI outputs instantly.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Explore Prompts <ArrowRight size={18} />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS / FEATURES SECTION */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              How PromptVault Works
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              Skip the trial-and-error. Buy guaranteed prompt frameworks that actually work.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: "Find the exact output", desc: "Search our massive library of generative AI outputs and find exactly what you are trying to build." },
              { title: "Unlock the formula", desc: "Purchase the prompt and instantly receive the mechanical text mapping responsible for generating the result." },
              { title: "Use it infinitely", desc: "Drop the secret prompt into Midjourney or Claude and generate beautiful variations in seconds." }
            ].map((step, idx) => (
              <div key={idx} className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-xl mb-6">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="bg-neutral-50 px-4 py-24 sm:px-6 lg:px-8 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Explore Top Categories
            </h2>
            <Link href="/prompts" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
              View all
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Midjourney Images", icon: ImageIcon, count: "2,400+ Prompts", color: "text-blue-500", bg: "bg-blue-500/10" },
              { name: "Software Engineering", icon: Code, count: "1,200+ Prompts", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { name: "SEO & Marketing", icon: Search, count: "850+ Prompts", color: "text-purple-500", bg: "bg-purple-500/10" },
              { name: "Business Strategy", icon: Briefcase, count: "640+ Prompts", color: "text-orange-500", bg: "bg-orange-500/10" }
            ].map((cat, idx) => (
              <Link key={idx} href={`/prompts?category=${cat.name}`} className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-500">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${cat.bg} ${cat.color} mb-4`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Trusted by AI Architects
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 text-left">
            {[
              { name: "Sarah Jenkins", role: "Creative Director", text: "PromptVault's Midjourney frameworks saved us exactly 40 hours of trial and error this month. Absolute lifesaver." },
              { name: "Marcus Chen", role: "Indie Hacker", text: "I bought a frontend React prompt structure for Claude and built my entire SaaS boilerplate in one weekend." },
              { name: "Elena Rodriguez", role: "SEO Specialist", text: "The content generation prompts are worth purely gold. My agency's traffic doubled since enforcing these structures." }
            ].map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-neutral-700 dark:text-neutral-300">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500"></div>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm">{t.name}</h4>
                    <p className="text-xs text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
