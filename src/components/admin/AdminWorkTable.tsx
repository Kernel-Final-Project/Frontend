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

type AdminWorkTableProps = {
  works: AdminWork[];
  onSelect?: (workId: number) => void;
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

export function AdminWorkTable({ works, onSelect }: AdminWorkTableProps) {
  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="font-semibold text-foreground w-20 text-center">No</TableHead>
              <TableHead className="font-semibold text-foreground">제목</TableHead>
              <TableHead className="font-semibold text-foreground text-center">키워드</TableHead>
              <TableHead className="font-semibold text-foreground text-center">선택 상품</TableHead>
              <TableHead className="font-semibold text-foreground text-center">완료 시간</TableHead>
              <TableHead className="font-semibold text-foreground w-32 text-center">상태</TableHead>
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
                <TableCell className="max-w-[300px]">
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
                <TableCell className="text-center">
                  {work.choiceProduct || <span className="text-muted-foreground">-</span>}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
