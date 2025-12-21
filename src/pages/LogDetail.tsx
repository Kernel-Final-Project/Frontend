import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { workService, type WorkLogEntry } from "@/services/workService";

const STEP_NAME_DISPLAY_MAP: Record<string, string> = {
  요청_수신: "요청 수신",
  request_received: "요청 수신",
  상품_크롤링: "상품 크롤링",
  product_crawling: "상품 크롤링",
  경로_분기: "경로 분기",
  branch: "경로 분기",
  상품_선택: "상품 선택",
  product_select: "상품 선택",
  find_product: "상품 선택",
  generate_content: "콘텐츠 생성",
};

const HIDDEN_STEP_KEYS = new Set([
  "send_log_webhook",
  "send log webhook",
]);

const MESSAGE_STEP_KEYS = new Set([
  "상품_크롤링",
  "product_crawling",
  "상품_선택",
  "product_select",
  "find_product",
  "generate_content",
  "키워드_선택",
  "키워드선택",
  "keyword_select",
  "키워드전송",
  "키워드_전송",
  "keyword_send",
]);

const normalizeKey = (value?: string) =>
  value?.trim().toLowerCase().replace(/\s+/g, "_") || "";

const getFriendlyStepName = (stepName?: string) => {
  if (!stepName) return "단계 정보 없음";
  const normalized = normalizeKey(stepName);
  if (normalized && STEP_NAME_DISPLAY_MAP[normalized]) {
    return STEP_NAME_DISPLAY_MAP[normalized];
  }

  if (stepName.includes("_")) {
    return stepName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return stepName;
};

const getStatusMeta = (status?: string) => {
  const key = normalizeKey(status);

  switch (key) {
    case "성공":
    case "success":
      return {
        label: "성공",
        className: "bg-emerald-500/10 text-emerald-600 border border-emerald-400/40",
      };
    case "진행중":
    case "progress":
    case "processing":
    case "running":
      return {
        label: "진행중",
        className: "bg-amber-500/10 text-amber-600 border border-amber-400/40",
      };
    case "대기":
    case "pending":
      return {
        label: "대기",
        className: "bg-slate-500/10 text-slate-600 border border-slate-400/40",
      };
    case "실패":
    case "failed":
    case "error":
      return {
        label: "실패",
        className: "bg-rose-500/10 text-rose-600 border border-rose-400/40",
      };
    default:
      return {
        label: status ?? "확인 필요",
        className: "bg-muted text-muted-foreground border border-border",
      };
  }
};

const getStatusIndicatorClasses = (status?: string) => {
  const key = normalizeKey(status);

  switch (key) {
    case "성공":
    case "success":
      return "bg-emerald-500 border-emerald-500";
    case "진행중":
    case "progress":
    case "processing":
    case "running":
      return "bg-amber-400 border-amber-400";
    case "실패":
    case "failed":
    case "error":
      return "bg-rose-500 border-rose-500";
    case "대기":
    case "pending":
      return "bg-slate-400 border-slate-400";
    default:
      return "bg-muted border-border";
  }
};

const formatTimestamp = (value?: string) => {
  if (!value) return "시간 정보 없음";
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    return value.replace("T", " ");
  }

  return parsed.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function LogDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workId } = useParams();
  const parentWorkflowId = (location.state as { workflowId?: number } | null)?.workflowId;
  const numericWorkId = workId ? Number(workId) : undefined;
  const [collapsedSteps, setCollapsedSteps] = useState<Record<number, boolean>>({});
  const {
    data,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["workLog", numericWorkId],
    enabled: Boolean(numericWorkId),
    queryFn: () => workService.getWorkLogs(numericWorkId!),
  });

  const rawSteps: WorkLogEntry[] = useMemo(() => data?.data ?? [], [data]);
  const steps: WorkLogEntry[] = useMemo(
    () =>
      rawSteps.filter((step) => {
        const normalized = normalizeKey(step.stepName);
        return normalized ? !HIDDEN_STEP_KEYS.has(normalized) : true;
      }),
    [rawSteps]
  );
  const statusMessage = (error as Error | undefined)?.message ?? "로그를 불러오지 못했습니다.";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (parentWorkflowId) {
              navigate(`/workflow/${parentWorkflowId}`);
            } else {
              navigate("/workflows");
            }
          }}
          className="mb-6 hover:bg-muted"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">워크 관리 (상세 로그)</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              워크플로우별 발행된 워크를 확인하세요.
            </p>
          </div>

          {!numericWorkId ? (
            <div className="p-6 rounded-xl border border-border bg-muted/20 text-sm text-muted-foreground">
              잘못된 접근입니다. 워크 정보를 다시 확인해주세요.
            </div>
          ) : (
            <div className="space-y-5">
              {isLoading && (
                <div className="space-y-4">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="relative pl-10 pb-6 last:pb-0 border-l border-border">
                      <span className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-muted" />
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-40 bg-muted/60 animate-pulse rounded mt-2" />
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && isError && (
                <div className="p-6 rounded-xl border border-destructive/40 bg-destructive/10 text-sm text-destructive">
                  {statusMessage}
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={() => refetch()}
                  >
                    다시 불러오기
                  </Button>
                </div>
              )}

              {!isLoading && !isError && steps.length === 0 && (
                <div className="p-6 rounded-xl border border-border bg-muted/20 text-sm text-muted-foreground">
                  표시할 로그가 없습니다.
                </div>
              )}

              {!isLoading && !isError && steps.length > 0 && (
                <div className="space-y-8">
                    {steps.map((step, index) => {
                      const statusMeta = getStatusMeta(step.status);
                      const indicatorClass = getStatusIndicatorClasses(step.status);
                      const normalizedStepKey = normalizeKey(step.stepName);
                      const showMessages =
                        MESSAGE_STEP_KEYS.has(normalizedStepKey) && step.messages.length > 0;
                      const isCollapsed = collapsedSteps[index] ?? false;

                      return (
                        <div key={`${step.stepName}-${step.timestamp}-${index}`} className="relative pl-12">
                          {index !== steps.length - 1 && (
                            <span className="absolute left-[11px] top-5 bottom-[-32px] w-px bg-border" />
                          )}
                          <span
                            className={`absolute left-0 top-2 w-5 h-5 rounded-full border ${indicatorClass}`}
                          />

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-foreground">
                                {getFriendlyStepName(step.stepName)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatTimestamp(step.timestamp)}
                              </div>
                            </div>

                            <Badge variant="outline" className={`${statusMeta.className} sr-only`}>
                              {statusMeta.label}
                            </Badge>
                          </div>

                          {showMessages && (
                            <div className="mt-4 rounded-xl border border-border bg-background px-5 py-4">
                              <div className="relative mb-3 text-xs text-muted-foreground pr-8">
                                메시지 {step.messages.length}건
                                <button
                                  type="button"
                                  className="absolute top-0 right-0 w-7 h-7 rounded flex items-center justify-center text-base leading-none text-muted-foreground hover:bg-muted focus:outline-none"
                                  onClick={() =>
                                    setCollapsedSteps((prev) => ({
                                      ...prev,
                                      [index]: !isCollapsed,
                                    }))
                                  }
                                >
                                  {isCollapsed ? "⌄" : "⌃"}
                                </button>
                              </div>

                              {!isCollapsed && (
                                <ol className="space-y-3 text-sm text-muted-foreground">
                                  {step.messages.map((message, idx) => (
                                    <li key={`${idx}-${message.slice(0, 10)}`} className="flex gap-2">
                                      <span className="text-xs text-muted-foreground font-mono">
                                        {idx + 1}.
                                      </span>
                                      <span className="whitespace-pre-wrap break-words break-all font-mono text-[13px]">
                                        {message}
                                      </span>
                                    </li>
                                  ))}
                                </ol>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
