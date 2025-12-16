import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Workflow } from "@/services/workflowService";

type AdminWorkflowTableProps = {
  workflows: Workflow[];
  onUpdate?: () => void;
  onRowClick?: (workflowId: number) => void;
  onSelect?: (workflowId: number) => void; // 상세보기용 선택 이벤트
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

export function AdminWorkflowTable({ workflows, onUpdate, onRowClick, onSelect }: AdminWorkflowTableProps) {

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="font-semibold text-foreground w-16 text-center">No</TableHead>
              <TableHead className="font-semibold text-foreground w-20 text-center">사용자ID</TableHead>
              <TableHead className="font-semibold text-foreground">사이트명</TableHead>
              <TableHead className="font-semibold text-foreground">사이트 URL</TableHead>
              <TableHead className="font-semibold text-foreground text-center">블로그</TableHead>
              <TableHead className="font-semibold text-foreground text-center">트렌드 카테고리</TableHead>
              <TableHead className="font-semibold text-foreground w-24 text-center">상태</TableHead>
              <TableHead className="font-semibold text-foreground w-32 text-center">작업</TableHead>
            </TableRow>

          </TableHeader>
          <TableBody>
            {workflows.map((workflow, index) => (
              <TableRow
                key={workflow.workflowId}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onSelect?.(workflow.workflowId)}
              >
                <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="text-center">
                  {workflow.userId}
                </TableCell>
                <TableCell className="font-medium">
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
                  <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick?.(workflow.workflowId);
                      }}
                      className="gap-1.5"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      작업 관리
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
