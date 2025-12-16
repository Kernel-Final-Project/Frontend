import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { WorkflowTable } from "@/components/workflow/WorkflowTable";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { workflowService, Workflow } from '@/services/workflowService';
import { ScheduleDialog } from "@/components/workflow/ScheduleDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Workflows = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const [selectedWorkflowSchedule, setSelectedWorkflowSchedule] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<number | null>(null);

  // 워크플로우 목록 불러오기
  const fetchWorkflows = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await workflowService.getWorkflows(page);

      if (response.success) {
        setWorkflows(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      }
    } catch (error) {
      console.error("워크플로우 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 로드 시 또는 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchWorkflows(currentPage);
  }, [currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // UI는 1부터, 백엔드는 0부터
  };

  const handleSchedule = (id: number) => {
    const workflow = workflows.find(w => w.workflowId === id);
    setSelectedWorkflowId(id);
    setSelectedWorkflowSchedule(workflow?.readableRule || "");
    setScheduleDialogOpen(true);
  };

  const handleEdit = (id: number) => {
    navigate(`/workflows/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setWorkflowToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!workflowToDelete) return;

    try {
      const response = await workflowService.deleteWorkflow(workflowToDelete);

      if (response.success) {
        toast({
          title: "삭제 완료",
          description: "워크플로우가 삭제되었습니다.",
        });
        // 목록 새로고침
        fetchWorkflows(currentPage);
      } else {
        toast({
          title: "삭제 실패",
          description: response.message || "워크플로우 삭제에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("워크플로우 삭제 실패:", error);
      toast({
        title: "삭제 실패",
        description: "워크플로우 삭제에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setWorkflowToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container pt-24 pb-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">워크플로우 관리</h1>
          <p className="mt-1 text-muted-foreground">등록된 워크플로우를 관리하세요</p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            전체 {totalElements}건
          </div>
          <Button className="gap-2" onClick={() => navigate("/workflows/add")}>
            <Plus className="w-4 h-4" />
            등록
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div>
              <WorkflowTable
                workflows={workflows}
                onSchedule={handleSchedule}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div>
                <Pagination
                  currentPage={currentPage + 1} // UI에는 1부터 표시
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Schedule Dialog */}
      {selectedWorkflowId && (
        <ScheduleDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          workflowId={selectedWorkflowId}
          currentSchedule={selectedWorkflowSchedule}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>워크플로우 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 워크플로우를 삭제하시겠습니까?
              <br />
              삭제된 워크플로우는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Workflows;