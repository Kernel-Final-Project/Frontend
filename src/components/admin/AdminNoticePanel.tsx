import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertCircle, ClipboardList, Loader2, Pin } from "lucide-react";
import { NoticeRow } from "./types";

type AdminNoticePanelProps = {
  notices: NoticeRow[];
  loading: boolean;
  error: string | null;
};

export function AdminNoticePanel({ notices, loading, error }: AdminNoticePanelProps) {
  return (
    <Card className="card-shadow overflow-hidden">
      <CardHeader className="bg-muted/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ClipboardList className="h-4 w-4" />
          <span>공지사항 관리</span>
        </div>
        <CardTitle className="text-xl">공지목록</CardTitle>
        <p className="text-sm text-muted-foreground">
          중요 공지를 상단에 고정하며, 추후 등록/수정/삭제 기능이 추가될 영역입니다.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            불러오는 중...
          </div>
        ) : error ? (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : notices.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">등록된 공지가 없습니다.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-32 text-center">작성자</TableHead>
                <TableHead className="w-28 text-center">작성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice, index) => (
                <TableRow
                  key={notice.id}
                  className={cn("hover:bg-muted/50", notice.important ? "bg-primary/5" : undefined)}
                >
                  <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="flex flex-col gap-1 py-3">
                    <div className="flex items-center gap-2">
                      {notice.important && (
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[11px] bg-primary/10 text-primary border-primary/40"
                        >
                          <Pin className="h-3.5 w-3.5" />
                          중요
                        </Badge>
                      )}
                      <span className="font-semibold text-foreground">{notice.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">ID: {notice.id}</span>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{notice.author}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{notice.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
