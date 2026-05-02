import { createContext } from "react";
import type { AuthContextType } from "../../types/auth/AuthContextType";

export const AuthContext = createContext<AuthContextType | null>(null);