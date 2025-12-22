import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface WorkflowInfo {
  id: number;
  url: string;
  siteName?: string;
  blogName: string;
  blogUrl?: string;
  blogAccountId?: string;
  status?: string;
  testStatus?: string;
  firstCategory: string;
  secondCategory: string | null;
  thirdCategory: string | null;
  readableRule?: string;
  postCount: number;
  userName?: string;
}

interface WorkInfoCardProps {
  workflow: WorkflowInfo;
}

// 상태 variant 매핑 (WorkflowTable과 동일)
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

// 계층 카테고리 포맷팅 헬퍼 함수
const formatCategoryHierarchy = (
  depth1?: string,
  depth2?: string | null,
  depth3?: string | null
): string => {
  const parts = [];
  // 빈 문자열도 걸러내기 위해 trim() 추가
  if (depth1 && depth1.trim()) parts.push(depth1.trim());
  if (depth2 && depth2.trim()) parts.push(depth2.trim());
  if (depth3 && depth3.trim()) parts.push(depth3.trim());
  return parts.length > 0 ? parts.join(" > ") : "-";
};

export function WorkInfoCard({ workflow }: WorkInfoCardProps) {
  const categoryText = formatCategoryHierarchy(
    workflow.firstCategory,
    workflow.secondCategory,
    workflow.thirdCategory
  );

  // 디버깅용 로그
  console.log('WorkInfoCard - Categories:', {
    firstCategory: workflow.firstCategory,
    secondCategory: workflow.secondCategory,
    thirdCategory: workflow.thirdCategory,
    categoryText
  });

  return (
    <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="w-[5%] text-center font-semibold text-foreground">
              ID
            </TableHead>

            <TableHead className="w-[12%] text-center font-semibold text-foreground">
              사이트명
            </TableHead>

            <TableHead className="w-[10%] text-center font-semibold text-foreground">
              블로그
            </TableHead>

            <TableHead className="w-[25%] text-center font-semibold text-foreground">
              블로그 URL
            </TableHead>

            <TableHead className="w-[15%] text-center font-semibold text-foreground">
              계정 ID
            </TableHead>

            <TableHead className="w-[15%] text-center font-semibold text-foreground">
              카테고리
            </TableHead>

            <TableHead className="w-[18%] text-center font-semibold text-foreground">
              포스팅 건수
            </TableHead>
          </TableRow>

        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-muted/50">
            <TableCell className="font-medium text-center">{workflow.id}</TableCell>
            <TableCell className="text-center">{workflow.siteName || "-"}</TableCell>
            <TableCell className="text-center">{workflow.blogName}</TableCell>
            <TableCell className="text-center">
              {workflow.blogUrl ? (
                <a
                  href={workflow.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {workflow.blogUrl}
                </a>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell className="text-center">{workflow.blogAccountId || "-"}</TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                {workflow.firstCategory && (
                  <>
                    <span className="text-sm font-medium text-foreground">
                      {workflow.firstCategory}
                    </span>
                    {workflow.secondCategory && (
                      <>
                        <span className="text-muted-foreground text-xs">›</span>
                        <span className="text-sm text-foreground">
                          {workflow.secondCategory}
                        </span>
                      </>
                    )}
                    {workflow.thirdCategory && (
                      <>
                        <span className="text-muted-foreground text-xs">›</span>
                        <span className="text-sm text-muted-foreground">
                          {workflow.thirdCategory}
                        </span>
                      </>
                    )}
                  </>
                )}
                {!workflow.firstCategory && <span className="text-muted-foreground">-</span>}
              </div>
            </TableCell>

            <TableCell className="text-center font-medium">{workflow.postCount}건</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
