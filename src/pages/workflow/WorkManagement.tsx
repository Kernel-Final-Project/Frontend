import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { WorkInfoCard } from "@/components/workflow/WorkInfoCard";
import { BlogLinkTable } from "@/components/workflow/BlogLinkTable";
import { WorkDetailModal } from "@/components/workflow/WorkDetailModal";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, AlertCircle, Loader2, Workflow as WorkflowIcon, FileText, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { workflowService, WorkflowDetailResponse } from "@/services/workflowService";
import { workService, Work, WorkDetailResponse } from "@/services/workService";
import { convertWorkToBlogLink } from "@/utils/workUtils";

const WorkManagement = () => {
  const { workflowId: workflowIdParam } = useParams();
  const navigate = useNavigate();
  const workflowId = workflowIdParam ? Number(workflowIdParam) : NaN;

  const [workflow, setWorkflow] = useState<WorkflowDetailResponse | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 백엔드는 0부터 시작
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWork, setSelectedWork] = useState<WorkDetailResponse | null>(null);
  const [workDetailModalOpen, setWorkDetailModalOpen] = useState(false);
  const [loadingWorkDetail, setLoadingWorkDetail] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    // 항상 API를 호출하여 상세 정보를 가져옴
    fetchWorkflowInfo();
  }, [workflowId]);

  // 페이지 변경 시 Work 목록만 재로드
  useEffect(() => {
    if (workflow && currentPage > 0) {
      fetchWorks(currentPage);
    }
  }, [currentPage]);

  // 워크플로우 정보 가져오기 (직접 URL 접근 시에만 사용)
  const fetchWorkflowInfo = async () => {
    if (Number.isNaN(workflowId)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await workflowService.getWorkflowById(workflowId);

      if (response.success) {
        console.log("Workflow API Response:", response.data);
        console.log("setTrendCategory:", response.data.setTrendCategory);
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
    if (Number.isNaN(workflowId)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await workService.getWorksByWorkflowId(workflowId, page);

      if (response.success) {
        setWorks(response.data.works);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setError(null);
      }
    } catch (err) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "워크 목록을 불러오지 못했습니다.";
      setError(msg);
      console.error("Work 목록 조회 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 필터링
  const filteredWorks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return works;
    return works.filter(
      (w) =>
        (w.postingUrl && w.postingUrl.toLowerCase().includes(q)) ||
        (w.choiceProduct && w.choiceProduct.toLowerCase().includes(q)) ||
        (w.status && w.status.toLowerCase().includes(q))
    );
  }, [works, searchQuery]);

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

  const handleLogDetail = (targetWorkId: number) => {
    if (Number.isNaN(targetWorkId)) {
      toast({
        title: "로그 이동 실패",
        description: "선택한 워크 정보를 확인할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    navigate(`/workflow/${targetWorkId}/logs`, {
      state: {
        workflowId: Number.isNaN(workflowId) ? undefined : workflowId,
      },
    });
  };

  const handleWorkDetail = async (targetWorkId: number) => {
    try {
      setLoadingWorkDetail(true);
      const response = await workService.getWorkById(targetWorkId);

      if (response.success && response.data) {
        setSelectedWork(response.data);
        setWorkDetailModalOpen(true);
      } else {
        toast({
          title: "워크 조회 실패",
          description: "워크 상세 정보를 불러오지 못했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("워크 상세 조회 실패:", error);
      toast({
        title: "워크 조회 실패",
        description: "워크 상세 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoadingWorkDetail(false);
    }
  };

  // Work를 BlogLink로 변환
  const filteredBlogLinks = filteredWorks.map(convertWorkToBlogLink);

  // WorkInfoCard용 데이터 준비
  const workflowInfo = workflow ? {
    id: workflow.workflowId,
    url: workflow.siteUrl,
    siteName: workflow.siteName,
    blogName: workflow.blogType,
    blogUrl: workflow.blogUrl,
    blogAccountId: workflow.blogAccountId,
    status: workflow.status,
    testStatus: workflow.testStatus,
    firstCategory: workflow.setTrendCategory.depth1Category,
    secondCategory: workflow.setTrendCategory.depth2Category,
    thirdCategory: workflow.setTrendCategory.depth3Category,
    readableRule: workflow.recurrenceRule?.readableRule,
    postCount: totalElements,
    userName: workflow.userName,
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container pt-24 pb-12">
        {/* Back Button */}


        {/* Main Card */}
        <Card className="card-shadow overflow-hidden">
          <CardHeader className="bg-muted/40 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/workflows")}
                className="h-8 w-8 rounded-lg hover:bg-muted -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <FileText className="h-4 w-4" />
              <span>워크 관리</span>
            </div>
            <CardTitle className="text-2xl">워크플로우의 워크 목록</CardTitle>
            <p className="text-sm text-muted-foreground">
              선택된 워크플로우의 워크를 조회하고 관리할 수 있습니다.
            </p>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Workflow Info */}
            {workflowInfo && (
              <div className="mb-6">
                <WorkInfoCard workflow={workflowInfo} />
              </div>
            )}
            {/* Search Bar and Count */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="블로그 링크, 상품명 또는 상태로 검색"
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
            ) : filteredBlogLinks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-background/70 py-10 text-center text-muted-foreground">
                조건에 맞는 워크가 없습니다.
              </div>
            ) : (
              <>
                <BlogLinkTable
                  blogLinks={filteredBlogLinks}
                  onLogDetail={handleLogDetail}
                  onWorkDetail={handleWorkDetail}
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

      {/* Work Detail Modal */}
      <WorkDetailModal
        open={workDetailModalOpen}
        onOpenChange={setWorkDetailModalOpen}
        work={selectedWork}
      />
    </div>
  );
};

export default WorkManagement;