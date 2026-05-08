import type { Props } from "../types/modal/Props";

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#111118] border border-black/8 dark:border-white/8 rounded-2xl p-6 shadow-2xl shadow-black/10 dark:shadow-black/50">

        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
          danger
            ? "bg-red-500/10 border border-red-500/20"
            : "bg-indigo-500/10 border border-indigo-500/20"
        }`}>
          {danger ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                stroke="#f87171"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 11v5M14 11v5"
                stroke="#f87171"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#818cf8" strokeWidth="1.6" />
              <path d="M12 8v4M12 16h.01" stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white mb-1.5">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500 dark:text-white/40 leading-relaxed mb-5">
            {description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/8 hover:text-gray-800 dark:hover:text-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-medium border transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              danger
                ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-700 dark:hover:text-red-300"
                : "bg-indigo-600 border-transparent text-white hover:bg-indigo-500"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                </svg>
                {confirmText}...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>

      </div>
    </div>
  );
}