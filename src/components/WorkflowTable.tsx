import { useNavigate } from "react-router-dom";
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

interface Workflow {
  id: number;
  url: string;
  blog: string;
  criteria: string;
  blogId: string;
  status: "활성" | "비활성";
}

interface WorkflowTableProps {
  workflows: Workflow[];
  onSchedule: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function WorkflowTable({ workflows, onSchedule, onEdit, onDelete }: WorkflowTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (id: number) => {
    navigate(`/work/${id}`);
  };

  return (
    <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold text-foreground w-16">ID</TableHead>
            <TableHead className="font-semibold text-foreground">URL</TableHead>
            <TableHead className="font-semibold text-foreground">블로그</TableHead>
            <TableHead className="font-semibold text-foreground">기준</TableHead>
            <TableHead className="font-semibold text-foreground">블로그 ID</TableHead>
            <TableHead className="font-semibold text-foreground w-20">상태</TableHead>
            <TableHead className="font-semibold text-foreground text-center">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.map((workflow, index) => (
            <TableRow 
              key={workflow.id} 
              className="transition-colors hover:bg-muted/50 cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleRowClick(workflow.id)}
            >
              <TableCell className="font-medium">{workflow.id}</TableCell>
              <TableCell className="text-primary hover:underline max-w-[200px] truncate">
                {workflow.url}
              </TableCell>
              <TableCell>{workflow.blog}</TableCell>
              <TableCell>{workflow.criteria}</TableCell>
              <TableCell className="text-muted-foreground">{workflow.blogId}</TableCell>
              <TableCell>
                <Badge 
                  variant={workflow.status === "활성" ? "default" : "secondary"}
                  className={workflow.status === "활성" ? "bg-[hsl(var(--status-active))] hover:bg-[hsl(var(--status-active))]" : ""}
                >
                  {workflow.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSchedule(workflow.id)}
                    className="text-xs h-8 px-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    일정 관리
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(workflow.id)}
                    className="text-xs h-8 px-3"
                  >
                    수정
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(workflow.id)}
                    className="text-xs h-8 px-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    삭제
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
