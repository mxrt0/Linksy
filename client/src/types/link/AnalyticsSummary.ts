export type AnalyticsSummary = {
    linkId: string;
    totalClicks: number;
    clicksByDay: {
    date: string;
    count: number;
  }[];
}