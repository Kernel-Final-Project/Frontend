import { useState, useEffect, useCallback, useMemo } from "react";
import { AxiosError } from "axios";
import { Granularity, DailyRange, WeeklyPeriod, UserStatPoint, BlogStatPoint } from "@/components/admin/types";
import { statisticsService } from "@/services/statisticsService";

type StatPoint = {
  label: string;
  [key: string]: string | number;
};

type RawStatPoint = UserStatPoint | BlogStatPoint;

type UseStatisticsParams<T extends StatPoint, R extends RawStatPoint> = {
  active: boolean;
  statType: "user" | "blog";
  normalizeStats: (granularity: Granularity, raw: R[]) => T[];
  defaultDailyRange: () => DailyRange;
  defaultWeeklyPeriod: () => WeeklyPeriod;
  defaultMonthlyYear: () => number;
  errorMessage: string;
};

export function useStatistics<T extends StatPoint, R extends RawStatPoint>({
  active,
  statType,
  normalizeStats,
  defaultDailyRange,
  defaultWeeklyPeriod,
  defaultMonthlyYear,
  errorMessage,
}: UseStatisticsParams<T, R>) {
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const [dailyRange, setDailyRange] = useState<DailyRange>(defaultDailyRange());
  const [weeklyPeriod, setWeeklyPeriod] = useState<WeeklyPeriod>(defaultWeeklyPeriod());
  const [monthlyYear, setMonthlyYear] = useState<number>(defaultMonthlyYear());
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReaggregating, setIsReaggregating] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      let raw: R[];

      if (statType === "user") {
        raw = (granularity === "daily"
          ? await statisticsService.getUserStats({
              granularity,
              startDate: dailyRange.start,
              endDate: dailyRange.end,
            })
          : granularity === "weekly"
          ? await statisticsService.getUserStats({
              granularity,
              year: weeklyPeriod.year,
              month: weeklyPeriod.month,
            })
          : await statisticsService.getUserStats({
              granularity,
              year: monthlyYear,
            })) as R[];
      } else {
        raw = (granularity === "daily"
          ? await statisticsService.getBlogStats({
              granularity,
              startDate: dailyRange.start,
              endDate: dailyRange.end,
            })
          : granularity === "weekly"
          ? await statisticsService.getBlogStats({
              granularity,
              year: weeklyPeriod.year,
              month: weeklyPeriod.month,
            })
          : await statisticsService.getBlogStats({
              granularity,
              year: monthlyYear,
            })) as R[];
      }

      setData(normalizeStats(granularity, raw));
      setError(null);
    } catch (err) {
      const msg = err instanceof AxiosError
        ? err.response?.data?.message || err.message
        : err instanceof Error
        ? err.message
        : errorMessage;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [
    statType,
    granularity,
    dailyRange.start,
    dailyRange.end,
    weeklyPeriod.year,
    weeklyPeriod.month,
    monthlyYear,
    normalizeStats,
    errorMessage,
  ]);

  useEffect(() => {
    if (!active) return;
    fetchStats();
  }, [active, fetchStats]);

  const handleReaggregate = useCallback(async () => {
    if (granularity !== "daily") {
      alert("일별 조회 모드에서만 재집계가 가능합니다.");
      return;
    }

    const confirmed = confirm(
      `${dailyRange.start} ~ ${dailyRange.end} 기간의 통계를 재집계하시겠습니까?\n기존 데이터는 덮어씌워집니다.`
    );

    if (!confirmed) return;

    try {
      setIsReaggregating(true);
      await statisticsService.reaggregateStats(dailyRange.start, dailyRange.end);

      // 재집계 성공 후 통계 다시 불러오기
      await fetchStats();

      alert("통계 재집계가 완료되었습니다.");
    } catch (err) {
      const msg = err instanceof AxiosError
        ? err.response?.data?.message || err.message
        : "재집계에 실패했습니다.";
      alert(msg);
    } finally {
      setIsReaggregating(false);
    }
  }, [granularity, dailyRange.start, dailyRange.end, fetchStats]);

  const latest = useMemo(() => data[data.length - 1], [data]);

  return {
    granularity,
    setGranularity,
    dailyRange,
    setDailyRange,
    weeklyPeriod,
    setWeeklyPeriod,
    monthlyYear,
    setMonthlyYear,
    data,
    loading,
    error,
    isReaggregating,
    handleReaggregate,
    latest,
  };
}
