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
  currentPage?: number;  // 추가
  onSelect?: (workId: number) => void;
  onOpenWorkflowDetail?: (workflowId: number) => void;
  onOpenUserDetail?: (userId: number) => void;
};

// 상태별 스타일 매핑 (사용자 워크 목록과 동일)
const statusStyles: Record<string, string> = {
  "대기": "bg-gray-500 hover:bg-gray-500 text-white",
  "요청됨": "bg-blue-500 hover:bg-blue-500 text-white",
  "키워드 추출 성공": "bg-cyan-500 hover:bg-cyan-500 text-white",
  "상품 선택 완료": "bg-indigo-500 hover:bg-indigo-500 text-white",
  "콘텐츠 생성 완료": "bg-purple-500 hover:bg-purple-500 text-white",
  "블로그 업로드 준비": "bg-amber-500 hover:bg-amber-500 text-white",
  "완료": "bg-[hsl(var(--status-success))] hover:bg-[hsl(var(--status-success))] text-white",
  "실패": "bg-[hsl(var(--status-error))] hover:bg-[hsl(var(--status-error))] text-white",
};

export function AdminWorkTable({ works, currentPage = 0, onSelect, onOpenWorkflowDetail, onOpenUserDetail }: AdminWorkTableProps) {
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
                <TableCell className="font-medium text-center">{currentPage * 10 + index + 1}</TableCell>
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
                  <Badge className={statusStyles[mapWorkStatusToKorean(work.status)]}>
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
