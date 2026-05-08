import type { ToastAction } from "./ToastAction";
import type { ToastType } from "./ToastType";

export type ToastContextType = {
  showToast: (message: string, type?: ToastType, action?: ToastAction) => void;
};