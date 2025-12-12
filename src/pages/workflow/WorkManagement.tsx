import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { WorkInfoCard } from "@/components/workflow/WorkInfoCard";
import { BlogLinkTable } from "@/components/BlogLinkTable";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { workflowService, Workflow, WorkflowDetailResponse } from "@/services/workflowService";
import { workService, Work } from "@/services/workService";
import { convertWorkToBlogLink } from "@/utils/workUtils";

const WorkManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const workflowId = Number(id);

  // 이전 페이지에서 전달받은 워크플로우 데이터
  const workflowFromState = location.state?.WorkflowDetailResponse as WorkflowDetailResponse | undefined;

  const [workflow, setWorkflow] = useState<WorkflowDetailResponse | null>(workflowFromState || null);
  const [works, setWorks] = useState<Work[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 백엔드는 0부터 시작
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    if (workflowFromState) {
      // 이전 페이지에서 데이터를 받은 경우 바로 Work 목록만 로드
      fetchWorks(0);
    } else {
      // 직접 URL로 접근한 경우 워크플로우 정보도 가져오기
      fetchWorkflowInfo();
    }
  }, [workflowId]);

  // 페이지 변경 시 Work 목록만 재로드
  useEffect(() => {
    if (workflow && currentPage > 0) {
      fetchWorks(currentPage);
    }
  }, [currentPage]);

  // 워크플로우 정보 가져오기 (직접 URL 접근 시에만 사용)
  const fetchWorkflowInfo = async () => {
    try {
      setIsLoading(true);
      const response = await workflowService.getWorkflowById(workflowId);

      if (response.success) {
        setWorkflow(response.data);
        fetchWorks(0);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("워크플로우 정보 조회 실패:", error);
      setIsLoading(false);
    }
  };

  // Work 목록 가져오기
  const fetchWorks = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await workService.getWorksByWorkflowId(workflowId, page);

      if (response.success) {
        setWorks(response.data.works);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      }
    } catch (error) {
      console.error("Work 목록 조회 실패:", error);

    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // UI는 1부터, 백엔드는 0부터
  };

  const handleLogDetail = (linkId: number) => {
    toast({
      title: "로그 관리",
      description: `블로그 링크 ${linkId}번의 로그를 확인합니다.`,
    });
  };

  const handleStatsDetail = (linkId: number) => {
    toast({
      title: "통계 관리",
      description: `블로그 링크 ${linkId}번의 통계를 확인합니다.`,
    });
  };

  // Work를 BlogLink로 변환
  const blogLinks = works.map(convertWorkToBlogLink);

  // WorkInfoCard용 데이터 준비
  const workflowInfo = workflow ? {
    id: workflow.workflowId,
    url: workflow.siteUrl,
    blog: workflow.blogTypeId,
    firstCategory: workflow.setTrendCategory.depth1Category,
    secondCategory: workflow.setTrendCategory.depth2Category,
    thirdCategory: workflow.setTrendCategory.depth3Category,
    postCount: totalElements,
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container pt-24 pb-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">워크 관리</h1>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/workflows")}
            className="h-10 w-10 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Workflow Info Card */}
            {workflowInfo && (
              <div className="mb-6">
                <WorkInfoCard workflow={workflowInfo} />
              </div>
            )}

            {/* Blog Links Table */}
            <div>
              <BlogLinkTable
                blogLinks={blogLinks}
                onLogDetail={handleLogDetail}
                onStatsDetail={handleStatsDetail}
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
    </div>
  );
};

export default WorkManagement;
