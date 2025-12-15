import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Granularity, NormalizedUserStatPoint, DailyRange, WeeklyPeriod } from "./types";
import { formatRate, granularityOptions } from "./userStatsUtils";

type Props = {
  latest?: NormalizedUserStatPoint;
  granularity: Granularity;
  dailyRange: DailyRange;
  weeklyPeriod: WeeklyPeriod;
  monthlyYear: number;
};

export function AdminUserStatsSummary({ latest, granularity, dailyRange, weeklyPeriod, monthlyYear }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card className="border border-border/80">
        <CardHeader className="py-3">
          <p className="text-xs text-muted-foreground">총 사용자</p>
          <CardTitle className="text-xl">{latest ? latest.totalUsers.toLocaleString() : "-"}</CardTitle>
          <p className="text-xs text-muted-foreground">전일 대비 {formatRate(latest?.userGrowthRate ?? 0)}</p>
        </CardHeader>
      </Card>
      <Card className="border border-border/80">
        <CardHeader className="py-3">
          <p className="text-xs text-muted-foreground">활성 사용자</p>
          <CardTitle className="text-xl">{latest ? latest.activeUsers.toLocaleString() : "-"}</CardTitle>
          <p className="text-xs text-muted-foreground">전일 대비 {formatRate(latest?.activeUserGrowthRate ?? 0)}</p>
        </CardHeader>
      </Card>
      <Card className="border border-border/80">
        <CardHeader className="py-3">
          <p className="text-xs text-muted-foreground">기간</p>
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
