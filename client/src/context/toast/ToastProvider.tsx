import { useState, type ReactNode } from "react";
import type { Toast } from "../../types/toast/Toast";
import type { ToastType } from "../../types/toast/ToastType";
import { ToastContext } from "./ToastContext";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 space-y-2
        transition-all duration-300">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="
              flex items-center gap-2.5 px-4 py-2.5 rounded-2xl
              bg-white/95 dark:bg-[#111118]/95 backdrop-blur
              border border-gray-200 dark:border-white/10
              shadow-lg shadow-black/5 dark:shadow-black/40
            "
          >
  
            {t.type === "success" && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7.5l3 3 6-6"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            {t.type === "error" && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1.5v6M7 10.5h.01"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {t.type === "info" && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#3b82f6" strokeWidth="1.5" />
              </svg>
            )}

            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {t.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

