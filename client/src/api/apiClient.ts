import { API_URL } from "../config/api";

export async function apiFetch(input: string, options: RequestInit = {}) {
    return fetch(`${API_URL}${input}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });
}