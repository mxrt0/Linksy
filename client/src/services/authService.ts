import { apiFetch } from "../api/apiClient";
import { ApiError } from "../types/auth/ApiError";
import type { LoginRequest } from "../types/auth/LoginRequest";
import type { RegisterRequest } from "../types/auth/RegisterRequest";
import type { User } from "../types/auth/User";

async function register(request: RegisterRequest): Promise<User> {
    const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(request)
    })

    if (!res.ok) {
        const errors = await res.json() as string[];
        throw new ApiError("Register failed", errors);
    }

    return await res.json();
}

async function login(request: LoginRequest): Promise<User> {
    const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(request)
    })

    if (!res.ok) {
        const content = await res.json() as { errors: string[] };       
        throw new ApiError("Register failed", content.errors);
    }

    return await res.json();
}

async function logout(): Promise<void> {
    await apiFetch('/api/auth/logout')
}

export const authService = {
    register,
    login,
    logout
}
