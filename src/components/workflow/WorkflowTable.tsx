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
import { formatRecurrenceRule } from "@/utils/workUtils";

interface WorkflowTableProps {
  workflows: Workflow[];
  onSchedule: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// 상태를 한글로 변환하는 함수
const getStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "활성";
    case "PENDING":
      return "대기";
    case "INACTIVE":
      return "비활성";
    default:
      return status;
  }
};

// 상태에 따른 variant 반환
const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "PENDING":
      return "outline";
    case "INACTIVE":
      return "secondary";
    default:
      return "secondary";
  }
};

export function WorkflowTable({ workflows, onSchedule, onEdit, onDelete }: WorkflowTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (workflow: Workflow) => {
    navigate(`/work/${workflow.workflowId}`, { state: { workflow } });
  };

  return (
    <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold w-20 text-center">No</TableHead>
            <TableHead className="font-semibold w-32 text-center ">사이트</TableHead>
            <TableHead className="font-semibold w-40 text-center">트렌드 카테고리</TableHead>
            <TableHead className="font-semibold w-32 text-center">블로그</TableHead>
            <TableHead className="font-semibold w-40 text-center">블로그 계정</TableHead>
            <TableHead className="font-semibold w-20 text-center ">상태</TableHead>
            <TableHead className="font-semibold w-32 text-center">관리</TableHead>
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
                className="transition-colors hover:bg-muted/50 cursor-pointer text-center"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleRowClick(workflow)}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(workflow.status)}
                    className={workflow.status === "ACTIVE" ? "bg-[hsl(var(--status-active))] hover:bg-[hsl(var(--status-active))] text-center" : ""}
                  >
                    {getStatusLabel(workflow.status)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {workflow.siteName}
                </TableCell>
                <TableCell>{workflow.trendCategoryName}</TableCell>
                <TableCell>{workflow.blogType}</TableCell>
                <TableCell className="text-muted-foreground">{workflow.blogAccountId}</TableCell>
                <TableCell>
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
