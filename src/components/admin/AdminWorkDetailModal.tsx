import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, FileText, Link2, Calendar, Tag } from "lucide-react";
import { AdminWork } from "@/services/workService";
import { mapWorkStatusToKorean, formatDateTime } from "@/utils/workUtils";

type AdminWorkDetailModalProps = {
  work: AdminWork | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AdminWorkDetailModal({ work, open, onOpenChange }: AdminWorkDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>워크 상세 정보</DialogTitle>
          <DialogDescription>워크의 상세 정보를 확인할 수 있습니다.</DialogDescription>
        </DialogHeader>

        {work ? (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">워크 #{work.workId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={statusVariant[work.status] ?? "default"}
                      className="tracking-tight"
                    >
                      {mapWorkStatusToKorean(work.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* 키워드 및 상품 정보 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                선택 정보
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">선택 키워드</p>
                  <p className="text-sm text-foreground font-medium">{work.choiceTrendKeyword || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">선택 상품</p>
                  <p className="text-sm text-foreground font-medium">{work.choiceProduct || '-'}</p>
                </div>
              </div>
            </div>

            {/* 완료 시간 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                완료 시간
              </h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-foreground">{formatDateTime(work.completedAt)}</p>
              </div>
            </div>

            {/* 제목 */}
            {work.title && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  제목
                </h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-foreground">{work.title}</p>
                </div>
              </div>
            )}

            {/* 내용 */}
            {work.content && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  내용
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{work.content}</p>
                </div>
              </div>
            )}

            {/* 포스팅 URL */}
            {work.postingUrl && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  포스팅 URL
                </h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <a
                    href={work.postingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all block"
                  >
                    {work.postingUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
