import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WorkflowInfo {
  id: number;
  url: string;
  blog: string;
  criteria: string;
  postCount: number;
}

interface WorkInfoCardProps {
  workflow: WorkflowInfo;
}

export function WorkInfoCard({ workflow }: WorkInfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold text-foreground w-20 text-center">ID</TableHead>
            <TableHead className="font-semibold text-foreground text-center">URL</TableHead>
            <TableHead className="font-semibold text-foreground text-center">블로그</TableHead>
            <TableHead className="font-semibold text-foreground text-center">기준</TableHead>
            <TableHead className="font-semibold text-foreground w-28 text-center">포스팅 건수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-muted/50">
            <TableCell className="font-medium text-center">{workflow.id}</TableCell>
            <TableCell className="text-primary text-center">{workflow.url}</TableCell>
            <TableCell className="text-center">{workflow.blog}</TableCell>
            <TableCell className="text-center">{workflow.criteria}</TableCell>
            <TableCell className="text-center font-medium">{workflow.postCount}건</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
