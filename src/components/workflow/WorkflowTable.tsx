import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Workflow } from "@/services/workflowService";

interface WorkflowTableProps {
  workflows: Workflow[];
  onSchedule: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// 상태 variant 매핑 (관리자 페이지와 통일)
const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "dark"
> = {
  ACTIVE: "success",
  PENDING: "warning",
  PRE_REGISTERED: "outline",
  INACTIVE: "secondary",
  DELETED: "destructive",
  COMPLETED: "success",
  NOT_TESTED: "outline",
  TEST_PASSED: "success",
  TEST_FAILED: "destructive",
};

// 상태 한글 레이블 매핑
const statusLabels: Record<string, string> = {
  ACTIVE: "활성",
  PENDING: "대기",
  PRE_REGISTERED: "등록 대기",
  INACTIVE: "비활성",
  DELETED: "삭제됨",
  COMPLETED: "완료",
  NOT_TESTED: "테스트 전",
  TEST_PASSED: "테스트 통과",
  TEST_FAILED: "테스트 실패",
};

export function WorkflowTable({ workflows, onSchedule, onEdit, onDelete }: WorkflowTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (workflow: Workflow) => {
    navigate(`/workflow/${workflow.workflowId}`, { state: { workflow } });
  };

  return (
    <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="w-[5%] text-center font-semibold">No</TableHead>
            <TableHead className="w-[10%] text-center font-semibold">사이트명</TableHead>
            <TableHead className="w-[20%] text-center font-semibold">사이트 URL</TableHead>
            <TableHead className="w-[12%] text-center font-semibold">블로그</TableHead>
            <TableHead className="w-[15%] text-center font-semibold">대표 카테고리</TableHead>
            <TableHead className="w-[10%] text-center font-semibold">상태</TableHead>
            <TableHead className="w-[13%] text-center font-semibold">테스트 상태</TableHead>
            <TableHead className="w-[15%] text-center font-semibold">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                등록된 워크플로우가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            workflows.map((workflow, index) => (
              <TableRow
                key={workflow.workflowId}
                className="transition-colors hover:bg-muted/50 cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleRowClick(workflow)}
              >
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell className="font-medium text-center max-w-[200px] truncate">
                  {workflow.siteName}
                </TableCell>
                <TableCell>
                  <a
                    href={workflow.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {workflow.siteUrl}
                  </a>
                </TableCell>
                <TableCell className="text-center">{workflow.blogType}</TableCell>
                <TableCell className="text-center">{workflow.trendCategoryName}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={statusVariant[workflow.status] ?? "default"}
                    className="tracking-tight"
                  >
                    {statusLabels[workflow.status] || workflow.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={statusVariant[workflow.testStatus] ?? "outline"}>
                    {statusLabels[workflow.testStatus] || workflow.testStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSchedule(workflow.workflowId)}
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                      title="일정 관리"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(workflow.workflowId)}
                      className="h-8 w-8 text-blue-600 hover:text-blue-600 hover:bg-blue-600/10"
                      title="수정"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(workflow.workflowId)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
