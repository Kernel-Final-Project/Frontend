import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, FileText, Link2, Calendar, Tag } from "lucide-react";
import { WorkDetailResponse } from "@/services/workService";
import { mapWorkStatusToKorean, formatDateTime } from "@/utils/workUtils";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";

type WorkDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  work: WorkDetailResponse | null;
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "dark"> = {
  "PENDING": "secondary",              // 회색 - 대기
  "REQUESTED": "outline",              // 테두리 - 요청됨
  "TREND_KEYWORD_DONE": "default",     // 기본색 - 키워드 추출 성공
  "PRODUCT_SELECTED": "default",       // 기본색 - 상품 선택 완료
  "CONTENT_GENERATED": "warning",      // 노란색 - 콘텐츠 생성 완료
  "BLOG_UPLOAD_PENDING": "warning",    // 노란색 - 블로그 업로드 준비
  "COMPLETED": "success",              // 초록색 - 완료
  "FAILED": "destructive",             // 빨간색 - 실패
};

export function WorkDetailModal({ open, onOpenChange, work }: WorkDetailModalProps) {
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  if (!work) return null;

  const hasGeneratedContent =
    !!work.choiceTrendKeyword ||
    !!work.completedAt ||
    !!work.title ||
    !!work.content ||
    !!work.postingUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>워크 상세 정보</DialogTitle>
        </DialogHeader>

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

          {/* 세부 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 포스팅 URL */}
            {work.postingUrl && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Link2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">포스팅 URL</p>
                  <a
                    href={work.postingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {work.postingUrl}
                  </a>
                </div>
              </div>
            )}

            {/* 완료 일시 */}
            {work.completedAt && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">완료 일시</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(work.completedAt)}</p>
                </div>
              </div>
            )}

            {/* 선택 상품 */}
            {work.choiceProduct && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">선택 상품</p>
                  <p className="text-sm text-muted-foreground">{work.choiceProduct}</p>
                </div>
              </div>
            )}

            {/* 트렌드 키워드 */}
            {work.choiceTrendKeyword && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">트렌드 키워드</p>
                  <p className="text-sm text-muted-foreground">{work.choiceTrendKeyword}</p>
                </div>
              </div>
            )}
          </div>

          {/* 제목 */}
          {work.title && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">제목</h3>
              </div>
              <p className="text-sm text-foreground p-3 bg-muted/50 rounded-lg">{work.title}</p>
            </div>
          )}

          {/* 콘텐츠 */}
          {work.content && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">콘텐츠</h3>
                </div>
                <button
                  onClick={() => setIsContentExpanded(!isContentExpanded)}
                  className="text-sm text-primary hover:underline"
                >
                  {isContentExpanded ? '접기' : '전체보기'}
                </button>
              </div>
              <div className={`bg-muted/50 rounded-lg ${isContentExpanded ? '' : 'max-h-[300px] overflow-hidden'}`}>
                <ReactQuill
                  value={work.content}
                  readOnly
                  theme="snow"
                  modules={{ toolbar: false }}
                  className="border-0"
                />
              </div>
            </div>
          )}

          {/* 생성된 콘텐츠가 없을 때 */}
          {!hasGeneratedContent && (
            <div className="rounded-lg border border-dashed border-border bg-background/70 py-10 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">아직 생성된 콘텐츠가 없습니다.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
