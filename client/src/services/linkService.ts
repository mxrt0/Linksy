import { apiFetch } from "../api/apiClient";
import type { CreateLinkRequest } from "../types/link/CreateLinkRequest";
import type { Link } from "../types/link/Link";
import type { UpdateLinkRequest } from "../types/link/UpdateLinkRequest";
import type { ServiceResult } from "../types/services/ServiceResult";

async function getLinks(): Promise<ServiceResult<Link[]>> {
    const res = await apiFetch('/api/links');

    if (!res.ok) {
        return await res.json();
    }

    const data = await res.json() as Link[];
    return {success: true, data};
}

async function create(request: CreateLinkRequest): Promise<ServiceResult<Link>> {
    const res = await apiFetch('/api/links', {
        method: 'POST',
        body: JSON.stringify(request)
    })

    if (!res.ok) {
        return await res.json();
    }

    const data = await res.json() as Link;
    return {success: true, data};
}

async function toggleActive(id: string): Promise<ServiceResult<Link>> {
    const res = await apiFetch(`/api/links/${id}`, {
        method: 'PATCH'
    })

    if (!res.ok) {
        return await res.json();
    }

    const data = await res.json() as Link;
    return {success: true, data};
}

async function update(id: string, request: UpdateLinkRequest): Promise<ServiceResult<Link>> {
    const res = await apiFetch(`/api/links/${id}`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

    if (!res.ok) {
        return await res.json();
    }

    const data = await res.json() as Link;
    return { success: true, data };
}

async function deleteLink(id: string): Promise<ServiceResult<null>> {
    const res = await apiFetch(`/api/links/${id}`, {
        method: 'DELETE'
    })

    if (!res.ok) {
        return await res.json();
    }

    return { success: true, data: null };
}

async function checkPassword(code: string, password: string): Promise<ServiceResult<null>> {
    const res = await apiFetch(`/r/${code}/unlock`, {
        method: 'POST',
        body: JSON.stringify({ password })
    });

    if (!res.ok) {
        return await res.json();
    }

    return { success: true, data: null };
}

export const linkService = {
    create,
    getLinks,
    toggleActive,
    update,
    deleteLink,
    checkPassword
}
