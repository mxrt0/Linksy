import { useMemo, useState } from "react";
import { useLinks } from "../../hooks/links/useLinks";
import { useAnalytics } from "../../hooks/links/useAnalytics";

export function AnalyticsPage() {
  const { links } = useLinks();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, loading } = useAnalytics(selectedId);

  const selectedLink = useMemo(() => {
    return links.find((l) => l.id === selectedId) ?? null;
  }, [links, selectedId]);

  const totalClicks = useMemo(() => {
    return links.reduce((sum, l) => sum + l.clicks, 0);
  }, [links]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2">
            Analytics
          </p>

          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Insights into your links
          </h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
            <p className="text-lg text-gray-400 dark:text-white/40">Total links</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {links.length}
            </p>
          </div>

          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
            <p className="text-lg text-gray-400 dark:text-white/40">Total clicks</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {totalClicks.toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
            <p className="text-lg text-gray-400 dark:text-white/40">Average per link</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {links.length ? Math.round(totalClicks / links.length) : 0}
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-3 gap-4">

          {/* Left: list of links */}
          <div className="col-span-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-gray-100 dark:border-white/10 text-xs text-gray-400 dark:text-white/40 uppercase tracking-widest">
              Links
            </div>

            <div className="max-h-125px overflow-y-auto">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setSelectedId(link.id)}
                  className={`
                    w-full text-left px-3 py-2 text-sm transition
                    hover:bg-gray-50 dark:hover:bg-white/5
                    ${selectedId === link.id ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-white/70"}
                  `}
                >
                  <div className="truncate font-medium">
                    {link.shortCode}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-white/30">
                    {link.clicks} clicks
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: analytics panel */}
          <div className="col-span-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-5">

            {!selectedLink ? (
              <div className="text-sm text-gray-400 dark:text-white/30">
                Select a link to view analytics
              </div>
            ) : loading ? (
                <div>Loading analytics...</div>
            ) : (
              <>
                <div className="mb-4">
                <p className="text-sm text-gray-400">Total clicks</p>
                <p className="text-2xl font-semibold">{data?.totalClicks}</p>
                </div>

                <div className="h-62.5 border border-dashed border-gray-300 dark:border-white/10 rounded-lg flex items-center justify-center text-sm text-gray-400">
                Chart placeholder ({data?.clicksByDay.length} points)
                </div>
               </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}