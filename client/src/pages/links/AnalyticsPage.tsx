import { useEffect, useMemo, useState } from "react";
import { useLinks } from "../../hooks/links/useLinks";
import { useAnalytics } from "../../hooks/links/useAnalytics";
import { StatCard } from "../../components/StatCard";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import type { AnalyticsRange } from "../../types/link/Range";
import { useParams } from "react-router-dom";
import { TrafficSource } from "../../types/link/TrafficSource";

export function AnalyticsPage() {
  const { links } = useLinks();

  const { code } = useParams();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const [range, setRange] = useState<AnalyticsRange>(30);
  const { data, loading } = useAnalytics(selectedId, range);

  const selectedLink = useMemo(() => {
    return links.find((l) => l.id === selectedId) ?? null;
  }, [links, selectedId]);

  const topLink = useMemo(() => {
  if (!links.length) return null;

  return [...links].sort((a, b) => b.clicks - a.clicks)[0];
}, [links]);

  const avgDailyClicks = useMemo(() => {
    if (!data?.clicksByDay.length) return 0;

    const total = data.clicksByDay.reduce((sum, d) => sum + d.count, 0);

    return Math.round(total / data.clicksByDay.length);
  }, [data]);

  const peakDay = useMemo(() => {
    if (!data?.clicksByDay.length) return null;

    return [...data.clicksByDay].sort((a, b) => b.count - a.count)[0];
  }, [data]);

  useEffect(() => {
    if (!code || !links.length) return;

    const match = links.find((l) => l.shortCode === code);

    if (match) {
      setSelectedId(match.id);
    }
  }, [code, links]);

  useEffect(() => {
    if (!selectedId && links.length > 0) {
      setSelectedId(links[0].id);
    }
  }, [links, selectedId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase cursor-default tracking-widest text-indigo-500 dark:text-indigo-400 mb-2">
            Analytics
          </p>

          <h1 className="text-3xl font-semibold cursor-default text-gray-900 dark:text-white">
            Insights into your links
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">

          <StatCard
            label="Top performing link"
            value={topLink ? topLink.shortCode : "—"}
            subValue={topLink ? `${topLink.clicks} clicks` : "—"}
          />

          <StatCard
            label="Peak traffic day"
            value={
              peakDay
                ? new Date(peakDay.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric"
                  })
                : "—"
            }
            subValue={peakDay ? peakDay.count + " clicks" : undefined}
          />

          <StatCard
            label="Average daily clicks"
            value={avgDailyClicks}
            subValue={`${range}-day window`}
          />

        </div>
        
        {/* Main layout */}
        <div className="grid grid-cols-3 gap-4">

          {/* Left: list of links */}
          <div className="col-span-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="p-3 border-b cursor-default border-gray-100 dark:border-white/10 text-xs text-gray-400 dark:text-white/40 uppercase tracking-widest">
              Links
            </div>

            <div className="max-h-125px overflow-y-auto">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setSelectedId(link.id)}
                  className={`cursor-pointer
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
              <div className="text-sm text-gray-400 text-center dark:text-white/30">
                Select a link to view analytics
              </div>
            ) : loading ? (
                <div>Loading analytics...</div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/30">
                      Click activity
                    </p>

                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {data?.totalClicks ?? 0}
                    </p>
                  </div>

                  <div className="
                    flex items-center gap-1 p-1 rounded-xl
                    bg-gray-100 dark:bg-white/5
                    border border-gray-200 dark:border-white/10
                  ">
                    {[7, 30, 90, 365].map((d) => (
                      <button
                        key={d}
                        onClick={() => setRange(d as AnalyticsRange)}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                          ${
                            range === d
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
                          }
                        `}
                      >
                        {d === 365 ? "All" : `${d}D`}
                      </button>
                    ))}
                </div>

              </div>             

                {!data?.clicksByDay.length 
                  ? "No analytics data yet"
                : 
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.clicksByDay}>

                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />

                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric"
                          })
                        }
                        tick={{
                          fill: "#9ca3af",
                          fontSize: 11
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fill: "#9ca3af",
                          fontSize: 11
                        }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#111118",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          fontSize: "12px"
                        }}
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />

                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{
                          r: 5,
                          strokeWidth: 0,
                          fill: "#818cf8"
                        }}
                        animationDuration={450}
                      />

                    </LineChart>
                  </ResponsiveContainer>
                </div>               
              }
                    <div className="mt-7">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/30">
          Traffic sources
        </p>
      </div>

      <div className="space-y-2">
        {data?.referrers.map((r) => {
          const percentage = Math.round(
            (r.count / (data.totalClicks || 1)) * 100
          );

          const source = r.source;

          return (
            <div
              key={r.source}
              className="
                p-3 rounded-xl
                bg-gray-50 dark:bg-white/3
                border border-gray-100 dark:border-white/5
              "
            >
              <div className="flex items-center justify-between mb-2">

                {/* LEFT */}
                <div className="flex items-center gap-2 min-w-0">

                  {/* ICON */}
                  <div className="
                    w-7 h-7 rounded-lg
                    flex items-center justify-center
                    bg-white dark:bg-white/5
                    border border-gray-200 dark:border-white/10
                    text-gray-500 dark:text-white/50
                    shrink-0
                  ">

                    {/* GOOGLE */}
                    {source === TrafficSource.Google && <img
                      src="/google-icon.png"
                      alt="Google"
                      className="w-3.5 h-3.5 opacity-80"
                    />}

                    {/* TWITTER/X */}
                    {source === TrafficSource.TwitterX && <img
                      src="/twitter-icon.png"
                      alt="Twitter/X"
                      className="w-3.5 h-3.5 opacity-80"
                    />}

                    {/* DISCORD */}
                    {source === TrafficSource.Discord && <img
                      src="/discord-icon.png"
                      alt="Discord"
                      className="w-3.5 h-3.5 opacity-80"
                    />}

                    {source === TrafficSource.QR && <img
                      src="/qr-code.png"
                      alt="QR"
                      className="w-3.5 h-3.5 opacity-80"
                    />}

                    {/* DIRECT */}
                    {source === TrafficSource.Direct && (
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 12L12 4M7 4h5v5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}

                    {source === TrafficSource.Other 
                     && (
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <circle
                          cx="8"
                          cy="8"
                          r="5.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                    )}
                  </div>

                  {/* TEXT */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/80">
                      {r.source}
                    </p>

                    <p className="text-[11px] text-gray-400 dark:text-white/30">
                      {percentage}% of traffic
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <span className="text-xs text-gray-400 dark:text-white/40">
                  {r.count} clicks
                </span>
              </div>

              {/* BAR */}
              <div className="h-1.5 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{
                    width: `${percentage}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <div className="mt-7">
  <div className="flex items-center justify-between mb-3">
    <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/30">
      Devices
    </p>
  </div>

  <div className="space-y-2">
    {data?.devices?.map((d) => {
      const percentage = Math.round(
        (d.count / (data.totalClicks || 1)) * 100
      );

      const device = d.device.toLowerCase();

      return (
        <div
          key={d.device}
          className="
            p-3 rounded-xl
            bg-gray-50 dark:bg-white/3
            border border-gray-100 dark:border-white/5
          "
        >
          <div className="flex items-center justify-between mb-2">

            <div className="flex items-center gap-2 min-w-0">

              {/* ICON */}
              <div className="
                w-7 h-7 rounded-lg
                flex items-center justify-center
                bg-white dark:bg-white/5
                border border-gray-200 dark:border-white/10
                shrink-0
              ">

                {/* MOBILE */}
                {device === "mobile" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="7"
                      y="2"
                      width="10"
                      height="20"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                  </svg>
                )}

                {/* DESKTOP */}
                {device === "desktop" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="12"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 20h8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                {/* TABLET */}
                {device === "tablet" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="5"
                      y="2"
                      width="14"
                      height="20"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="18" r="0.8" fill="currentColor" />
                  </svg>
                )}

                {/* OTHER */}
                {!["mobile", "desktop", "tablet"].includes(device) && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}

              </div>

              {/* TEXT */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white/80">
                  {d.device}
                </p>

                <p className="text-[11px] text-gray-400 dark:text-white/30">
                  {percentage}% of traffic
                </p>
              </div>
            </div>

            <span className="text-xs text-gray-400 dark:text-white/40">
              {d.count} clicks
            </span>
          </div>

          {/* BAR */}
          <div className="h-1.5 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>
</div>
               </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}