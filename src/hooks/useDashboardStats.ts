import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { DashboardSummary, DashboardTrendPoint, PlatformStatistics } from "@/components/admin/types";
import { statisticsService } from "@/services/statisticsService";

export function useDashboardStats(active: boolean) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trendData, setTrendData] = useState<DashboardTrendPoint[]>([]);
  const [platformData, setPlatformData] = useState<PlatformStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 날짜 범위 계산 (최근 30일)
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 30);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const [summaryData, trendData, platformStats] = await Promise.all([
          statisticsService.getDashboardSummary(),
          statisticsService.getDashboardTrend(),
          statisticsService.getPlatformStatistics(formatDate(startDate), formatDate(endDate)),
        ]);

        setSummary(summaryData);
        setTrendData(trendData);
        setPlatformData(platformStats);
      } catch (err) {
        const msg =
          err instanceof AxiosError
            ? err.response?.data?.message || err.message
            : err instanceof Error
            ? err.message
            : "대시보드 데이터를 불러오지 못했습니다.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [active]);

  return {
    summary,
    trendData,
    platformData,
    loading,
    error,
  };
}