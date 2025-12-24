import api from "@/lib/api";
import { Granularity, UserStatPoint, BlogStatPoint, DashboardSummary, DashboardTrendPoint, PlatformStatistics } from "@/components/admin/types";

export const statisticsService = {
  async getUserStats(
    params:
      | { granularity: "daily"; startDate: string; endDate: string }
      | { granularity: "weekly"; year: number; month: number }
      | { granularity: "monthly"; year: number }
  ) {
    const { granularity } = params;
    const query =
      granularity === "daily"
        ? { startDate: params.startDate, endDate: params.endDate }
        : granularity === "weekly"
        ? { year: params.year, month: params.month }
        : { year: params.year };

    const res = await api.get(`/api/v1/admin/statistics/${granularity}/users`, { params: query });
    return (res.data?.data as UserStatPoint[]) ?? [];
  },

  async getBlogStats(
    params:
      | { granularity: "daily"; startDate: string; endDate: string }
      | { granularity: "weekly"; year: number; month: number }
      | { granularity: "monthly"; year: number }
  ) {
    const { granularity } = params;
    const query =
      granularity === "daily"
        ? { startDate: params.startDate, endDate: params.endDate }
        : granularity === "weekly"
        ? { year: params.year, month: params.month }
        : { year: params.year };

    const res = await api.get(`/api/v1/admin/statistics/${granularity}/posts`, { params: query });
    return (res.data?.data as BlogStatPoint[]) ?? [];
  },

  async reaggregateStats(startDate: string, endDate: string) {
    const res = await api.post('/api/v1/admin/statistics/manual-aggregate-range', null, {
      params: { startDate, endDate }
    });
    return res.data;
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    // 오늘과 어제 데이터 가져오기
    const [todayUserStats, yesterdayUserStats, todayBlogStats, yesterdayBlogStats] = await Promise.all([
      this.getUserStats({ granularity: "daily", startDate: todayStr, endDate: todayStr }),
      this.getUserStats({ granularity: "daily", startDate: yesterdayStr, endDate: yesterdayStr }),
      this.getBlogStats({ granularity: "daily", startDate: todayStr, endDate: todayStr }),
      this.getBlogStats({ granularity: "daily", startDate: yesterdayStr, endDate: yesterdayStr }),
    ]);

    const todayUser = todayUserStats[0] || { totalUsers: 0, userGrowthRate: 0, activeUsersToday: 0, activeUserGrowthRate: 0 };
    const yesterdayUser = yesterdayUserStats[0] || { totalUsers: 0, activeUsersToday: 0 };
    const todayBlog = todayBlogStats[0] || { postCount: 0 };
    const yesterdayBlog = yesterdayBlogStats[0] || { postCount: 0 };

    // 증감률 계산
    const userGrowthRate = todayUser.userGrowthRate || 0;
    const postGrowthRate = yesterdayBlog.postCount > 0
      ? Math.round(((todayBlog.postCount - yesterdayBlog.postCount) / yesterdayBlog.postCount) * 100)
      : 0;
    const todayActiveGrowthRate = yesterdayUser.activeUsersToday && yesterdayUser.activeUsersToday > 0
      ? Math.round(((todayUser.activeUsersToday || 0) - yesterdayUser.activeUsersToday) / yesterdayUser.activeUsersToday * 100)
      : 0;

    return {
      totalUsers: todayUser.totalUsers,
      userGrowthRate,
      totalPosts: todayBlog.postCount,
      postGrowthRate,
      todayActiveUsers: todayUser.activeUsersToday || 0,
      todayActiveGrowthRate,
    };
  },

  async getDashboardTrend(): Promise<DashboardTrendPoint[]> {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6); // 최근 7일

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    const [userStats, blogStats] = await Promise.all([
      this.getUserStats({ granularity: "daily", startDate: startStr, endDate: endStr }),
      this.getBlogStats({ granularity: "daily", startDate: startStr, endDate: endStr }),
    ]);

    // 날짜별 매핑
    const trendMap = new Map<string, DashboardTrendPoint>();

    userStats.forEach(stat => {
      if (stat.statDate) {
        trendMap.set(stat.statDate, {
          date: stat.statDate,
          users: stat.totalUsers,
          posts: 0,
        });
      }
    });

    blogStats.forEach(stat => {
      if (stat.statDate) {
        const existing = trendMap.get(stat.statDate);
        if (existing) {
          existing.posts = stat.postCount;
        } else {
          trendMap.set(stat.statDate, {
            date: stat.statDate,
            users: 0,
            posts: stat.postCount,
          });
        }
      }
    });

    return Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  },

  async getPlatformStatistics(startDate: string, endDate: string): Promise<PlatformStatistics[]> {
    const res = await api.get('/api/v1/admin/statistics/blog-platforms', {
      params: { startDate, endDate }
    });
    return (res.data?.data as PlatformStatistics[]) ?? [];
  },
};

