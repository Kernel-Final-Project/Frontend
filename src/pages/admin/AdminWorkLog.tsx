import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ClipboardList } from "lucide-react";

import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { workService, type AdminWorkLogEntry } from "@/services/workService";

const statusColorMap: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-600 border border-emerald-400/30",
  warn: "bg-amber-500/10 text-amber-600 border border-amber-400/30",
  warning: "bg-amber-500/10 text-amber-600 border border-amber-400/30",
  info: "bg-blue-500/10 text-blue-600 border border-blue-400/30",
  error: "bg-rose-500/10 text-rose-600 border border-rose-400/30",
};

const getStatusBadgeClass = (status?: string) => {
  if (!status) return "bg-muted text-foreground border border-border";
  const key = status.toLowerCase();
  return statusColorMap[key] ?? "bg-muted text-foreground border border-border";
};

export default function AdminWorkLog() {
  const navigate = useNavigate();
  const { workId } = useParams();
  const numericWorkId = workId ? Number(workId) : undefined;

  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["adminWorkLog", numericWorkId],
    enabled: Boolean(numericWorkId),
    queryFn: () => workService.getAdminWorkLogs(numericWorkId!),
  });

  const logs: AdminWorkLogEntry[] = useMemo(() => data?.data ?? [], [data]);
  const statusMessage = (error as Error | undefined)?.message ?? "관리자 로그를 불러오지 못했습니다.";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="gap-2 h-10 px-4 rounded-lg hover:bg-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            관리자 대시보드로 돌아가기
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            관리자용 작업 로그
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            워크 ID {workId}에 대한 전체 로그를 확인하세요.
          </p>
        </div>

        {!numericWorkId && (
          <div className="p-6 rounded-xl border border-border bg-muted/20 text-sm text-muted-foreground">
            잘못된 접근입니다. 워크 아이디를 확인해주세요.
          </div>
        )}

        {numericWorkId && (
          <div className="space-y-5">
            {isLoading && (
              <div className="space-y-4">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="rounded-xl border border-dashed border-border p-5">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-48 bg-muted/60 animate-pulse rounded mt-3" />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && isError && (
              <div className="p-6 rounded-xl border border-destructive/40 bg-destructive/10 text-sm text-destructive">
                {statusMessage}
                <Button variant="outline" size="sm" className="ml-4" onClick={() => refetch()}>
                  다시 불러오기
                </Button>
              </div>
            )}

            {!isLoading && !isError && logs.length === 0 && (
              <div className="p-6 rounded-xl border border-border bg-muted/20 text-sm text-muted-foreground">
                표시할 로그가 없습니다.
              </div>
            )}

            {!isLoading && !isError && logs.length > 0 && (
              <div className="space-y-4">
                {logs
                  .sort((a, b) => a.stepNumber - b.stepNumber || b.createdAt.localeCompare(a.createdAt))
                  .map((log) => (
                    <div key={log.logId} className="rounded-2xl border border-border bg-card shadow-sm p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {log.stepNumber}. {log.stepName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString("ko-KR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusBadgeClass(log.status)}>
                            {log.status}
                          </Badge>
                          <Badge variant="outline" className="text-[11px] uppercase tracking-wide">
                            {log.logLevel}
                          </Badge>
                        </div>
                      </div>

                      <pre className="text-xs text-muted-foreground bg-background/70 rounded-xl border border-border p-4 whitespace-pre-wrap font-mono">
                        {log.logData}
                      </pre>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
