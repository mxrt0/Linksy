import { useEffect, useState } from "react";
import { analyticsService } from "../../services/analyticsService";
import type { AnalyticsSummary } from "../../types/link/AnalyticsSummary";
import type { AnalyticsRange } from "../../types/link/Range";

export function useAnalytics(linkId: string | undefined, range?: AnalyticsRange) {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!linkId) return;

    const load = async () => {
      setLoading(true);

      try {
        const result = await analyticsService.getAnalytics(linkId, range);
        if (result.success) {
            setData(result.data);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [linkId, range]);

  return { data, loading };
}