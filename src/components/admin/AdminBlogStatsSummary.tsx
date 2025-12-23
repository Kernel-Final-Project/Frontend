import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Granularity, NormalizedBlogStatPoint, DailyRange, WeeklyPeriod } from "./types";
import { formatRate, granularityOptions } from "./blogStatsUtils";

type Props = {
  latest?: NormalizedBlogStatPoint;
  granularity: Granularity;
  dailyRange: DailyRange;
  weeklyPeriod: WeeklyPeriod;
  monthlyYear: number;
};

export function AdminBlogStatsSummary({ latest, granularity, dailyRange, weeklyPeriod, monthlyYear }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card className="border border-border/80">
        <CardHeader className="py-3">
          <p className="text-xs text-muted-foreground">총 포스트 수</p>
          <CardTitle className="text-xl">{latest ? latest.postCount.toLocaleString() : "-"}</CardTitle>
          <p className="text-xs text-muted-foreground">전 기간 대비 {formatRate(latest?.postGrowthRate ?? 0)}</p>
        </CardHeader>
      </Card>
      <Card className="border border-border/80">
        <CardHeader className="py-3">
          <p className="text-xs text-muted-foreground">최근 기간</p>
          <CardTitle className="text-xl">{latest?.label ?? "-"}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {latest && latest.postGrowthRate >= 0 ? "증가 추세" : "감소 추세"}
          </p>
        </CardHeader>
      </Card>
      <Card className="border border-border/80">
        <CardHeader className="py-3">
          <p className="text-xs text-muted-foreground">조회 기간</p>
          <CardTitle className="text-xl">
            {granularity === "daily" && (
              <>
                {dailyRange.start} ~ {dailyRange.end}
              </>
            )}
            {granularity === "weekly" && `${weeklyPeriod.year}년 ${weeklyPeriod.month}월`}
            {granularity === "monthly" && `${monthlyYear}년`}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            단위: {granularityOptions.find((g) => g.value === granularity)?.label}
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}
