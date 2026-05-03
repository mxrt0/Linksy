import { useEffect, useState } from "react";
import type { RegisterRequest } from "../../types/auth/RegisterRequest";
import { authService } from "../../services/authService";
import type { LoginRequest } from "../../types/auth/LoginRequest";
import type { User } from "../../types/auth/User";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
            const user = await authService.me();
            setUser(user);
            } catch {
            setUser(null);
            } finally {
            setAuthLoading(false);
            }
        };

        loadUser();
    }, []);

    const register = async (request: RegisterRequest) => {
        const currentUser = await authService.register(request);
        setUser(currentUser);
    }

    const login = async (request: LoginRequest) => {
        const currentUser = await authService.login(request);
        setUser(currentUser);
    }

    const logout = async () =>  {
        await authService.logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, authLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}