import api from "@/lib/api";
import type { AnalyticsOverview, WorkerAnalytics } from "@/lib/types";

export const analyticsService = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const { data } = await api.get<AnalyticsOverview>("/analytics/overview");
    return data;
  },

  getWorkerAnalytics: async (workerId: string): Promise<WorkerAnalytics> => {
    const { data } = await api.get<WorkerAnalytics>(`/analytics/worker/${workerId}`);
    return data;
  },
};
