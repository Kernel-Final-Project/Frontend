import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BarChart3, Loader2 } from "lucide-react";
import { statisticsService } from "@/services/statisticsService";
import { DailyRange, Granularity, NormalizedBlogStatPoint, WeeklyPeriod } from "./types";
import { AdminBlogStatsControls } from "./AdminBlogStatsControls";
import { AdminBlogStatsSummary } from "./AdminBlogStatsSummary";
import { AdminBlogStatsChart } from "./AdminBlogStatsChart";
import { AdminBlogStatsTable } from "./AdminBlogStatsTable";
import { defaultDailyRange, defaultMonthlyYear, defaultWeeklyPeriod, normalizeBlogStats } from "./blogStatsUtils";

type AdminBlogStatsSectionProps = {
  active: boolean;
};

export function AdminBlogStatsSection({ active }: AdminBlogStatsSectionProps) {
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const [dailyRange, setDailyRange] = useState<DailyRange>(defaultDailyRange());
  const [weeklyPeriod, setWeeklyPeriod] = useState<WeeklyPeriod>(defaultWeeklyPeriod());
  const [monthlyYear, setMonthlyYear] = useState<number>(defaultMonthlyYear());
  const [data, setData] = useState<NormalizedBlogStatPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReaggregating, setIsReaggregating] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const raw =
        granularity === "daily"
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
            });
      setData(normalizeBlogStats(granularity, raw));
      setError(null);
    } catch (err) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "블로그 통계를 불러오지 못했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!active) return;
    fetchStats();
  }, [active, granularity, dailyRange.start, dailyRange.end, weeklyPeriod.year, weeklyPeriod.month, monthlyYear]);

  const handleReaggregate = async () => {
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
      const msg = (err as any)?.response?.data?.message || "재집계에 실패했습니다.";
      alert(msg);
    } finally {
      setIsReaggregating(false);
    }
  };

  const latest = useMemo(() => data[data.length - 1], [data]);

  return (
    <Card className="card-shadow overflow-hidden">
      <CardHeader className="bg-muted/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span>블로그 통계</span>
        </div>
        <CardTitle className="text-xl">포스트 발행 추이</CardTitle>
        <p className="text-sm text-muted-foreground">기간과 단위를 선택해 블로그 포스트 추이를 확인하세요.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <AdminBlogStatsControls
          granularity={granularity}
          dailyRange={dailyRange}
          weeklyPeriod={weeklyPeriod}
          monthlyYear={monthlyYear}
          onDailyRangeChange={setDailyRange}
          onWeeklyPeriodChange={setWeeklyPeriod}
          onMonthlyYearChange={setMonthlyYear}
          onGranularityChange={(value) => {
            setGranularity(value);
            if (value === "daily") setDailyRange(defaultDailyRange());
            if (value === "weekly") setWeeklyPeriod(defaultWeeklyPeriod());
            if (value === "monthly") setMonthlyYear(defaultMonthlyYear());
          }}
          onReset={() => {
            setGranularity("daily");
            setDailyRange(defaultDailyRange());
            setWeeklyPeriod(defaultWeeklyPeriod());
            setMonthlyYear(defaultMonthlyYear());
          }}
          onReaggregate={handleReaggregate}
          isReaggregating={isReaggregating}
        />

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            불러오는 중입니다...
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : data.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background/70 py-10 text-center text-muted-foreground">
            선택한 기간에 데이터가 없습니다.
          </div>
        ) : (
          <>
            <AdminBlogStatsSummary
              latest={latest}
              granularity={granularity}
              dailyRange={dailyRange}
              weeklyPeriod={weeklyPeriod}
              monthlyYear={monthlyYear}
            />

            <AdminBlogStatsChart data={data} />

            <AdminBlogStatsTable data={data} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
