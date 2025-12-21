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
import { BlogLink } from "@/utils/workUtils";
import { Work } from "@/services/workService";

interface BlogLinkTableProps {
  blogLinks: BlogLink[];
  onLogDetail: (id: number) => void;
  onWorkDetail?: (id: number) => void;
}

const workStatusVariant: Record<
  Work['status'],
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "dark"
> = {
  PENDING: "secondary",              // 회색 - 대기
  REQUESTED: "outline",              // 테두리 - 요청됨
  TREND_KEYWORD_DONE: "default",     // 기본색 - 키워드 추출 성공
  PRODUCT_SELECTED: "default",       // 기본색 - 상품 선택 완료
  CONTENT_GENERATED: "warning",      // 노란색 - 콘텐츠 생성 완료
  BLOG_UPLOAD_PENDING: "warning",    // 노란색 - 블로그 업로드 준비
  COMPLETED: "success",              // 초록색 - 완료
  FAILED: "destructive",             // 빨간색 - 실패
};

export function BlogLinkTable({ blogLinks, onLogDetail, onWorkDetail }: BlogLinkTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold text-foreground w-16 text-center">ID</TableHead>
            <TableHead className="font-semibold text-foreground">블로그 링크</TableHead>
            <TableHead className="font-semibold text-foreground text-center">상품</TableHead>
            <TableHead className="font-semibold text-foreground text-center">실행시간</TableHead>
            <TableHead className="font-semibold text-foreground w-24 text-center">상태</TableHead>
            <TableHead className="font-semibold text-foreground text-center">로그관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogLinks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                아직 포스팅된 워크가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            blogLinks.map((link, index) => (
              <TableRow
                key={link.id}
                className="transition-colors hover:bg-muted/50 cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => onWorkDetail?.(link.id)}
              >
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  <a
                    href={link.blogLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.blogLink}
                  </a>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">{link.choiceProduct}</TableCell>
                <TableCell className="text-center text-muted-foreground">{link.executionTime}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={workStatusVariant[link.rawStatus] ?? "default"}>
                    {link.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogDetail(link.id);
                    }}
                    className="text-xs h-8 px-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    로그보기
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
