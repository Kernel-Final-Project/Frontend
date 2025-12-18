import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { workService, AdminWork } from "@/services/workService";
import { AdminWorkTable } from "./AdminWorkTable";
import { AdminUnifiedDetailModal } from "./AdminUnifiedDetailModal";
import { Pagination } from "@/components/Pagination";

type AdminWorkSectionProps = {
  active: boolean;
  workflowId?: number;
};

export function AdminWorkSection({ active, workflowId }: AdminWorkSectionProps) {
  const [works, setWorks] = useState<AdminWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialPage, setInitialPage] = useState<{ type: "work" | "workflow" | "user"; id: number; data?: any } | null>(null);

  const fetchWorks = async (page: number) => {
    try {
      setLoading(true);
      const response = await workService.getWorksForAdmin(page, workflowId);

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
        "워크 정보를 불러오지 못했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!active) return;
    if (currentPage > 0) {
      fetchWorks(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (!active) return;
    setInitialPage(null);  // 이전 워크플로우 정보 제거
    setModalOpen(false);   // 모달 닫기
    setCurrentPage(0);
    fetchWorks(0);
  }, [active, workflowId]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return works;
    return works.filter(
      (w) =>
        w.workId.toString().includes(q) ||
        w.status.toLowerCase().includes(q) ||
        (w.postingUrl && w.postingUrl.toLowerCase().includes(q)) ||
        (w.choiceProduct && w.choiceProduct.toLowerCase().includes(q)) ||
        (w.title && w.title.toLowerCase().includes(q)) ||
        (w.choiceTrendKeyword && w.choiceTrendKeyword.toLowerCase().includes(q))
    );
  }, [works, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // UI는 1부터, 백엔드는 0부터
  };

  return (
    <Card className="card-shadow overflow-hidden">
      <CardHeader className="bg-muted/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>워크 관리</span>
        </div>
        <CardTitle className="text-xl">
          {workflowId ? `워크플로우 #${workflowId}의 워크` : "전체 워크"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {workflowId
            ? "선택된 워크플로우의 워크를 조회하고 관리할 수 있습니다."
            : "모든 워크플로우의 워크를 조회하고 관리할 수 있습니다."}
        </p>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="워크 ID, 상태, 제목, 키워드로 검색"
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

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            불러오는 중입니다...
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background/70 py-10 text-center text-muted-foreground">
            조건에 맞는 워크가 없습니다.
          </div>
        ) : (
          <>
            <AdminWorkTable
              works={filtered}
              onSelect={(workId) => {
                const selected = works.find(w => w.workId === workId);
                if (selected) {
                  setInitialPage({ type: "work", id: workId, data: selected });
                  setModalOpen(true);
                }
              }}
              onOpenWorkflowDetail={(workflowId) => {
                setInitialPage({ type: "workflow", id: workflowId });
                setModalOpen(true);
              }}
              onOpenUserDetail={(userId) => {
                setInitialPage({ type: "user", id: userId });
                setModalOpen(true);
              }}
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

      {initialPage && (
        <AdminUnifiedDetailModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          initialPage={initialPage}
        />
      )}
    </Card>
  );
}
