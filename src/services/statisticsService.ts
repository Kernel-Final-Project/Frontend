import api from "@/lib/api";
import { Granularity, UserStatPoint, BlogStatPoint } from "@/components/admin/types";

export const statisticsService = {
  async getUserStats(
    params:
      | { granularity: "daily"; startDate: string; endDate: string }
      | { granularity: "weekly"; year: number; month: number }
      | { granularity: "monthly"; year: number }
  ) {
    const { granularity } = params;
    const query =
      granularity === "daily"
        ? { startDate: params.startDate, endDate: params.endDate }
        : granularity === "weekly"
        ? { year: params.year, month: params.month }
        : { year: params.year };

    const res = await api.get(`/api/v1/admin/statistics/${granularity}/users`, { params: query });
    return (res.data?.data as UserStatPoint[]) ?? [];
  },

  async getBlogStats(
    params:
      | { granularity: "daily"; startDate: string; endDate: string }
      | { granularity: "weekly"; year: number; month: number }
      | { granularity: "monthly"; year: number }
  ) {
    const { granularity } = params;
    const query =
      granularity === "daily"
        ? { startDate: params.startDate, endDate: params.endDate }
        : granularity === "weekly"
        ? { year: params.year, month: params.month }
        : { year: params.year };

    const res = await api.get(`/api/v1/admin/statistics/${granularity}/posts`, { params: query });
    return (res.data?.data as BlogStatPoint[]) ?? [];
  },

  async reaggregateStats(startDate: string, endDate: string) {
    const res = await api.post('/api/v1/admin/statistics/manual-aggregate-range', null, {
      params: { startDate, endDate }
    });
    return res.data;
  },
};
