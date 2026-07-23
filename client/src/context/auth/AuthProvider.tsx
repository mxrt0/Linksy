import { useCallback, useEffect, useState } from "react";
import type { RegisterRequest } from "../../types/auth/RegisterRequest";
import { authService } from "../../services/authService";
import type { LoginRequest } from "../../types/auth/LoginRequest";
import type { User } from "../../types/auth/User";
import { AuthContext } from "./AuthContext";
import { accountService } from "../../services/accountService";
import type { ProfileSettings, UpdateProfileRequest } from "../../types/auth/ProfileSettings";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<ProfileSettings | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const refreshProfile = useCallback(async () => {
        try {
            const nextProfile = await accountService.getProfile();
            setProfile(nextProfile);
            setUser((currentUser) => currentUser ? {
                ...currentUser,
                displayName: nextProfile.displayName,
                username: nextProfile.userName ?? currentUser.username
            } : currentUser);
        } catch {
            setProfile(null);
        }
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await authService.me();
                setUser(currentUser);
                await refreshProfile();
            } catch {
                setUser(null);
                setProfile(null);
            } finally {
                setAuthLoading(false);
            }
        };

        loadUser();
    }, []);

    const register = async (request: RegisterRequest) => {
        const currentUser = await authService.register(request);
        setUser(currentUser);
        await refreshProfile();
    }

    const login = async (request: LoginRequest) => {
        const currentUser = await authService.login(request);
        setUser(currentUser);
        await refreshProfile();
    }

    const logout = async () =>  {
        await authService.logout();
        setUser(null);
        setProfile(null);
    }

    const updateProfile = async (request: UpdateProfileRequest) => {
        const nextProfile = await accountService.updateProfile(request);
        setProfile(nextProfile);
        setUser((currentUser) => currentUser ? {
            ...currentUser,
            displayName: nextProfile.displayName,
            username: nextProfile.userName ?? currentUser.username
        } : currentUser);
    }

    return (
        <AuthContext.Provider value={{ user, profile, authLoading, register, login, logout, refreshProfile, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}