import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowUp, ArrowDown, Users, FileText, Clock, Loader2, AlertCircle } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Granularity } from "./types";

type StatCardProps = {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
};

function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {Math.abs(change)}%
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardSection({ active }: { active?: boolean }) {
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const { summary, trendData, platformData, loading, error } = useDashboardStats(active || false, granularity);

  if (!active) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>대시보드 데이터를 불러오는 중입니다...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-5 w-5" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background/70 py-10 text-center text-muted-foreground">
        데이터가 없습니다.
      </div>
    );
  }

  // 실제 데이터로 통계 카드 생성
  const stats = [
    {
      title: "이용자",
      value: `${summary.totalUsers.toLocaleString()} 명`,
      change: summary.userGrowthRate,
      icon: <Users className="h-6 w-6 text-blue-600" />
    },
    {
      title: "발행 수",
      value: `${summary.totalPosts.toLocaleString()} 건`,
      change: summary.postGrowthRate,
      icon: <FileText className="h-6 w-6 text-blue-600" />
    },
    {
      title: "TODAY",
      value: `${summary.todayActiveUsers}`,
      change: summary.todayActiveGrowthRate,
      icon: <Clock className="h-6 w-6 text-blue-600" />
    },
  ];

  // 플랫폼별 발행 통계 - API 데이터 가공
  const totalPlatformPosts = platformData.reduce((sum, p) => sum + p.postCount, 0);
  const platformChartData = platformData.map(p => ({
    name: p.platformName,
    value: p.postCount,
    percentage: totalPlatformPosts > 0 ? Math.round((p.postCount / totalPlatformPosts) * 100) : 0,
  }));

  // 파이 차트 색상
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* 발행 추이 그래프 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>발행 추이</CardTitle>
              <CardDescription>
                이용자수, 포스트 수 ({granularity === "daily" ? "최근 7일" : granularity === "weekly" ? "최근 8주" : "최근 12개월"})
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setGranularity("daily")}
                className={`px-3 py-1 text-sm rounded transition-colors ${granularity === "daily" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                일별
              </button>
              <button
                onClick={() => setGranularity("weekly")}
                className={`px-3 py-1 text-sm rounded transition-colors ${granularity === "weekly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                주별
              </button>
              <button
                onClick={() => setGranularity("monthly")}
                className={`px-3 py-1 text-sm rounded transition-colors ${granularity === "monthly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                월별
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trendData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              추이 데이터가 없습니다.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#f97316" name="이용자 수" strokeWidth={2} />
                <Line type="monotone" dataKey="posts" stroke="#ef4444" name="포스트 수" strokeWidth={2} />
                {/* AI 비용은 추후 API 연동 예정 */}
                {/* <Line type="monotone" dataKey="aiCost" stroke="#9ca3af" name="AI 비용 수" strokeWidth={2} /> */}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 플랫폼별 발행 통계 & 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 플랫폼별 발행 통계 */}
        <Card>
          <CardHeader>
            <CardTitle>플랫폼별 발행 통계</CardTitle>
            <CardDescription>총 {totalPlatformPosts.toLocaleString()}건 (최근 30일)</CardDescription>
          </CardHeader>
          <CardContent>
            {platformChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                플랫폼별 데이터가 없습니다.
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={platformChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {platformChartData.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-gray-600">{platform.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {platform.value.toLocaleString()}건 ({platform.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 최근 활동 (시스템 로그) */}
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>시스템 로그</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex items-center justify-between text-sm border-b pb-2">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">2025-11-{String(item).padStart(2, "0")} 08:00</span>
                    <span className="text-gray-500 text-xs">LogId/UserName</span>
                  </div>
                  <span className="text-gray-400 text-xs">default</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">시스템 로그 기능은 추후 구현 예정입니다.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}