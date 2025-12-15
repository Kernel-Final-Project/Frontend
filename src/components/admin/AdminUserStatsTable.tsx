import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NormalizedUserStatPoint } from "./types";
import { formatRate } from "./userStatsUtils";

type Props = {
  data: NormalizedUserStatPoint[];
};

export function AdminUserStatsTable({ data }: Props) {
  return (
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
          {data.map((row) => (
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
  );
}
