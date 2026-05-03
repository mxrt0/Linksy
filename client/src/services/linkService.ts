import { apiFetch } from "../api/apiClient";
import type { CreateLinkRequest } from "../types/link/CreateLinkRequest";
import type { Link } from "../types/link/Link";
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

export const linkService = {
    create,
    getLinks
}