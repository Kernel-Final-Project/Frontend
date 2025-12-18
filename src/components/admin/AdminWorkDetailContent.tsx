import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, FileText, Link2, Calendar, Tag, User, Workflow } from "lucide-react";
import { AdminWork } from "@/services/workService";
import { mapWorkStatusToKorean, formatDateTime } from "@/utils/workUtils";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { EmptyWorkContentNotice } from "./EmptyWorkContentNotice";
import { useState } from "react";

type AdminWorkDetailContentProps = {
  work: AdminWork;
  onNavigateToWorkflow: (workflowId: number) => void;
  onNavigateToUser: (userId: number) => void;
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

export function AdminWorkDetailContent({ work, onNavigateToWorkflow, onNavigateToUser }: AdminWorkDetailContentProps) {
  const hasGeneratedContent =
    !!work.choiceTrendKeyword ||
    !!work.completedAt ||
    !!work.title ||
    !!work.content ||
    !!work.postingUrl;

  const [isContentExpanded, setIsContentExpanded] = useState(false);

  return (
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

      {/* 관련 정보 - 클릭 가능한 버튼들 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">관련 정보</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigateToUser(work.userId)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors group"
          >
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">사용자</p>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 group-hover:underline">#{work.userId}</p>
            </div>
          </button>

          <button
            onClick={() => {
              console.log("Workflow button clicked! workflowId:", work.workflowId);
              onNavigateToWorkflow(work.workflowId);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors group"
          >
            <Workflow className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <div className="text-left">
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70">워크플로우</p>
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 group-hover:underline">#{work.workflowId}</p>
            </div>
          </button>
        </div>
      </div>

      <Separator />
      {hasGeneratedContent ? (
        <>
          {/* 키워드 및 상품 정보 */}
          {work.choiceTrendKeyword && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                선택 정보
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">선택 키워드</p>
                  <p className="text-sm text-foreground font-medium">{work.choiceTrendKeyword}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">선택 상품</p>
                  <p className="text-sm text-foreground font-medium">{work.choiceProduct}</p>
                </div>
              </div>
            </div>
          )}

          {/* 완료 시간 */}
          {work.completedAt && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                완료 시간
              </h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-foreground">{formatDateTime(work.completedAt)}</p>
              </div>
            </div>
          )}

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
              {/* 헤더 영역 */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  내용
                </h3>

                <button
                  onClick={() => setIsContentExpanded(prev => !prev)}
                  className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                  {isContentExpanded ? "접기" : "크게 보기"}
                  <span className="text-[10px]">
                    {isContentExpanded ? "▲" : "▼"}
                  </span>
                </button>
              </div>

              {/* 내용 영역 */}
              <div
                className={`bg-muted/30 rounded-lg p-4 transition-all duration-300 ${isContentExpanded ? "max-h-none" : "max-h-60 overflow-y-auto"
                  }`}
              >
                <ReactQuill
                  value={work.content}
                  readOnly
                  theme="bubble"
                  modules={{ toolbar: false }}
                />
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
        </>
      ) : (
        <EmptyWorkContentNotice />
      )}
    </div>
  );

}
