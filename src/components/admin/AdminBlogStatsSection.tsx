import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BarChart3, Loader2 } from "lucide-react";
import { AdminBlogStatsControls } from "./AdminBlogStatsControls";
import { AdminBlogStatsSummary } from "./AdminBlogStatsSummary";
import { AdminBlogStatsChart } from "./AdminBlogStatsChart";
import { AdminBlogStatsTable } from "./AdminBlogStatsTable";
import { defaultDailyRange, defaultMonthlyYear, defaultWeeklyPeriod, normalizeBlogStats } from "./blogStatsUtils";
import { useStatistics } from "@/hooks/useStatistics";

type AdminBlogStatsSectionProps = {
  active: boolean;
};

export function AdminBlogStatsSection({ active }: AdminBlogStatsSectionProps) {
  const {
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
  } = useStatistics({
    active,
    statType: "blog",
    normalizeStats: normalizeBlogStats,
    defaultDailyRange,
    defaultWeeklyPeriod,
    defaultMonthlyYear,
    errorMessage: "블로그 통계를 불러오지 못했습니다.",
  });

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
