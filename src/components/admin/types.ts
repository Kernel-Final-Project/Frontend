import { LucideIcon } from "lucide-react";

export type AdminSection = "notice" | "user" | "code" | "workflow" | "work" | "stats" | "blog" | "site-request";

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

export type UserFilterInfo = {
  userId: number;
  userName: string;
};

export type WorkflowFilterInfo = {
  workflowId: number;
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

export type BlogStatPoint = {
  statDate?: string;
  week?: string;
  startDate?: string;
  endDate?: string;
  yearMonth?: string;
  postCount: number;
};

export type NormalizedBlogStatPoint = {
  label: string;
  postCount: number;
  postGrowthRate: number;
};

export type SiteRequest = {
  requestId: number;
  siteUrl: string;
  siteName: string;
  state: string;
  description: string | null;
  createdAt: string;
};

export type SiteRequestPageResponse = {
  content: SiteRequest[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
};
