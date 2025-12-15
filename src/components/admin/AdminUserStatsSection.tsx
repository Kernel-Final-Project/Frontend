import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BarChart3, Loader2 } from "lucide-react";
import { statisticsService } from "@/services/statisticsService";
import { DailyRange, Granularity, NormalizedUserStatPoint, WeeklyPeriod } from "./types";
import { AdminUserStatsControls } from "./AdminUserStatsControls";
import { AdminUserStatsSummary } from "./AdminUserStatsSummary";
import { AdminUserStatsChart } from "./AdminUserStatsChart";
import { AdminUserStatsTable } from "./AdminUserStatsTable";
import { defaultDailyRange, defaultMonthlyYear, defaultWeeklyPeriod, normalizeUserStats } from "./userStatsUtils";

type AdminUserStatsSectionProps = {
  active: boolean;
};

export function AdminUserStatsSection({ active }: AdminUserStatsSectionProps) {
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const [dailyRange, setDailyRange] = useState<DailyRange>(defaultDailyRange());
  const [weeklyPeriod, setWeeklyPeriod] = useState<WeeklyPeriod>(defaultWeeklyPeriod());
  const [monthlyYear, setMonthlyYear] = useState<number>(defaultMonthlyYear());
  const [data, setData] = useState<NormalizedUserStatPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const raw =
          granularity === "daily"
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
              });
        setData(normalizeUserStats(granularity, raw));
        setError(null);
      } catch (err) {
        const msg =
          (err as any)?.response?.data?.message ||
          (err as Error)?.message ||
          "사용자 통계를 불러오지 못했습니다.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [active, granularity, dailyRange.start, dailyRange.end, weeklyPeriod.year, weeklyPeriod.month, monthlyYear]);

  const latest = useMemo(() => data[data.length - 1], [data]);

  return (
    <Card className="card-shadow overflow-hidden">
      <CardHeader className="bg-muted/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span>사용자 통계</span>
        </div>
        <CardTitle className="text-xl">가입/활성 사용자 추이</CardTitle>
        <p className="text-sm text-muted-foreground">기간과 단위를 선택해 사용자 추이를 확인하세요.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <AdminUserStatsControls
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
            <AdminUserStatsSummary
              latest={latest}
              granularity={granularity}
              dailyRange={dailyRange}
              weeklyPeriod={weeklyPeriod}
              monthlyYear={monthlyYear}
            />

            <AdminUserStatsChart data={data} />

            <AdminUserStatsTable data={data} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
