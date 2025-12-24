import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { siteRequestService, SiteRequestResponse } from "@/services/siteRequestService";
import { Pagination } from "@/components/Pagination";

const stateVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  RECEIVED: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

const stateLabels: Record<string, string> = {
  RECEIVED: "접수완료",
  APPROVED: "승인",
  REJECTED: "거부",
};

export function MySiteRequestsCard() {
  const [requests, setRequests] = useState<SiteRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchRequests = async (page: number) => {
    try {
      setLoading(true);
      const response = await siteRequestService.getMyRequests(page);

      if (response.success) {
        setRequests(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setError(null);
      }
    } catch (err) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "사이트 요청 목록을 불러오지 못했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              내 사이트 요청
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              요청한 사이트 등록 현황을 확인하세요.
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
            전체 {totalElements}건
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
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
            <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>아직 요청한 사이트가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.requestId}
                  className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{request.siteName}</h3>
                        <Badge variant={stateVariant[request.state] ?? "default"}>
                          {stateLabels[request.state] || request.state}
                        </Badge>
                      </div>
                      <a
                        href={request.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {request.siteUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {request.description && (
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        요청일: {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
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
  );
}
