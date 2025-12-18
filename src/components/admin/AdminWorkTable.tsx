import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminWork } from "@/services/workService";
import { mapWorkStatusToKorean, formatDateTime } from "@/utils/workUtils";
import { User, Workflow } from "lucide-react";
import { Button } from "../ui/button";

type AdminWorkTableProps = {
  works: AdminWork[];
  onSelect?: (workId: number) => void;
  onOpenWorkflowDetail?: (workflowId: number) => void;
  onOpenUserDetail?: (userId: number) => void;
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "dark"> = {
  "COMPLETED": "success",
  "PENDING": "warning",
  "REQUESTED": "warning",
  "TREND_KEYWORD_DONE": "warning",
  "PRODUCT_SELECTED": "warning",
  "CONTENT_GENERATED": "warning",
  "BLOG_UPLOAD_PENDING": "warning",
  "FAILED": "destructive",
};

export function AdminWorkTable({ works, onSelect, onOpenWorkflowDetail, onOpenUserDetail }: AdminWorkTableProps) {
  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="font-semibold text-foreground w-20 text-center">No</TableHead>
              <TableHead className="font-semibold text-foreground text-center">사용자ID</TableHead>
              <TableHead className="font-semibold text-foreground text-center">워크플로우ID</TableHead>
              <TableHead className="font-semibold text-foreground text-center">제목</TableHead>
              <TableHead className="font-semibold text-foreground text-center">키워드</TableHead>
              <TableHead className="font-semibold text-foreground text-center">완료 시간</TableHead>
              <TableHead className="font-semibold text-foreground w-32 text-center">상태</TableHead>
              <TableHead className="font-semibold text-foreground w-32 text-center">로그 관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {works.map((work, index) => (
              <TableRow
                key={work.workId}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onSelect?.(work.workId)}
              >
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium hover:underline">{work.userId || <span className="text-muted-foreground">-</span>}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Workflow className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium hover:underline">{work.workflowId}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center max-w-[300px]">
                  {work.title ? (
                    <div className="truncate" title={work.title}>
                      {work.title}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {work.choiceTrendKeyword || <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground">
                  {formatDateTime(work.completedAt)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={statusVariant[work.status] ?? "default"}
                    className="tracking-tight"
                  >
                    {mapWorkStatusToKorean(work.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                    }}
                    className="text-xs h-8 px-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    상세보기
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}