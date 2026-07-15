import { useEffect, useRef, useState } from "react";
import type { Toast } from "../types/toast/Toast";

type Props = {
  toast: Toast;
  remove: (id: string) => void;
};

export function ToastItem({ toast, remove }: Props) {
  const [hovered, setHovered] = useState(false);

  const remaining = useRef(toast.duration ?? 5000);
  const start = useRef(Date.now());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hovered) {
      if (timer.current) {
        clearTimeout(timer.current);

        remaining.current -= Date.now() - start.current;
      }

      return;
    }

    start.current = Date.now();

    timer.current = setTimeout(() => {
      remove(toast.id);
    }, remaining.current);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [hovered]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="
  w-fit min-h-13
  max-w-85
  px-4 py-3 
  flex items-center gap-2.5
  rounded-2xl

  bg-white/95 dark:bg-[#111118]/95
  backdrop-blur

  border border-gray-200 dark:border-white/10
  shadow-lg shadow-black/5 dark:shadow-black/40

  transition-all duration-200 ease-out
  animate-in slide-in-from-bottom-2 fade-in
"
    >
      {/* SUCCESS */}
      {toast.type === "success" && (
        <svg className="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2.5 7.5l3 3 6-6"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* ERROR */}
      {toast.type === "error" && (
        <svg className="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1.5v6M7 10.5h.01"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}

      <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
        {toast.message}
      </span>

      {toast.action && (
        <button
          onClick={() => {
            toast.action?.onClick();
            remove(toast.id);
          }}
          className="cursor-pointer
        shrink-0 ml-2 px-2 py-1 rounded-md
  text-xs font-medium
  hover:bg-black/10 dark:hover:bg-white/10
        text-indigo-600 dark:text-indigo-400
        hover:opacity-80 transition
        "
        >
          {toast.action.label}
        </button>
      )}
    </div>
  );
}
