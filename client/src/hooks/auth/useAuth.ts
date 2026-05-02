import { useContext } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import type { AuthContextType } from "../../types/auth/AuthContextType";

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
      if (!ctx) {
        throw new Error("AuthContext must be used within AuthProvider.");
      }
      return ctx;      
}