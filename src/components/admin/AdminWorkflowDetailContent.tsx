import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Globe, Link2, Calendar, Tag, Settings, User, Pencil, Trash2 } from "lucide-react";
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
import { WorkflowDetailResponse, workflowService } from "@/services/workflowService";

type AdminWorkflowDetailContentProps = {
  workflow: WorkflowDetailResponse;
  onNavigateToUser: (userId: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: () => void;
  onUpdate?: () => void;
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
  NOT_TESTED: "outline",
  TEST_PASSED: "success",
  TEST_FAILED: "destructive",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "활성",
  PENDING: "대기",
  INACTIVE: "비활성",
  DELETED: "삭제됨",
  COMPLETED: "완료",
  NOT_TESTED: "테스트 전",
  TEST_PASSED: "테스트 통과",
  TEST_FAILED: "테스트 실패",
};

export function AdminWorkflowDetailContent({ workflow, onNavigateToUser, onDelete, onEdit, onUpdate }: AdminWorkflowDetailContentProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);

  console.log("AdminWorkflowDetailContent rendered with workflow:", workflow);
  console.log("onNavigateToUser function:", onNavigateToUser);

  // 워크플로우 데이터가 변경되면 낙관적 상태 초기화
  useEffect(() => {
    setOptimisticStatus(null);
  }, [workflow.status]);

  // 낙관적 업데이트: 실제 상태 또는 임시 상태 사용
  const displayStatus = optimisticStatus || workflow.status;

  return (
    <>
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
                <Badge
                  variant={statusVariant[displayStatus] ?? "default"}
                  className="tracking-tight"
                >
                  {statusLabels[displayStatus] || displayStatus}
                </Badge>
                <Badge
                  variant={statusVariant[workflow.testStatus] ?? "default"}
                  className="tracking-tight"
                >
                  {statusLabels[workflow.testStatus] || workflow.testStatus}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(displayStatus === 'ACTIVE' || displayStatus === 'INACTIVE') && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground">
                  {displayStatus === 'ACTIVE' ? '활성' : '비활성'}
                </span>
                <Switch
                  checked={displayStatus === 'ACTIVE'}
                  onCheckedChange={async (checked) => {
                    const newStatus = checked ? 'ACTIVE' : 'INACTIVE';

                    // 1. 즉시 UI 업데이트 (낙관적 업데이트)
                    setOptimisticStatus(newStatus);

                    try {
                      // 2. API 호출
                      const response = await workflowService.updateWorkflowStatus(workflow.workflowId, newStatus);

                      // 3. 성공 시 실제 데이터 다시 로드
                      onUpdate?.();
                    } catch (error) {
                      // 4. 실패 시 원래 상태로 되돌림
                      setOptimisticStatus(null);
                    }
                  }}
                />
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onEdit?.();
              }}
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

        {/* 관련 정보 - 사용자 버튼 */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">관련 정보</h3>
          <button
            type="button"
            onClick={() => {
              console.log("Button clicked! userId:", workflow.userId);
              onNavigateToUser(workflow.userId);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors group cursor-pointer"
          >
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">사용자</p>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 group-hover:underline">
                {workflow.userName ? `${workflow.userName} (ID: ${workflow.userId})` : `#${workflow.userId}`}
              </p>
            </div>
          </button>
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
                <div className="flex items-center gap-2 text-sm text-foreground flex-wrap">
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

        {/* 일정 정보 */}
        {workflow.recurrenceRule && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              실행 일정
            </h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">반복 유형</p>
                <p className="text-sm text-foreground font-medium">{workflow.recurrenceRule.repeatType}</p>
              </div>
              {workflow.recurrenceRule.timesOfDay && workflow.recurrenceRule.timesOfDay.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">실행 시간</p>
                  <div className="flex gap-1 flex-wrap">
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
        )}
      </div>

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
                if (onDelete) {
                  onDelete(workflow.workflowId);
                  setDeleteDialogOpen(false);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
