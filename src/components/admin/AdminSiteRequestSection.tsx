import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, Globe } from "lucide-react";
import { siteRequestService } from "@/services/siteRequestService";
import { AdminSiteRequestTable } from "./AdminSiteRequestTable";
import { SiteRequest } from "./types";
import { Pagination } from "@/components/Pagination";
import { toast } from "@/hooks/use-toast";

type AdminSiteRequestSectionProps = {
  active: boolean;
};

export function AdminSiteRequestSection({ active }: AdminSiteRequestSectionProps) {
  const [requests, setRequests] = useState<SiteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchSiteRequests = async (page: number) => {
    try {
      setLoading(true);
      const response = await siteRequestService.getSiteRequests(page);

      if (response.success) {
        setRequests(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setError(null);
      }
    } catch (err) {
      const errorResponse = (err as any)?.response;
      const msg =
        errorResponse?.data?.message ||
        errorResponse?.statusText ||
        (err as Error)?.message ||
        "사이트 등록 요청 정보를 불러오지 못했습니다.";
      
      // 디버깅을 위해 콘솔에 상세 정보 출력
      console.error("사이트 등록 요청 조회 실패:", {
        status: errorResponse?.status,
        statusText: errorResponse?.statusText,
        data: errorResponse?.data,
        url: errorResponse?.config?.url,
      });
      
      setError(`${msg} (상태 코드: ${errorResponse?.status || 'N/A'})`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!active) return;
    fetchSiteRequests(currentPage);
  }, [active, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // Pagination 컴포넌트는 1부터 시작하므로 -1
  };

  const handleApprove = async (requestId: number) => {
    try {
      const response = await siteRequestService.approveSiteRequest(requestId);
      if (response.success) {
        toast({
          title: "승인 완료",
          description: response.message || "사이트 요청이 승인되었습니다.",
        });
        // 목록 새로고침
        fetchSiteRequests(currentPage);
      }
    } catch (err) {
      const errorResponse = (err as any)?.response;
      const msg =
        errorResponse?.data?.message ||
        (err as Error)?.message ||
        "사이트 요청 승인에 실패했습니다.";
      toast({
        title: "승인 실패",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      const response = await siteRequestService.rejectSiteRequest(requestId);
      if (response.success) {
        toast({
          title: "거부 완료",
          description: response.message || "사이트 요청이 거부되었습니다.",
        });
        // 목록 새로고침
        fetchSiteRequests(currentPage);
      }
    } catch (err) {
      const errorResponse = (err as any)?.response;
      const msg =
        errorResponse?.data?.message ||
        (err as Error)?.message ||
        "사이트 요청 거부에 실패했습니다.";
      toast({
        title: "거부 실패",
        description: msg,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="card-shadow overflow-hidden">
      <CardHeader className="bg-muted/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>사이트 등록 요청 관리</span>
        </div>
        <CardTitle className="text-xl">사이트 등록 요청 목록</CardTitle>
        <p className="text-sm text-muted-foreground">
          사용자가 요청한 사이트 등록 목록을 조회하고 관리할 수 있습니다.
        </p>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-end">
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
        ) : requests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background/70 py-10 text-center text-muted-foreground">
            등록된 사이트 요청이 없습니다.
          </div>
        ) : (
          <>
            <AdminSiteRequestTable
              requests={requests}
              onSelect={(id) => {
                console.log("Selected request ID:", id);
                // TODO: 상세 모달 구현 시 사용
              }}
              onApprove={handleApprove}
              onReject={handleReject}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}


