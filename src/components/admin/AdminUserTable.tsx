import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminUser } from "./types";
import { Workflow } from "lucide-react";

type AdminUserTableProps = {
  users: AdminUser[];
  onSelect?: (userId: number) => void;
  onViewWorkflows?: (userId: number, userName: string) => void;
};

const roleLabels: Record<string, string> = {
  ADMIN: "관리자",
  USER: "사용자",
};

const roleVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "dark"> = {
  ADMIN: "default",
  USER: "secondary",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "dark"> = {
  ACTIVE: "success",
  SUSPENDED: "destructive",
  INACTIVE: "secondary",
  DORMANT: "default",
  WITHDRAWN: "dark",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "활성",
  SUSPENDED: "정지",
  INACTIVE: "비활성",
  DORMANT: "휴면",
  WITHDRAWN: "탈퇴",
};

export function AdminUserTable({ users, onSelect, onViewWorkflows }: AdminUserTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="font-semibold text-foreground w-16 text-center">No</TableHead>
            <TableHead className="font-semibold text-foreground text-center">이름</TableHead>
            <TableHead className="font-semibold text-foreground text-center">이메일</TableHead>
            <TableHead className="font-semibold text-foreground w-28 text-center">권한</TableHead>
            <TableHead className="font-semibold text-foreground w-28 text-center">상태</TableHead>
            <TableHead className="font-semibold text-foreground w-36 text-center">가입일</TableHead>
            <TableHead className="font-semibold text-foreground w-32 text-center">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.userId}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => onSelect?.(user.userId)}
            >
              <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
              <TableCell className="text-center font-semibold text-foreground">
                {user.name}
              </TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell className="text-center">
                <Badge variant={roleVariant[user.role] ?? "outline"}>{roleLabels[user.role] ?? user.role}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={statusVariant[user.status] ?? "default"}
                  className="tracking-tight"
                >
                  {statusLabels[user.status] ?? user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-muted-foreground">{user.createdAt.slice(0, 10)}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewWorkflows?.(user.userId, user.name);
                  }}
                  className="gap-1.5"
                >
                  <Workflow className="h-3.5 w-3.5" />
                  워크플로우
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
