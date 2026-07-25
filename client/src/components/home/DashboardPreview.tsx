import { Lock, Copy, MoreHorizontal, Search, BarChart3 } from "lucide-react";

const links = [
  {
    original: "https://github.com/...",
    short: "github",
    clicks: "1,843",
    protected: true
  },
  {
    original: "https://learn.microsoft.com/...",
    short: "docs",
    clicks: "932",
    protected: false
  },
  {
    original: "https://openai.com/...",
    short: "chatgpt",
    clicks: "314",
    protected: true
  }
];

export function DashboardPreview() {
  return (
    <section className="pb-20">
      <div className="relative max-w-6xl mx-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#09090f]">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] p-6">
          <div>
            <p className="text-[11px] uppercase text-indigo-500 font-semibold mb-2">Dashboard</p>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Your links, <span className="text-indigo-600">all in one place.</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-300">
              Monitor link performance and keep every share secure with a compact analytics view.
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-slate-500">Live traffic</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">2.4k</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-2 py-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                Live
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-white p-2">
                <p className="text-[11px] uppercase text-slate-400">Clicks</p>
                <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">8.4k</p>
              </div>
              <div className="rounded-md bg-white p-2">
                <p className="text-[11px] uppercase text-slate-400">Links</p>
                <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">342</p>
              </div>
              <div className="rounded-md bg-white p-2">
                <p className="text-[11px] uppercase text-slate-400">Active</p>
                <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">128</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-slate-400">Search links</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Find any link instantly.</p>
                </div>
                <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-1 text-indigo-600 dark:text-indigo-300">
                  <Search size={14} />
                </div>
              </div>
              <div className="mt-3 rounded-md border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-[#111118]">
                <input
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  placeholder="Search links, aliases, or keywords"
                />
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-slate-400">Top source</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">Social media</p>
                </div>
                <div className="rounded-full bg-indigo-500/10 px-2 py-1 text-indigo-700 dark:text-indigo-300">Live</div>
              </div>
              <div className="mt-3 flex items-end gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span key={index} className="block w-2 rounded-full bg-indigo-500" style={{ height: `${12 + index * 6}px` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
            <div className="grid grid-cols-[2fr_1.2fr_80px_96px_40px] gap-4 bg-slate-50 px-4 py-3 text-[11px] uppercase text-slate-400 dark:bg-white/5">
              <span>Original URL</span>
              <span>Short link</span>
              <span>Clicks</span>
              <span>Status</span>
              <span />
            </div>
            {links.map((link) => (
              <div
                key={link.short}
                className="grid grid-cols-[2fr_1.2fr_80px_96px_40px] items-center gap-4 border-t border-slate-200 px-4 py-3 text-slate-800 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-100 dark:hover:bg-white/5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{link.original}</span>
                    {link.protected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                        <Lock size={12} /> Protected
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">lnky.io/{link.short}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-indigo-600 dark:text-indigo-300">lnky.io/{link.short}</span>
                  <Copy size={14} className="text-slate-400" />
                </div>
                <span>{link.clicks}</span>
                
                <span className="text-[10px] px-2 py-1 rounded-full w-fit border bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Active
                </span>
                <MoreHorizontal size={18} className="text-slate-400" />
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">Explore your dashboard</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">See performance at a glance and keep control of every link.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              <BarChart3 size={16} /> View analytics
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}