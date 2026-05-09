import { apiFetch } from "../api/apiClient";
import type { AnalyticsSummary } from "../types/link/AnalyticsSummary";
import type { AnalyticsRange } from "../types/link/Range";
import type { ServiceResult } from "../types/services/ServiceResult";

async function getAnalytics(
    linkId: string,
    range?: AnalyticsRange)
: Promise<ServiceResult<AnalyticsSummary>> {

    const daysQuery = range ? `?days=${range}` : '';
    const res = await apiFetch(`/api/analytics/${linkId}${daysQuery}`);

    if (!res.ok) {
        return await res.json();
    }


    const data = await res.json() as AnalyticsSummary;
    console.log(data.referrers);
    return {
        success: true,
        data
    }
}
export const analyticsService = {
    getAnalytics
}