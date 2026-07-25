import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-20 overflow-hidden">
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center justify-center lg:justify-start gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-600">
            <Sparkles size={16} />
            Fast • Secure • Simple
          </div>

          <h1 className="mt-8 text-4xl md:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Shorten, protect and track
            <span className="block text-indigo-600">every link you share.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Linksy makes it easy to create memorable short links with custom aliases, password protection, expiration dates, and built-in analytics.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-900 transition hover:border-indigo-500 hover:text-indigo-600 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Brandable aliases</p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">Create links your audience remembers.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Analytics built in</p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">Track clicks, locations, and devices instantly.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111118]">
            <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-5 dark:bg-white/5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-500">Live preview</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your dashboard in action</p>
              </div>
              <div className="rounded-2xl bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-700">Beta</div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Links created</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">1,248</p>
                  </div>
                  <div className="text-sm text-indigo-600">+18%</div>
                </div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm text-slate-500 dark:text-slate-400">Clicks this week</p>
                <div className="mt-3 flex items-end gap-2">
                  {[40, 32, 52, 45, 62, 55, 70].map((height, index) => (
                    <span key={index} className="block w-2 rounded-full bg-indigo-500" style={{ height: `${(height / 100) * 48}px` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-[#111118] dark:text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <span>Ready-to-share link</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-white/80">Published</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-medium text-slate-900 dark:text-white">lnky.io/demo</span>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-white/10">
                  <ShieldCheck size={14} /> Secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}