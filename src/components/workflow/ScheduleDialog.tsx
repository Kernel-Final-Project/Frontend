import { useEffect, useState } from "react";
import { Clock, Calendar, Repeat } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { workflowService, Workflow, WorkflowDetailResponse } from "@/services/workflowService";
import { getNextExecutionDates } from "@/utils/recurrenceRuleHelper";
import { toast } from "@/hooks/use-toast";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: number;
  currentSchedule?: string;
}

export function ScheduleDialog({
  open,
  onOpenChange,
  workflowId,
  currentSchedule,
}: ScheduleDialogProps) {
  const [workflow, setWorkflow] = useState<WorkflowDetailResponse | null>(null);
  const [executionDates, setExecutionDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 워크플로우 상세 정보 및 실행 날짜 불러오기
  useEffect(() => {
    if (open && workflowId) {
      fetchWorkflowDetails();
    }
  }, [open, workflowId]);

  const fetchWorkflowDetails = async () => {
    try {
      setIsLoading(true);
      const response = await workflowService.getWorkflowById(workflowId);
      setWorkflow(response.data);
      if (response.success && response.data.recurrenceRule) {
        // 다음 10개의 실행 예정일 계산
        const dates = getNextExecutionDates(response.data.recurrenceRule, 10);
        setExecutionDates(dates);
      }
    } catch (error) {
      console.error("워크플로우 상세 정보 조회 실패:", error);
      toast({
        title: "오류",
        description: "워크플로우 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>실행 일정 확인</DialogTitle>
          <DialogDescription>
            다음 실행 예정일을 확인하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : executionDates.length > 0 ? (
            <>
              {/* 반복 규칙 요약 */}
              {workflow?.recurrenceRule && (
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <Label className="text-sm font-medium mb-1.5 block">반복 규칙</Label>
                  <div className="space-y-1 text-sm">
                    <p className="flex gap-2 text-sm items-center ">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium ">
                        {workflow.recurrenceRule.startAt.split("T")[0]}{workflow.recurrenceRule.endAt ? ` ~ ${workflow.recurrenceRule.endAt.split("T")[0]}` : ''}
                      </span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Repeat className="w-4 h-4 ml-3" />
                      <span className="font-medium">
                        {workflow.recurrenceRule.repeatType === 'ONCE' && '한번만'}
                        {workflow.recurrenceRule.repeatType === 'DAILY' && '매일'}
                        {workflow.recurrenceRule.repeatType === 'WEEKLY' && '매주'}
                        {workflow.recurrenceRule.repeatType === 'MONTHLY' && '매월'}
                        {workflow.recurrenceRule.repeatType === 'CUSTOM' && '사용자 정의'}
                      </span>
                    </p>
                    {workflow.recurrenceRule.timesOfDay && (
                      <p className="flex gap-2 text-sm items-center">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">
                          {workflow.recurrenceRule.timesOfDay.join(', ')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 실행 예정일 목록 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">다음 실행 예정일 (최대 10개)</Label>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                  {executionDates.map((date, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-mono font-medium text-foreground">
                            {date.getFullYear()}.
                            {String(date.getMonth() + 1).padStart(2, '0')}.
                            {String(date.getDate()).padStart(2, '0')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][date.getDay()]}
                          </p>
                        </div>
                      </div>
                      {workflow?.recurrenceRule?.timesOfDay && (
                        <div className="text-sm text-muted-foreground">
                          {workflow.recurrenceRule.timesOfDay.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-muted-foreground">실행 예정일 정보가 없습니다.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
