import { useState, useEffect } from "react";
import { AdminWorkflowEditForm } from "./AdminWorkflowEditForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AdminWork, workService } from "@/services/workService";
import { WorkflowDetailResponse, workflowService } from "@/services/workflowService";
import { userService } from "@/services/userService";
import { AdminUser } from "./types";
import { AdminWorkDetailContent } from "./AdminWorkDetailContent";
import { AdminWorkflowDetailContent } from "./AdminWorkflowDetailContent";
import { AdminUserDetailContent } from "./AdminUserDetailContent";

type PageType = "work" | "workflow" | "user";

type Page = {
  type: PageType;
  id: number;
  data?: AdminWork | WorkflowDetailResponse | AdminUser;
};

type AdminUnifiedDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPage: Page;
  onDeleteWorkflow?: (id: number) => void;
  onUpdateWorkflow?: () => void;
};

export function AdminUnifiedDetailModal({ open, onOpenChange, initialPage, onDeleteWorkflow, onUpdateWorkflow }: AdminUnifiedDetailModalProps) {

  const [history, setHistory] = useState<Page[]>([initialPage]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const currentPage = history[history.length - 1];

  // 페이지가 변경될 때 데이터 로드
  useEffect(() => {
    if (!open) return;
    if (currentPage.data) {
      setLoading(false);
      return; // 이미 데이터가 있으면 스킵
    }

    const loadPageData = async () => {
      setLoading(true);
      console.log("Loading data for:", currentPage.type, currentPage.id);
      try {
        let data;
        if (currentPage.type === "work") {
          const response = await workService.getWorksForAdmin(0);
          console.log("Work response:", response);
          if (response.success) {
            data = response.data.works.find((w: AdminWork) => w.workId === currentPage.id);
          }
        } else if (currentPage.type === "workflow") {
          const response = await workflowService.getWorkflowById(currentPage.id);
          console.log("Workflow response:", response);
          if (response.success) {
            data = response.data;
          }
        } else if (currentPage.type === "user") {
          const response = await userService.getUserById(currentPage.id);
          console.log("User response:", response);
          if (response) {
            data = {
              userId: response.userId,
              name: response.name,
              email: response.email,
              role: response.role,
              status: response.status,
              createdAt: response.createdAt,
            } as AdminUser;
          }
        }

        console.log("Loaded data:", data);
        if (data) {
          setHistory((prev) => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { ...currentPage, data };
            return newHistory;
          });
        }
      } catch (error) {
        console.error("Failed to load page data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [currentPage, open]);

  // initialPage가 변경되면 항상 히스토리 초기화
  useEffect(() => {
    setHistory([initialPage]);
    if (!open) {
      setEditMode(false);
    }
  }, [initialPage]);

  // 모달이 닫힐 때만 editMode 초기화
  useEffect(() => {
    if (!open) {
      setEditMode(false);
    }
  }, [open]);

  const handleEditSuccess = async () => {
    setEditMode(false);
    await reloadWorkflowData();
  };

  const reloadWorkflowData = async () => {
    // 워크플로우 데이터 재로드
    if (currentPage.type === "workflow") {
      setLoading(true);
      try {
        const response = await workflowService.getWorkflowById(currentPage.id);
        if (response.success) {
          setHistory((prev) => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = {
              ...currentPage,
              data: response.data
            };
            return newHistory;
          });
        }
      } catch (error) {
        console.error("Failed to reload data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const navigateTo = (type: PageType, id: number) => {
    setHistory((prev) => [...prev, { type, id }]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const getTitle = () => {
    if (currentPage.type === "work") return "워크 상세 정보";
    if (currentPage.type === "workflow") return "워크플로우 상세 정보";
    if (currentPage.type === "user") return "사용자 상세 정보";
    return "상세 정보";
  };

  const handleEditCancel = () => {
    setEditMode(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${editMode && currentPage.type === "workflow"
        ? "sm:max-w-[900px]"  // 편집 모드
        : "sm:max-w-[700px]"   // 조회 모드
        } max-h-[80vh] overflow-y-auto`}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            {history.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>{getTitle()}</DialogTitle>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        ) : (
          <>
            {currentPage.type === "work" && currentPage.data && (
              <AdminWorkDetailContent
                work={currentPage.data as AdminWork}
                onNavigateToWorkflow={(workflowId) => navigateTo("workflow", workflowId)}
                onNavigateToUser={(userId) => navigateTo("user", userId)}
              />
            )}
            {currentPage.type === "workflow" && currentPage.data && (
              <>
                {editMode ? (
                  // 편집 모드
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEditCancel}
                        className="h-8 w-8"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <h3 className="text-lg font-semibold">워크플로우 수정</h3>
                    </div>
                    <AdminWorkflowEditForm
                      workflowId={currentPage.id}
                      onCancel={handleEditCancel}
                      onSuccess={handleEditSuccess}
                    />
                  </div>
                ) : (
                  // 조회 모드
                  <AdminWorkflowDetailContent
                    workflow={currentPage.data as WorkflowDetailResponse}
                    onNavigateToUser={(userId) => navigateTo("user", userId)}
                    onDelete={onDeleteWorkflow}
                    onEdit={() => setEditMode(true)}
                    onUpdate={() => {
                      reloadWorkflowData(); // 모달 내 데이터 업데이트
                      onUpdateWorkflow?.(); // 테이블 데이터 업데이트
                    }}
                  />
                )}
              </>
            )}
            {currentPage.type === "user" && currentPage.data && (
              <AdminUserDetailContent
                user={currentPage.data as AdminUser}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
