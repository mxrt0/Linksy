import { useEffect, useMemo, useRef, useState } from "react";
import { StatCard } from "../../components/StatCard";
import { useLinks } from "../../hooks/links/useLinks";
import { useDebounce } from "../../hooks/dashboard/useDebounce";
import { API_URL, LOCAL_API_URL } from "../../config/api";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useToast } from "../../hooks/toast/useToast";
import type { Link } from "../../types/link/Link";
import { useNavigate } from "react-router-dom";
import { QrModal } from "../../components/QrModal";

export function DashboardPage() {
  const {
    links,
    loading,
    error,
    toggleActive,
    remove,
    restore,
  } = useLinks();
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const isSearching = search !== debouncedSearch;

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Link | null>(null);
  const [deleting, setDeleting] = useState(false);

    const [qrLink, setQrLink] = useState<{
    shortCode: string;
    url: string;
  } | null>(null);

  const menuRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();

    return links.filter((l) =>
      l.originalUrl.toLowerCase().includes(q) ||
      l.shortCode.toLowerCase().includes(q)
    );
  }, [links, debouncedSearch]);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeCount = links.filter((l) => l.isActive).length;

  const handleToggleActive = async (id: string) => {
      setOpenMenu(null);
      await toggleActive(id);
  }

  const confirmDelete = async () => {
  if (!deleteTarget) return;

  setDeleting(true);

  await handleDelete(deleteTarget.id);

  setDeleting(false);
  setDeleteTarget(null);
  };

  const handleDelete = async (id: string) => {
  setOpenMenu(null);

  const deleted = await remove(id);

  if (!deleted) return;

  showToast("Link deleted", "error", {
    label: "Undo",
    onClick: () => restore(deleted)
  });
};

  const handleCopy = (shortCode: string) => {
    setCopiedCode(shortCode);
       
    navigator.clipboard.writeText(`${API_URL}/r/${shortCode}`);
    showToast("Copied to clipboard", "success");
    
    setOpenMenu(null);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!openMenu) return;

      const el = menuRef.current.get(openMenu);
      if (!el) return;

      requestAnimationFrame(() => {
        if (!el.contains(e.target as Node)) {
          setOpenMenu(null);
        }
      });
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenu]);

  if (error) {
    return <div className="text-red-400 text-center py-10">{error}</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors">

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
        <div
            className={`
              relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
              transition-opacity duration-200
              ${isSearching ? "opacity-60 blur-[0.3px]" : "opacity-100 blur-0"}
            `}
          >

          {/* Header */}
          <div className="
            grid grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)_64px_66px_28px]
            gap-3 px-4 py-2.5
            border-b border-gray-100 dark:border-white/10
            bg-gray-50 dark:bg-white/5
          ">
            {["Original URL", "Short link", "Clicks", "Status", ""].map((col, i) => (
              <span
                key={i}
                className={`text-[10px] uppercase cursor-default tracking-widest text-gray-400 dark:text-white/30`}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Empty state */}
          {loading ? (
            <div className="py-14 text-center">
              <div className="flex justify-center items-center gap-2 text-gray-400 dark:text-white/30 text-sm">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle
                    cx="7"
                    cy="7"
                    r="5.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="8 8"
                  />
                </svg>
                Loading links...
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-gray-400 dark:text-white/25 text-sm">
                {search ? "No links match your search" : "You haven't created any links yet."}
              </p>
            </div>
          ) : (
            filtered.map((link) => {
              const isExpired = link.expiresAt && new Date(link.expiresAt) <= new Date();

              const expiresAtDate = link.expiresAt
                ? new Date(link.expiresAt)
                : null;

              const expiresSoon =
                expiresAtDate &&
                !isExpired &&
                expiresAtDate.getTime() - Date.now() <
                  1000 * 60 * 60 * 24 * 3;

              const expiredDaysAgo =
                expiresAtDate &&
                isExpired
                  ? Math.floor(
                      (Date.now() - expiresAtDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : null;

              return (
              <div
                key={link.id}
                className="
                  grid grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)_64px_66px_28px]
                  gap-3 px-4 py-3 items-center
                  border-b border-gray-100 dark:border-white/10
                  hover:bg-gray-50 dark:hover:bg-white/5 
                  hover:border-gray-300 dark:hover:border-white/15 transition-all duration-200
                "
              >
                {/* URL */}
                <div className="min-w-0">
                  <p 
                    className="text-gray-900 cursor-default dark:text-white text-sm font-medium truncate"
                    title={link.originalUrl}
                  >
                    {link.originalUrl}
                  </p>

                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-gray-400 cursor-default dark:text-white/25 text-[11px] truncate">
                      lnky.io/{link.shortCode}
                    </p>
                    {expiresSoon && (
                      <div className="
                        inline-flex items-center gap-1
                        px-1.5 py-0.5 rounded-md
                        bg-amber-500/10
                        border border-amber-500/15
                        text-[10px] text-amber-600 dark:text-amber-400
                      ">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                          <circle
                            cx="8"
                            cy="8"
                            r="5.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                          />
                          <path
                            d="M8 4.5V8L10.5 9.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        Expires soon
                      </div>
                    )}

                    {isExpired && (
                      <div className="
                        inline-flex items-center gap-1
                        px-1.5 py-0.5 rounded-md
                        bg-red-500/8
                        border border-red-500/10
                        text-[10px] text-red-500 dark:text-red-400/90
                      ">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 4L12 12M12 4L4 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>

                      Expired
                      {expiredDaysAgo !== null &&
                        ` ${expiredDaysAgo}d ago`}
                    </div>
                  )}

                </div>
                </div>

                {/* Short link + copy */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-indigo-600 dark:text-indigo-400 text-[12px] font-mono truncate">
                    lnky.io/{link.shortCode}
                  </span>
                  <button
                    onClick={() => handleCopy(link.shortCode)}
                    disabled={copiedCode === link.shortCode}
                    title="Copy link"
                    className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all duration-150 border ${
                      copiedCode === link.shortCode
                        ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 cursor-default"
                        : "bg-black/4 cursor-pointer dark:bg-white/4 border-black/8 dark:border-white/8 text-black/45 dark:text-white/40 hover:bg-black/8 dark:hover:bg-white/8 hover:text-black/70 dark:hover:text-white/65 hover:border-black/12 dark:hover:border-white/12"
                    }`}
                  >
                    {copiedCode === link.shortCode ? (
                      <>
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M8 8h10v10H8V8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                          <path d="M6 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                        </svg>
                        
                      </>
                    )}
                  </button>
                </div>

                {/* Clicks */}
                <span className="text-gray-900 cursor-default text-left dark:text-white text-sm font-medium">
                  {link.clicks.toLocaleString()}
                </span>

                {/* Status */}
                <span className={`
                  text-[10px] cursor-default px-2 py-1.25 rounded-full w-fit border inline-flex items-center gap-1.5
                  ${isExpired
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                  : link.isActive
                    ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-red-500/5 dark:bg-red-500/5 border-red-500/10 text-red-500/60 dark:text-red-400/60"
                  }
                `}>
                  {isExpired ? (
                    <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 4L12 12M12 4L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`w-1 h-1 rounded-full relative top-[0.5px] ${
                        link.isActive
                          ? "bg-green-500"
                          : "bg-red-400/70"
                      }`}
                    />
                  )}
                  {isExpired ? "Expired" : link.isActive ? "Active" : "Inactive"}
                  </span>

                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (openMenu === link.id) return;
                      setOpenMenu(link.id);
                    }}
                    className="
                      w-6 h-6 flex items-center justify-center rounded-md
                      text-gray-400 dark:text-white/30
                      hover:bg-gray-100 dark:hover:bg-white/10
                      hover:text-gray-600 dark:hover:text-white
                      transition cursor-pointer
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
                        absolute right-0 sm:right-auto sm:left-0
                         mt-1 w-40 rounded-xl shadow-xl overflow-hidden z-999
                        bg-white dark:bg-[#111118]
                        border border-gray-200 dark:border-white/10
                      "
                    >
                      <button
                        disabled={isExpired ? isExpired : false}
                        onClick={() => {
                          setOpenMenu(null);
                          window.open(`${API_URL}/r/${link.shortCode}`, "_blank");
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition ${
                          isExpired
                            ? "text-gray-300 dark:text-white/20 cursor-not-allowed"
                            : "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-white/70"
                        }`}
                      >
                        Open link
                      </button>

                      <button
                        onClick={() => { 
                          setOpenMenu(null);
                          navigate(`/analytics/${link.shortCode}`);
                        }}
                        className="w-full cursor-pointer text-left px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-white/70"
                      >
                        View analytics
                      </button>

                      <button
                        disabled={isExpired ? isExpired : false}
                        onClick={() => {
                          setOpenMenu(null);

                          setQrLink({
                            shortCode: link.shortCode,
                            url: `${LOCAL_API_URL}/r/${link.shortCode}?source=qr`
                          });
                        }}
                        className="
                          w-full cursor-pointer text-left px-3 py-2.5 text-sm
                          hover:bg-gray-50 dark:hover:bg-white/5
                          text-gray-700 dark:text-white/70
                        "
                    >
                        View QR code
                    </button>

                      <button
                        disabled={isExpired ? isExpired : false}
                        onClick={() => handleToggleActive(link.id)}
                        className={`w-full text-left px-3 py-2.5 text-sm transition ${
                          isExpired
                            ? "text-gray-300 dark:text-white/20 cursor-not-allowed"
                            : "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-white/70"
                        }`}
                      >
                        {link.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <div className="border-t border-gray-100 dark:border-white/10" />

                      <button 
                      onClick={() => {
                        setOpenMenu(null);
                        setDeleteTarget(link);
                      }}
                      className="w-full cursor-pointer text-left px-3 py-2.5 text-sm text-red-500
                       dark:text-red-400 hover:bg-gray-50 dark:hover:bg-white/5">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )})
          )}

        </div>

      </main>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this link?"
        description={`lnky.io/${deleteTarget?.shortCode} -> ${deleteTarget?.originalUrl}`}
        confirmText="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <QrModal
        open={!!qrLink}
        shortCode={qrLink?.shortCode ?? null}
        url={qrLink?.url ?? null}
        onClose={() => setQrLink(null)}
      />
    </div>
  );
}