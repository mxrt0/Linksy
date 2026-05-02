import { createContext } from "react";
import type { ThemeContextType } from "../../types/theme/ThemeContextType";

export const ThemeContext = createContext<ThemeContextType | null>(null);