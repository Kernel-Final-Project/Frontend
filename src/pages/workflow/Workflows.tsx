import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { WorkflowTable } from "@/components/workflow/WorkflowTable";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, Workflow as WorkflowIcon, Search, Plus } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
        setError(null);
      }
    } catch (err) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "워크플로우 목록을 불러오지 못했습니다.";
      setError(msg);
      console.error("워크플로우 목록 조회 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 필터링
  const filteredWorkflows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return workflows;
    return workflows.filter(
      (w) =>
        w.siteName.toLowerCase().includes(q) ||
        w.siteUrl.toLowerCase().includes(q) ||
        w.blogType.toLowerCase().includes(q)
    );
  }, [workflows, searchQuery]);

  // 페이지 로드 시 또는 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchWorkflows(currentPage);
  }, [currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // UI는 1부터, 백엔드는 0부터
  };

  // 검색 핸들러
  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
        {/* Card Container */}
        <Card className="card-shadow overflow-hidden">
          <CardHeader className="bg-muted/40 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <WorkflowIcon className="h-4 w-4" />
                <span>워크플로우 관리</span>
              </div>
              <Button className="gap-2" onClick={() => navigate("/workflows/add")}>
                <Plus className="w-4 h-4" />
                등록
              </Button>
            </div>
            <CardTitle className="text-2xl">워크플로우 관리</CardTitle>
            <p className="text-sm text-muted-foreground">
              등록된 워크플로우를 조회하고 관리할 수 있습니다.
            </p>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Search Bar and Count */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="사이트명, 사이트 URL 또는 블로그 타입으로 검색"
                  className="w-full sm:w-80"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSearch}
                  className="flex-shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                전체 {totalElements}건
              </Badge>
            </div>

            {/* Loading/Error/Empty/Data States */}
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                불러오는 중입니다...
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : filteredWorkflows.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-background/70 py-10 text-center text-muted-foreground">
                조건에 맞는 워크플로우가 없습니다.
              </div>
            ) : (
              <>
                <WorkflowTable
                  workflows={filteredWorkflows}
                  onSchedule={handleSchedule}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage + 1}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
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