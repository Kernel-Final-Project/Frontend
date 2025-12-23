import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { SiteRequest } from "./types";

type AdminSiteRequestTableProps = {
  requests: SiteRequest[];
  onSelect?: (requestId: number) => void;
  onApprove?: (requestId: number) => void;
  onReject?: (requestId: number) => void;
};

const stateVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  RECEIVED: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  PENDING: "outline",
};

const stateLabels: Record<string, string> = {
  RECEIVED: "접수됨",
  APPROVED: "승인됨",
  REJECTED: "거부됨",
  PENDING: "대기중",
};

export function AdminSiteRequestTable({ requests, onSelect }: AdminSiteRequestTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold text-foreground text-center">No</TableHead>
            <TableHead className="font-semibold text-foreground text-center">요청ID</TableHead>
            <TableHead className="font-semibold text-foreground text-center">사이트명</TableHead>
            <TableHead className="font-semibold text-foreground text-center">사이트 URL</TableHead>
            <TableHead className="font-semibold text-foreground text-center">상태</TableHead>
            <TableHead className="font-semibold text-foreground text-center">설명</TableHead>
            <TableHead className="font-semibold text-foreground text-center">등록일시</TableHead>
            <TableHead className="font-semibold text-foreground text-center">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <TableRow
              key={request.requestId}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => onSelect?.(request.requestId)}
            >
              <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
              <TableCell className="text-center font-medium">{request.requestId}</TableCell>
              <TableCell className="text-center font-medium">{request.siteName}</TableCell>
              <TableCell className="text-center">
                <a
                  href={request.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {request.siteUrl}
                </a>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={stateVariant[request.state] ?? "default"}>
                  {stateLabels[request.state] || request.state}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {request.description || "-"}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {formatDate(request.createdAt)}
              </TableCell>
              <TableCell className="text-center">
                {request.state === "RECEIVED" ? (
                  <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove?.(request.requestId);
                      }}
                      className="gap-1.5 text-green-600 hover:text-green-600 hover:bg-green-600/10 border-green-600/30"
                    >
                      <Check className="h-3.5 w-3.5" />
                      수락
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject?.(request.requestId);
                      }}
                      className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-3.5 w-3.5" />
                      거부
                    </Button>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


