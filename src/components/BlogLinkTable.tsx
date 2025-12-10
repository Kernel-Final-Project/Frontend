import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";

interface BlogLink {
  id: number;
  blogLink: string;
  product: string;
  executionTime: string;
  status: "성공" | "진행중" | "실패";
}

interface BlogLinkTableProps {
  blogLinks: BlogLink[];
  onLogDetail: (id: number) => void;
  onStatsDetail: (id: number) => void;
}

const statusStyles = {
  "성공": "bg-[hsl(var(--status-success))] hover:bg-[hsl(var(--status-success))] text-white",
  "진행중": "bg-[hsl(var(--status-warning))] hover:bg-[hsl(var(--status-warning))] text-white",
  "실패": "bg-[hsl(var(--status-error))] hover:bg-[hsl(var(--status-error))] text-white",
};

export function BlogLinkTable({ blogLinks, onLogDetail, onStatsDetail }: BlogLinkTableProps) {
  const navigate = useNavigate();
  const { id: workId } = useParams();

  const handleLogDetail = (logId: number) => {
    navigate(`/work/${workId}/log/${logId}`);
  };

  return (
    <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold text-foreground w-16 text-center">ID</TableHead>
            <TableHead className="font-semibold text-foreground">블로그 링크</TableHead>
            <TableHead className="font-semibold text-foreground text-center">상품</TableHead>
            <TableHead className="font-semibold text-foreground text-center">실행시간</TableHead>
            <TableHead className="font-semibold text-foreground text-center">로그관리</TableHead>
            <TableHead className="font-semibold text-foreground text-center">통계관리</TableHead>
            <TableHead className="font-semibold text-foreground w-24 text-center">상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogLinks.map((link, index) => (
            <TableRow 
              key={link.id} 
              className="transition-colors hover:bg-muted/50"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <TableCell className="font-medium text-center">{link.id}</TableCell>
              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                {link.blogLink}
              </TableCell>
              <TableCell className="text-center">{link.product}</TableCell>
              <TableCell className="text-center text-muted-foreground">{link.executionTime}</TableCell>
              <TableCell className="text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogDetail(link.id);
                  }}
                  className="text-xs h-8 px-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  상세보기
                </Button>
              </TableCell>
              <TableCell className="text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStatsDetail(link.id)}
                  className="text-xs h-8 px-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  상세보기
                </Button>
              </TableCell>
              <TableCell className="text-center">
                <Badge className={statusStyles[link.status]}>
                  {link.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
