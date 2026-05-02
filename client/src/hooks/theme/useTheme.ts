import { useContext } from "react";
import { ThemeContext } from "../../context/theme/ThemeContext";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeContext must be used within ThemeProvider");
  return ctx;
}