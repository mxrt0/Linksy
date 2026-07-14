import { Lock, Copy, MoreHorizontal } from "lucide-react";

export function DashboardPreview() {
  return (
    <section className="pb-32">

      <div className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#111118]">

        <div className="px-8 pt-8">

          <p className="text-[11px] uppercase tracking-widest text-indigo-500 font-medium mb-2">
            Dashboard
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Your links,
            <span className="text-gray-400 dark:text-white/35">
              {" "}all in one place.
            </span>
          </h2>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-3 px-8 mt-8">

          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-5 bg-gray-50 dark:bg-white/5">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Total links
            </p>

            <p className="mt-2 text-3xl font-semibold">
              12
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-5 bg-gray-50 dark:bg-white/5">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Total clicks
            </p>

            <p className="mt-2 text-3xl font-semibold">
              8,426
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-5 bg-gray-50 dark:bg-white/5">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Active links
            </p>

            <p className="mt-2 text-3xl font-semibold">
              10
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="px-8 mt-6">

          <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 h-11 flex items-center px-4 text-sm text-gray-400">
            Search links...
          </div>

        </div>

        {/* Table */}

        <div className="mx-8 mt-5 mb-8 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">

          <div className="grid grid-cols-[2fr_1.1fr_70px_80px_32px] px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">

            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Original URL
            </span>

            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Short link
            </span>

            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Clicks
            </span>

            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Status
            </span>

            <span />
          </div>

          {[
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
          ].map((link) => (
            <div
              key={link.short}
              className="grid grid-cols-[2fr_1.1fr_70px_80px_32px] items-center px-4 py-4 border-b last:border-b-0 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              <div>

                <div className="flex items-center gap-2">

                  <span className="font-medium truncate">
                    {link.original}
                  </span>

                  {link.protected && (
                    <div className="px-1.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      <Lock size={11}/>
                    </div>
                  )}

                </div>

                <p className="text-xs mt-1 text-gray-400">
                  lnky.io/{link.short}
                </p>

              </div>

              <div className="flex items-center gap-2">

                <span className="font-mono text-indigo-500">
                  lnky.io/{link.short}
                </span>

                <Copy size={14}/>
              </div>

              <span>{link.clicks}</span>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 text-[10px] text-green-500">

                <span className="w-1.5 h-1.5 rounded-full bg-green-500"/>

                Active

              </span>

              <MoreHorizontal
                size={16}
                className="text-gray-400"
              />

            </div>
          ))}

        </div>

     <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white dark:from-[#111118] to-transparent" /> 
     </div>

    </section>
  );
}