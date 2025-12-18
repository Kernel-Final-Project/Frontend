import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Globe, Link2, Calendar, Tag, Settings, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { workflowService, WorkflowDetailResponse } from "@/services/workflowService";
import { AdminWorkflowEditForm } from "./AdminWorkflowEditForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AdminWorkflowDetailModalProps = {
  workflowId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (workflowId: number) => void;
};

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "dark"
> = {
  ACTIVE: "success",
  PENDING: "warning",
  INACTIVE: "secondary",
  DELETED: "destructive",
  COMPLETED: "success",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "활성",
  PENDING: "대기",
  INACTIVE: "비활성",
  DELETED: "삭제됨",
  COMPLETED: "완료",
};


export function AdminWorkflowDetailModal({ workflowId, open, onOpenChange, onDelete }: AdminWorkflowDetailModalProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowDetailResponse | null>(null);
  const [upcomingDates, setUpcomingDates] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!open || workflowId == null) return;

    // 모달이 열릴 때마다 편집 모드 초기화
    setEditMode(false);

    const fetchWorkflow = async () => {
      try {
        setLoading(true);
        const response = await workflowService.getWorkflowById(workflowId);
        if (response.success) {
          setWorkflow(response.data);
          setError(null);

          // 다음 실행 예정일 계산 (임시로 빈 배열, 추후 API로 받아올 수 있음)
          // TODO: API에서 다음 실행 예정일을 받아오도록 수정
          const dates = calculateUpcomingDates(response.data.recurrenceRule);
          setUpcomingDates(dates);
        }
      } catch (err) {
        const msg =
          (err as any)?.response?.data?.message ||
          (err as Error)?.message ||
          "워크플로우 정보를 불러오지 못했습니다.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [open, workflowId]);

  // 다음 실행 예정일 계산 함수 (간단한 예시)
  const calculateUpcomingDates = (rule: any): string[] => {
    const dates: string[] = [];
    const startDate = new Date(rule.startAt);
    const now = new Date();

    // 시작일이 미래라면 시작일부터, 아니면 현재 시점부터
    let currentDate = startDate > now ? new Date(startDate) : new Date(now);

    // 최대 10개의 다음 실행 예정일 계산
    for (let i = 0; i < 10; i++) {
      if (rule.endAt && currentDate > new Date(rule.endAt)) break;

      dates.push(currentDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      }));

      // 반복 타입에 따라 다음 날짜 계산
      switch (rule.repeatType) {
        case 'DAILY':
          currentDate.setDate(currentDate.getDate() + (rule.repeatInterval || 1));
          break;
        case 'WEEKLY':
          currentDate.setDate(currentDate.getDate() + 7 * (rule.repeatInterval || 1));
          break;
        case 'MONTHLY':
          currentDate.setMonth(currentDate.getMonth() + (rule.repeatInterval || 1));
          break;
        case 'ONCE':
          break;
        default:
          currentDate.setDate(currentDate.getDate() + 1);
      }

      if (rule.repeatType === 'ONCE') break;
    }

    return dates;
  };

  const handleEditSuccess = () => {
    setEditMode(false);
    // 수정 후 다시 데이터 로드
    if (workflowId) {
      const fetchWorkflow = async () => {
        try {
          setLoading(true);
          const response = await workflowService.getWorkflowById(workflowId);
          if (response.success) {
            setWorkflow(response.data);
            const dates = calculateUpcomingDates(response.data.recurrenceRule);
            setUpcomingDates(dates);
          }
        } catch (err) {
          console.error("워크플로우 재로드 실패:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkflow();
    }
  };

  const handleEditCancel = () => {
    setEditMode(false);
  };

  // 편집 모드일 때 수정 폼 표시
  if (editMode && workflowId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditCancel}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle>워크플로우 수정</DialogTitle>
                <DialogDescription>워크플로우 정보를 수정합니다.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <AdminWorkflowEditForm
              workflowId={workflowId}
              onCancel={handleEditCancel}
              onSuccess={handleEditSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>워크플로우 상세 정보</DialogTitle>
          <DialogDescription>워크플로우의 상세 정보를 확인할 수 있습니다.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            불러오는 중입니다...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive text-sm">
            {error}
          </div>
        ) : workflow ? (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">워크플로우 #{workflow.workflowId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {workflow.userName ? `${workflow.userName} (ID: ${workflow.userId})` : `사용자 ID ${workflow.userId}`}
                    </p>
                    <Badge
                      variant={statusVariant[workflow.status] ?? "default"}
                      className="tracking-tight"
                    >
                      {statusLabels[workflow.status] || workflow.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  수정
                </Button>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    삭제
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* 사이트 정보 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                사이트 정보
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                {workflow.siteName && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">사이트 이름</p>
                    <p className="text-sm text-foreground font-medium">{workflow.siteName}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">사이트 주소</p>
                  <a
                    href={workflow.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all block"
                  >
                    {workflow.siteUrl}
                  </a>
                </div>
              </div>
            </div>

            {/* 블로그 정보 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                블로그 정보
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">블로그</p>
                  <p className="text-sm text-foreground font-medium">{workflow.blogType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">블로그 주소</p>
                  <a
                    href={workflow.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all block"
                  >
                    {workflow.blogUrl}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">계정 아이디</p>
                  <p className="text-sm text-foreground font-mono">{workflow.blogAccountId}</p>
                </div>
              </div>
            </div>

            {/* 카테고리 정보 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                트렌드 카테고리
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                {(workflow.setTrendCategory.depth1Category || workflow.setTrendCategory.depth2Category || workflow.setTrendCategory.depth3Category) && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">선택된 카테고리</p>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      {workflow.setTrendCategory.depth1Category && (
                        <Badge variant="secondary">{workflow.setTrendCategory.depth1Category}</Badge>
                      )}
                      {workflow.setTrendCategory.depth2Category && (
                        <>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant="secondary">{workflow.setTrendCategory.depth2Category}</Badge>
                        </>
                      )}
                      {workflow.setTrendCategory.depth3Category && (
                        <>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant="secondary">{workflow.setTrendCategory.depth3Category}</Badge>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 스케줄 정보 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                반복 스케줄
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">스케줄 설명</p>
                  <p className="text-sm text-foreground font-medium">{workflow.recurrenceRule.readableRule || "정보 없음"}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">반복 유형</p>
                    <p className="text-sm text-foreground">{workflow.recurrenceRule.repeatType}</p>
                  </div>
                  {workflow.recurrenceRule.repeatInterval && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">반복 간격</p>
                      <p className="text-sm text-foreground">{workflow.recurrenceRule.repeatInterval}</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">시작일</p>
                    <p className="text-sm text-foreground">
                      {new Date(workflow.recurrenceRule.startAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {workflow.recurrenceRule.endAt && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">종료일</p>
                      <p className="text-sm text-foreground">
                        {new Date(workflow.recurrenceRule.endAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
                {workflow.recurrenceRule.daysOfWeek && workflow.recurrenceRule.daysOfWeek.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">실행 요일</p>
                    <div className="flex items-center gap-1">
                      {workflow.recurrenceRule.daysOfWeek.map((d, idx) => (
                        <Badge key={idx} variant="outline" className="font-medium">
                          {['일', '월', '화', '수', '목', '금', '토'][d]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {workflow.recurrenceRule.timesOfDay && workflow.recurrenceRule.timesOfDay.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">실행 시간</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {workflow.recurrenceRule.timesOfDay.map((time, idx) => (
                        <Badge key={idx} variant="outline" className="font-mono">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 다음 실행 예정일 */}
            {upcomingDates.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    다음 실행 예정일 (최대 10개)
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {upcomingDates.map((date, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground min-w-[20px]">{idx + 1}.</span>
                          <span className="text-foreground">{date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}
      </DialogContent>

      {/* 삭제 확인 Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>워크플로우 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 워크플로우를 삭제하시겠습니까?
              <br />
              삭제된 워크플로우는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (workflow && onDelete) {
                  onDelete(workflow.workflowId);
                  setDeleteDialogOpen(false);
                  onOpenChange(false);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
