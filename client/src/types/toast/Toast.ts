import type { ToastType } from "./ToastType";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};