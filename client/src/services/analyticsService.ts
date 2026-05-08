import { apiFetch } from "../api/apiClient";
import type { AnalyticsSummary } from "../types/link/AnalyticsSummary";
import type { ServiceResult } from "../types/services/ServiceResult";

async function getAnalytics(linkId: string): Promise<ServiceResult<AnalyticsSummary>> {
    const res = await apiFetch(`/api/analytics/${linkId}`);

    if (!res.ok) {
        return await res.json();
    }


    const data = await res.json() as AnalyticsSummary;
    return {
        success: true,
        data
    }
}
export const analyticsService = {
    getAnalytics
}