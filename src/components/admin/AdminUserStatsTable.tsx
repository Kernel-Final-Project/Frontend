import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NormalizedUserStatPoint } from "./types";
import { formatRate } from "./userStatsUtils";

type Props = {
  data: NormalizedUserStatPoint[];
};

const ITEMS_PER_PAGE = 10;

export function AdminUserStatsTable({ data }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="w-32 text-center">기간</TableHead>
              <TableHead className="w-32 text-center">총 사용자</TableHead>
              <TableHead className="w-32 text-center">전일 대비</TableHead>
              <TableHead className="w-32 text-center">활성 사용자</TableHead>
              <TableHead className="w-32 text-center">전일 대비</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.label} className="hover:bg-muted/50">
                <TableCell className="text-center text-muted-foreground">{row.label}</TableCell>
                <TableCell className="text-center font-semibold text-foreground">{row.totalUsers.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={row.userGrowthRate >= 0 ? "success" : "destructive"} className="min-w-[80px] justify-center">
                    {formatRate(row.userGrowthRate)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold text-foreground">{row.activeUsers.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={row.activeUserGrowthRate >= 0 ? "success" : "destructive"} className="min-w-[80px] justify-center">
                    {formatRate(row.activeUserGrowthRate)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            총 {data.length}개 중 {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, data.length)}개 표시
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
