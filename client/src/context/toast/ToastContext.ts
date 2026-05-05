import { createContext } from "react";
import type { ToastContextType } from "../../types/toast/ToastContextType";

export const ToastContext = createContext<ToastContextType | null>(null);