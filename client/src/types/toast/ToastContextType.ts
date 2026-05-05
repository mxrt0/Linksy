import type { ToastType } from "./ToastType";

export type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};