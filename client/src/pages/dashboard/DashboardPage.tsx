import { useEffect, useState } from "react";
import type { Link } from "../../types/Link";
import { StatCard } from "../../components/StatCard";

export function DashboardPage() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
 
  const[links, setLinks] = useState<Link[]>([]);
  useEffect(() => {
    setLinks([])
  }, [])
  const filtered = links.filter(
    (l) =>
      l.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      l.shortCode.toLowerCase().includes(search.toLowerCase())
  );
 
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeCount = links.filter((l) => l.isActive).length;
 
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-[#0d0d12] transition-colors">
 
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
 
        {/* Page title */}
        <h1 className="text-black dark:text-white font-semibold text-lg mb-4 tracking-tight">
          My links
        </h1>
         <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search links..."
          className="w-56 mb-3 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white text-sm placeholder-black/30 dark:placeholder-white/30 outline-none focus:border-indigo-500 transition"
        />
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard label="Total links" value={links.length} />
          <StatCard label="Total clicks" value={totalClicks.toLocaleString()} />
          <StatCard label="Active links" value={activeCount} />
        </div>
 
        {/* Link table */}
        <div className="bg-white dark:bg-white/2 border border-black/10 dark:border-white/[0.07] rounded-xl overflow-hidden">
 
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.1fr_70px_68px_28px] gap-3 px-4 py-2.5 border-b border-black/10 dark:border-white/[0.07]">
            {["Original URL", "Short link", "Clicks", "Status", ""].map((col, i) => (
              <span key={i} className="text-[11px] uppercase tracking-wider text-black/35 dark:text-white/30">
                {col}
              </span>
            ))}
          </div>
 
          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-black/40 dark:text-white/30 text-sm">
              {search ? "No links match your search" : "No links yet — create your first one"}
            </div>
          ) : (
            filtered.map((link) => (
              <div
                key={link.id}
                className="grid grid-cols-[2fr_1.1fr_70px_68px_28px] gap-3 px-4 py-3 items-center border-b border-black/5 dark:border-white/5 last:border-b-0"
              >
                {/* URL */}
                <div className="min-w-0">
                  <p className="text-black dark:text-white text-sm font-medium truncate">
                    {link.originalUrl}
                  </p>
                  <p className="text-black/35 dark:text-white/30 text-[11px] truncate mt-0.5">
                    lnky.io/{link.shortCode}
                  </p>
                </div>
 
                {/* Short code */}
                <span className="text-indigo-500 dark:text-indigo-400 text-xs font-mono truncate">
                  lnky.io/{link.shortCode}
                </span>
 
                {/* Clicks */}
                <span className="text-black dark:text-white text-sm font-medium">
                  {link.clicks.toLocaleString()}
                </span>
 
                {/* Status */}
                <span className={`text-[11px] px-2 py-1 rounded-full inline-block w-fit ${
                  link.isActive
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/35"
                }`}>
                  {link.isActive ? "Active" : "Inactive"}
                </span>
 
                {/* Three-dot menu */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === link.id ? null : link.id)}
                    className="w-6 h-6 flex items-center justify-center rounded text-black/30 dark:text-white/30 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black/60 dark:hover:text-white/60 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="1.3" fill="currentColor" />
                      <circle cx="3" cy="8" r="1.3" fill="currentColor" />
                      <circle cx="13" cy="8" r="1.3" fill="currentColor" />
                    </svg>
                  </button>
 
                  {openMenu === link.id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#111118] border border-black/10 dark:border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        // onClick={() => { onCopy(link.shortCode); setOpenMenu(null); }}
                        className="w-full text-left px-3 py-2 text-sm text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition"
                      >
                        Copy link
                      </button>
                      <button
                        // onClick={() => { onToggleActive(link.id); setOpenMenu(null); }}
                        className="w-full text-left px-3 py-2 text-sm text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition"
                      >
                        {link.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        // onClick={() => { onDelete(link.id); setOpenMenu(null); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-black/5 dark:hover:bg-white/5 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

