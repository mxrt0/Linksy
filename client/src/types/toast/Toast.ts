import type { ToastAction } from "./ToastAction";
import type { ToastType } from "./ToastType";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
  duration?: number;
};