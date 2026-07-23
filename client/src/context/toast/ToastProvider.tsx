import { useState, type ReactNode } from "react";
import type { Toast } from "../../types/toast/Toast";
import type { ToastType } from "../../types/toast/ToastType";
import { ToastContext } from "./ToastContext";
import type { ToastAction } from "../../types/toast/ToastAction";
import { ToastItem } from "../../components/ToastItem";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
  message: string,
  type: ToastType = "info",
  action?: ToastAction,
  duration = 3000
  ) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type, action, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };  

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 space-y-2">
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            remove={removeToast}
          />
        ))} 
        </div>
      </div>
    </ToastContext.Provider>
  );
}

