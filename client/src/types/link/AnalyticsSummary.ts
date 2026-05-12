import type { DeviceStat, ReferrerStat } from "./AnalyticsStatTypes";

export type AnalyticsSummary = {
    linkId: string;
    totalClicks: number;
    clicksByDay: {
      date: string;
      count: number; }[];
    referrers: ReferrerStat[];
    devices: DeviceStat[];
}