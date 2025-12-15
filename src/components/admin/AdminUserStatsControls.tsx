import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Granularity, DailyRange, WeeklyPeriod } from "./types";
import { granularityOptions } from "./userStatsUtils";

type Props = {
  granularity: Granularity;
  dailyRange: DailyRange;
  weeklyPeriod: WeeklyPeriod;
  monthlyYear: number;
  onGranularityChange: (value: Granularity) => void;
  onDailyRangeChange: (range: DailyRange) => void;
  onWeeklyPeriodChange: (period: WeeklyPeriod) => void;
  onMonthlyYearChange: (year: number) => void;
  onReset: () => void;
};

export function AdminUserStatsControls({
  granularity,
  dailyRange,
  weeklyPeriod,
  monthlyYear,
  onGranularityChange,
  onDailyRangeChange,
  onWeeklyPeriodChange,
  onMonthlyYearChange,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {granularity === "daily" && (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">시작일</span>
              <Input
                type="date"
                value={dailyRange.start}
                onChange={(e) => onDailyRangeChange({ ...dailyRange, start: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">종료일</span>
              <Input
                type="date"
                value={dailyRange.end}
                onChange={(e) => onDailyRangeChange({ ...dailyRange, end: e.target.value })}
              />
            </div>
          </>
        )}

        {granularity === "weekly" && (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">연도</span>
              <Input
                type="number"
                min={2000}
                className="no-spin"
                value={weeklyPeriod.year}
                onChange={(e) => onWeeklyPeriodChange({ ...weeklyPeriod, year: Number(e.target.value) || weeklyPeriod.year })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">월</span>
              <Input
                type="number"
                min={1}
                max={12}
                className="no-spin"
                value={weeklyPeriod.month}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (Number.isNaN(value)) return;
                  const month = Math.min(12, Math.max(1, value));
                  onWeeklyPeriodChange({ ...weeklyPeriod, month });
                }}
              />
            </div>
          </>
        )}

        {granularity === "monthly" && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">연도</span>
            <Input
              type="number"
              min={2000}
              className="no-spin"
              value={monthlyYear}
              onChange={(e) => onMonthlyYearChange(Number(e.target.value) || monthlyYear)}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">단위</span>
          <div className="flex gap-2">
            {granularityOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={granularity === opt.value ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onGranularityChange(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
