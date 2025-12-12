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
import { Workflow } from "@/services/workflowService";

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
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold text-foreground w-16">ID</TableHead>
            <TableHead className="font-semibold text-foreground">사이트</TableHead>
            <TableHead className="font-semibold text-foreground">블로그 유형</TableHead>
            <TableHead className="font-semibold text-foreground">트렌드 카테고리</TableHead>
            <TableHead className="font-semibold text-foreground">블로그 계정</TableHead>
            <TableHead className="font-semibold text-foreground w-20">상태</TableHead>
            <TableHead className="font-semibold text-foreground text-center">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
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
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {workflow.siteName}
                </TableCell>
                <TableCell>{workflow.blogType}</TableCell>
                <TableCell>{workflow.trendCategoryName}</TableCell>
                <TableCell className="text-muted-foreground">{workflow.blogAccountId}</TableCell>
                {/* <TableCell className="text-sm">{workflow.readableRule}</TableCell> */}
                <TableCell>
                  <Badge
                    variant={getStatusVariant(workflow.status)}
                    className={workflow.status === "ACTIVE" ? "bg-[hsl(var(--status-active))] hover:bg-[hsl(var(--status-active))]" : ""}
                  >
                    {getStatusLabel(workflow.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSchedule(workflow.workflowId)}
                      className="text-xs h-8 px-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      일정 관리
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(workflow.workflowId)}
                      className="text-xs h-8 px-3"
                    >
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(workflow.workflowId)}
                      className="text-xs h-8 px-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      삭제
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
