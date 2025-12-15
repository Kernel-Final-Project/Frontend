import { LucideIcon } from "lucide-react";

export type AdminSection = "notice" | "user" | "code" | "stats";

export type AdminNavItem = {
  id: AdminSection;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type NoticeRow = {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  important: boolean;
};

export type AdminUser = {
  userId: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

export type UserStatPoint = {
  statDate?: string;
  weekNumber?: number;
  weekPeriod?: string;
  month?: number | string;
  monthPeriod?: string;
  totalUsers: number;
  userGrowthRate: number;
  activeUsersToday?: number;
  activeUsers?: number;
  activeUserGrowthRate: number;
};

export type Granularity = "daily" | "weekly" | "monthly";

export type NormalizedUserStatPoint = {
  label: string;
  totalUsers: number;
  userGrowthRate: number;
  activeUsers: number;
  activeUserGrowthRate: number;
};

export type DailyRange = { start: string; end: string };
export type WeeklyPeriod = { year: number; month: number };
