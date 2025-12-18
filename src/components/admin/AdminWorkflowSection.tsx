import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Workflow, Plus, Search } from "lucide-react";
import { workflowService, Workflow as WorkflowType } from "@/services/workflowService";
import { AdminWorkflowTable } from "./AdminWorkflowTable";
import { AdminUnifiedDetailModal } from "./AdminUnifiedDetailModal";
import { UserFilterInfo } from "./types";

type AdminWorkflowSectionProps = {
  active: boolean;
  userFilter?: UserFilterInfo;
  onNavigateToWork?: (workflowId: number) => void;
};

export function AdminWorkflowSection({ active, userFilter, onNavigateToWork }: AdminWorkflowSectionProps) {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const fetchWorkflows = async (page: number, userId?: number) => {
    try {
      setLoading(true);
      const response = await workflowService.getWorkflowsForAdmin(page, userId);

      if (response.success) {
        setWorkflows(response.data.content);
        setTotalElements(response.data.totalElements);
        setError(null);
      }
    } catch (err) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "워크플로우 정보를 불러오지 못했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!active) return;

    const userId = userFilter?.userId;
    fetchWorkflows(currentPage, userId);
  }, [active, currentPage, userFilter]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return workflows;
    return workflows.filter(
      (w) =>
        w.siteUrl.toLowerCase().includes(q) ||
        w.siteName.toLowerCase().includes(q) ||
        w.blogType.toLowerCase().includes(q)
    );
  }, [workflows, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await workflowService.deleteWorkflow(id);
      if (response.success) {
        fetchWorkflows(currentPage, userFilter?.userId);
      }
    } catch (err) {
      console.error("워크플로우 삭제 실패:", err);
    }
  };

  const handleUpdate = () => {
    fetchWorkflows(currentPage, userFilter?.userId);
  };

  return (
    <>
      {/* {isRegistering ? (
        // 등록 폼 표시
        <AddWorkflow
          onCancel={() => setIsRegistering(false)}
          onSuccess={() => {
            setIsRegistering(false);
            handleUpdate();  // 목록 새로고침
          }}
        />
      ) : ( */}
      <Card className="card-shadow overflow-hidden">
        <CardHeader className="bg-muted/40 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Workflow className="h-4 w-4" />
              <span>워크플로우 관리</span>
            </div>
            <Button
              className="gap-2"
              onClick={() => setIsRegistering(true)}
            >
              <Plus className="w-4 h-4" />
              등록
            </Button>
          </div>
          <CardTitle className="text-xl">
            {userFilter ? `${userFilter.userName}님의 워크플로우` : "전체 워크플로우"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {userFilter
              ? "특정 사용자의 워크플로우를 조회하고 관리할 수 있습니다."
              : "모든 사용자의 워크플로우를 조회하고 관리할 수 있습니다."}
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="사이트 URL 또는 블로그 타입으로 검색"
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
              조건에 맞는 워크플로우가 없습니다.
            </div>
          ) : (
            <AdminWorkflowTable
              workflows={filtered}
              onUpdate={handleUpdate}
              onRowClick={onNavigateToWork}
              onSelect={(id) => {
                setSelectedWorkflowId(id);
                setDetailOpen(true);
              }}
            />

          )}
        </CardContent>
      </Card>
      {/* )} */}

      {selectedWorkflowId && (
        <AdminUnifiedDetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          initialPage={{ type: "workflow", id: selectedWorkflowId }}
          onDeleteWorkflow={(id) => {
            handleDelete(id);
            setDetailOpen(false);
          }}
          onUpdateWorkflow={handleUpdate}  // 이 줄 추가
        />
      )}
    </>
  );
}
