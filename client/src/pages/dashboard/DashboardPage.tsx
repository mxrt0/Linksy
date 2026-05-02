import { useEffect, useRef, useState } from "react";
import type { Link } from "../../types/link/Link";
import { StatCard } from "../../components/StatCard";

export function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const menuRef = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    setLinks([]);

    // useEffect(() => {
    //   linkService.getLinks().then(setLinks);
    // }, []);

  }, []);

  const filtered = links.filter(
    (l) =>
      l.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      l.shortCode.toLowerCase().includes(search.toLowerCase())
  );

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeCount = links.filter((l) => l.isActive).length;

  const handleToggleActive = async (id: string) => {
    try {
      // await linkService.toggleActive(id);

      setLinks((prev) =>
        prev.map((link) =>
          link.id === id
            ? { ...link, isActive: !link.isActive }
            : link
        )
      );

      setOpenMenu(null);

    } catch (err) {
      console.error("Failed to toggle link", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      //await linkService.deleteLink(id);

      setLinks((prev) =>
        prev.filter((link) => link.id !== id)
      );

      setOpenMenu(null);

    } catch (err) {
      console.error("Failed to delete link", err);
    }
  };

  const handleCopy = (shortCode: string) => {
    setCopiedCode(shortCode);
    setOpenMenu(null);
    setTimeout(() => setCopiedCode(null), 2000);

    // navigator.clipboard.writeText(`https://lnky.io/${shortCode}`);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (openMenu) {
        const el = menuRef.current.get(openMenu);
        if (el && !el.contains(e.target as Node)) setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenu]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors">

      {/* Toast */}
      <div className={`
        fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300
        ${copiedCode ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
      `}>
        <div className="
          flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-gray-900 dark:bg-white
          border border-gray-800 dark:border-gray-200
          shadow-xl
        ">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7.5l3 3 6-6"
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-sm font-medium text-white dark:text-gray-900">
            Copied to clipboard
          </span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">

        {/* Header */}
        <div className="mb-7">
          <p className="text-[11px] cursor-default uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2 font-medium">
            Dashboard
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 
          dark:text-white leading-tight cursor-default">
            Your links,{" "}
            <span className="text-gray-400 cursor-default dark:text-white/35">
              all in one place.
            </span>
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">

          <StatCard label="Total links" value={links.length} />
          <StatCard label="Total clicks" value={totalClicks.toLocaleString()} />
          <StatCard label="Active links" value={activeCount} />

        </div>

        {/* Search */}
        <div className="relative mb-3">

          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 pointer-events-none"
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
            className="
              w-full pl-8 pr-4 py-2 rounded-lg
              bg-white dark:bg-white/5
              border border-gray-200 dark:border-white/10
              text-gray-900 dark:text-white text-sm
              placeholder-gray-400 dark:placeholder-white/25
              outline-none focus:border-indigo-500/60 transition
            "
          />

        </div>

        {/* Table */}
        <div className="
          bg-white dark:bg-white/5
          border border-gray-200 dark:border-white/10
          rounded-xl overflow-hidden
        ">

          {/* Header */}
          <div className="
            grid grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)_64px_66px_28px]
            gap-3 px-4 py-2.5
            border-b border-gray-100 dark:border-white/10
            bg-gray-50 dark:bg-white/5
          ">
            {["Original URL", "Short link", "Clicks", "Status", ""].map((col, i) => (
              <span key={i} className="text-[10px] cursor-default uppercase tracking-widest text-gray-400 dark:text-white/30">
                {col}
              </span>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-gray-400 cursor-default dark:text-white/25 text-sm">
                {search ? "No links match your search" : "You haven't created any links yet."}
              </p>
            </div>
          ) : (
            filtered.map((link) => (
              <div
                key={link.id}
                className="
                  grid grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)_64px_66px_28px]
                  gap-3 px-4 py-3 items-center
                  border-b border-gray-100 dark:border-white/10
                  hover:bg-gray-50 dark:hover:bg-white/5 
                  hover:border-gray-300 dark:hover:border-white/15 transition
                "
              >
                {/* URL */}
                <div className="min-w-0">
                  <p className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    {link.originalUrl}
                  </p>

                  <p className="text-gray-400 dark:text-white/25 text-[11px] truncate mt-0.5">
                    lnky.io/{link.shortCode}
                  </p>
                </div>

                {/* Short */}
                <span className="text-indigo-600 dark:text-indigo-400 text-[12px] font-mono truncate">
                  lnky.io/{link.shortCode}
                </span>

                {/* Clicks */}
                <span className="text-gray-900 dark:text-white text-sm font-medium">
                  {link.clicks.toLocaleString()}
                </span>

                {/* Status */}
                <span className={`
                  text-[10px] px-2 py-1 rounded-full w-fit border inline-flex items-center gap-1.5
                  ${link.isActive
                    ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30"
                  }
                `}>
                  <span className={`w-1 h-1 rounded-full ${link.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                  {link.isActive ? "Active" : "Inactive"}
                </span>

                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === link.id ? null : link.id)}
                    className="
                      w-6 h-6 flex items-center justify-center rounded-md
                      text-gray-400 dark:text-white/30
                      hover:bg-gray-100 dark:hover:bg-white/10
                      hover:text-gray-600 dark:hover:text-white
                      transition
                    "
                  >
                    <svg width="13" height="3" viewBox="0 0 13 3" fill="currentColor">
                      <circle cx="1.5" cy="1.5" r="1.5" />
                      <circle cx="6.5" cy="1.5" r="1.5" />
                      <circle cx="11.5" cy="1.5" r="1.5" />
                    </svg>
                  </button>

                  {openMenu === link.id && (
                    <div
                      ref={(el) => {
                        if (el) menuRef.current.set(link.id, el);
                        else menuRef.current.delete(link.id);
                      }}
                      className="
                        absolute right-0 mt-1 w-40 rounded-xl shadow-xl overflow-hidden z-50
                        bg-white dark:bg-[#111118]
                        border border-gray-200 dark:border-white/10
                      "
                    >
                      <button 
                      onClick={() => handleCopy(link.shortCode)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-white/70">
                        Copy link
                      </button>

                      <button 
                      onClick={() => handleToggleActive(link.id)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 
                      dark:hover:bg-white/5 text-gray-700 dark:text-white/70">
                        {link.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <div className="border-t border-gray-100 dark:border-white/10" />

                      <button 
                      onClick={() => handleDelete(link.id)}
                      className="w-full text-left px-3 py-2.5 text-sm text-red-500
                       dark:text-red-400 hover:bg-gray-50 dark:hover:bg-white/5">
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