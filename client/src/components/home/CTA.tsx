import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="pb-28">

      <div className="rounded-4xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-slate-950">
        <p className="text-sm uppercase tracking-[0.35em] text-indigo-500">Ready to go live?</p>
        <h2 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">Launch better links faster.</h2>
        <p className="mt-5 text-slate-600 max-w-2xl mx-auto dark:text-slate-300">
          Start shortening, securing, and analyzing your links from one elegant dashboard.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 mt-10 rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          Get Started
        </Link>
      </div>

    </section>
  );
}