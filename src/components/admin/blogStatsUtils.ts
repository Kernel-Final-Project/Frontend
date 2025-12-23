import { Granularity, NormalizedBlogStatPoint, BlogStatPoint } from "./types";

export const granularityOptions: { value: Granularity; label: string }[] = [
  { value: "daily", label: "일별" },
  { value: "weekly", label: "주별" },
  { value: "monthly", label: "월별" },
];

export const formatRate = (value: number) => `${(value ?? 0).toFixed(1)}%`;

export const toDateInputString = (date: Date) => date.toISOString().slice(0, 10);

export const defaultDailyRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return { start: toDateInputString(start), end: toDateInputString(end) };
};

export const defaultWeeklyPeriod = () => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

export const defaultMonthlyYear = () => new Date().getFullYear();

export const normalizeBlogStats = (granularity: Granularity, rows: BlogStatPoint[]): NormalizedBlogStatPoint[] => {
  const toNumber = (value: unknown) => {
    if (typeof value === "number") return value;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  return rows.map((row, idx) => {
    let label: string;
    switch (granularity) {
      case "daily":
        label = row.statDate ?? `일자-${idx + 1}`;
        break;
      case "weekly":
        if (row.startDate && row.endDate) {
          label = `${row.startDate} ~ ${row.endDate}`;
        } else if (row.week) {
          label = row.week;
        } else {
          label = `주차-${idx + 1}`;
        }
        break;
      default:
        if (row.yearMonth) {
          label = row.yearMonth;
        } else if (row.startDate && row.endDate) {
          label = `${row.startDate} ~ ${row.endDate}`;
        } else {
          label = `월-${idx + 1}`;
        }
        break;
    }

    // 증가율 계산 (전 기간 대비)
    const postGrowthRate = idx > 0 && rows[idx - 1].postCount > 0
      ? ((row.postCount - rows[idx - 1].postCount) / rows[idx - 1].postCount) * 100
      : 0;

    return {
      label,
      postCount: toNumber(row.postCount),
      postGrowthRate,
    };
  });
};
