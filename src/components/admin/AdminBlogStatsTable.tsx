import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NormalizedBlogStatPoint } from "./types";
import { formatRate } from "./blogStatsUtils";

type Props = {
  data: NormalizedBlogStatPoint[];
};

export function AdminBlogStatsTable({ data }: Props) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="w-48 text-center">기간</TableHead>
            <TableHead className="w-32 text-center">포스트 수</TableHead>
            <TableHead className="w-32 text-center">전 기간 대비</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.label} className="hover:bg-muted/50">
              <TableCell className="text-center text-muted-foreground">{row.label}</TableCell>
              <TableCell className="text-center font-semibold text-foreground">{row.postCount.toLocaleString()}</TableCell>
              <TableCell className="text-center">
                <Badge variant={row.postGrowthRate >= 0 ? "success" : "destructive"} className="min-w-[80px] justify-center">
                  {formatRate(row.postGrowthRate)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
