import { Granularity, NormalizedUserStatPoint, UserStatPoint } from "./types";

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

export const normalizeUserStats = (granularity: Granularity, rows: UserStatPoint[]): NormalizedUserStatPoint[] => {
  const toNumber = (value: unknown) => {
    if (typeof value === "number") return value;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  return rows.map((row, idx) => {
    if (granularity === "daily") {
      return {
        label: row.statDate ?? `일자-${idx + 1}`,
        totalUsers: toNumber(row.totalUsers),
        userGrowthRate: toNumber(row.userGrowthRate),
        activeUsers: toNumber(row.activeUsersToday ?? row.activeUsers),
        activeUserGrowthRate: toNumber(row.activeUserGrowthRate),
      };
    }

    if (granularity === "weekly") {
      const label = row.weekPeriod ?? (row.weekNumber !== undefined ? `W${row.weekNumber}` : `주차-${idx + 1}`);
      return {
        label,
        totalUsers: toNumber(row.totalUsers),
        userGrowthRate: toNumber(row.userGrowthRate),
        activeUsers: toNumber(row.activeUsers ?? row.activeUsersToday),
        activeUserGrowthRate: toNumber(row.activeUserGrowthRate),
      };
    }

    // monthly
    const label = row.monthPeriod ?? (row.month !== undefined ? `${row.month}` : row.statDate ?? `월-${idx + 1}`);
    return {
      label,
      totalUsers: toNumber(row.totalUsers),
      userGrowthRate: toNumber(row.userGrowthRate),
      activeUsers: toNumber(row.activeUsers ?? row.activeUsersToday),
      activeUserGrowthRate: toNumber(row.activeUserGrowthRate),
    };
  });
};
