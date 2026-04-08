import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, Code, Image as ImageIcon, Briefcase, Star, TrendingUp } from "lucide-react";

export default async function HomePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  let allPrompts = [];
  try {
    const res = await fetch(`${API_URL}/prompts`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      allPrompts = data.data || [];
    }
  } catch (e) { }

  const latestPrompts = allPrompts.slice(0, 10);

  const categoryStats = [
    { name: "IMAGES", label: "Midjourney Images", icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "CODING", label: "Software Engineering", icon: Code, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "MARKETING", label: "SEO & Marketing", icon: Search, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "WRITING", label: "Business Strategy", icon: Briefcase, color: "text-orange-500", bg: "bg-orange-500/10" }
  ].map((cat) => ({
    ...cat,
    count: allPrompts.filter((p: any) => p.category === cat.name).length
  }));

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-neutral-950 px-4 py-20 sm:px-6 lg:px-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"></div>

        {/* Floating gradient orbs for animation */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-indigo-600/20 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-cyan-600/20 blur-[100px] [animation-delay:2s]"></div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              The #1 AI Prompt Marketplace
            </span>
            <h1 className="mt-8 text-5xl font-black tracking-tight text-white sm:text-7xl">
              Unlock the true power of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-cyan-400 animate-gradient-x">
                Generative AI
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Discover, buy, and sell state-of-the-art text and image prompts engineered by top prompt architects. Save hundreds of hours and get perfect AI outputs instantly.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/prompts"
                className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 active:scale-95"
              >
                Explore Prompts
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator for Visual Flow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-neutral-700 p-1">
            <div className="h-2 w-1 rounded-full bg-indigo-400"></div>
          </div>
        </div>
      </section>

      {/* 1.5 LATEST PROMPTS DYNAMIC SCROLL CAROUSEL */}
      {latestPrompts.length > 0 && (
        <section className="bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Trending Next-Gen Prompts
              </h2>
              <Link href="/prompts" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
                Explore Marketplace <ArrowRight size={16} />
              </Link>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory">
              {latestPrompts.map((prompt: any) => (
                <Link
                  href={`/prompts/${prompt.id}`}
                  key={prompt.id}
                  className="snap-start shrink-0 w-80 group flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden dark:bg-neutral-900 dark:border-neutral-800"
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
          </div>
        </section>
      )}

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
            {categoryStats.map((cat, idx) => (
              <Link key={idx} href={`/prompts?category=${cat.name}`} className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-500">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${cat.bg} ${cat.color} mb-4`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{cat.label}</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{cat.count} Prompts</p>
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

      {/* 5. STATISTICS SECTION */}
      <section className="bg-indigo-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {[
              { label: "Prompts Sold", value: "85K+" },
              { label: "Active Sellers", value: "1,200+" },
              { label: "Happy Customers", value: "24K+" },
              { label: "Time Saved (Avg)", value: "45hrs/mo" }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-black text-white md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-indigo-100 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE PROMPTVAULT (HIGHLIGHTS) */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                The standard for the <span className="text-indigo-600 dark:text-indigo-400">Prompt Engineering</span> economy.
              </h2>
              <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                PromptVault isn't just a directory; it's a quality-controlled ecosystem. We don't just host prompts; we ensure every single mechanical structure is tested for reliability and output fidelity.
              </p>
              <div className="mt-10 space-y-4">
                {[
                  "Verified Seller Program with manual auditing.",
                  "Zero-latency instant delivery after checkout.",
                  "Multi-model support (Claude, GPT, Gemini, Midjourney).",
                  "Secure infrastructure with Stripe and Prisma security."
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500 h-5 w-5 shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-video rounded-3xl bg-neutral-100 p-8 overflow-hidden dark:bg-neutral-800 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 animate-pulse"></div>
              <pre className="text-xs font-mono text-indigo-600 dark:text-indigo-300 pointer-events-none">
                {`{
  "prompt_id": "pv_9832",
  "fidelity": "99.8%",
  "architecture": "Mechanical Deep-Link",
  "verified": true,
  "output_check": "passed",
  "security_scan": "clean"
}`}
              </pre>
              <div className="absolute bottom-12 left-12 right-12 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="bg-neutral-50 px-4 py-24 sm:px-6 lg:px-8 dark:bg-neutral-950">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-center text-neutral-900 dark:text-white mb-16">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Can I use these prompts for commercial work?", a: "Yes, once you buy a prompt framework, you own the usage rights to the outputs generated for any project, commercial or personal." },
              { q: "What if the prompt doesn't work as advertised?", a: "Every prompt goes through a verification check. If the mechanical structure is faulty, we provide a full credit refund within 24 hours." },
              { q: "How do I receive the prompt after payment?", a: "After a successful Stripe checkout, the prompt structure will instantly appear in your Buyer Dashboard under 'My Purchases'." }
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">{item.q}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER SECTION */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 dark:bg-neutral-900">
        <div className="mx-auto max-w-5xl rounded-3xl bg-neutral-950 px-8 py-16 text-center overflow-hidden relative border border-neutral-800">
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-600/20 blur-[100px]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Get the week's best prompts.</h2>
            <p className="mt-4 text-neutral-400 mx-auto max-w-xl">
              Join 12,000+ prompt engineers receiving our weekly breakdown of meta-prompts and output variations.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full bg-white/5 border border-neutral-700 px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
              <button className="rounded-full bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-500/20">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 text-center relative overflow-hidden bg-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto max-w-3xl relative z-10">
          <h2 className="text-4xl font-black text-neutral-900 dark:text-white sm:text-6xl">Ready to automate your creative process?</h2>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
            Join the thousand of creators building the future of generative media on PromptVault.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-10 py-4 font-bold text-lg hover:scale-105 transition-all">
              Start Selling Today
            </Link>
            <Link href="/prompts" className="inline-flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 px-10 py-4 font-bold text-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
