import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminUser } from "./types";

type AdminUserTableProps = {
  users: AdminUser[];
  onSelect?: (userId: number) => void;
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

export function AdminUserTable({ users, onSelect }: AdminUserTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="w-16 text-center">No</TableHead>
            <TableHead className="text-center">이름</TableHead>
            <TableHead className="text-center">이메일</TableHead>
            <TableHead className="w-28 text-center">권한</TableHead>
            <TableHead className="w-28 text-center">상태</TableHead>
            <TableHead className="w-36 text-center">가입일</TableHead>
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
              <TableCell className="text-center font-semibold text-foreground">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell className="text-center">
                <Badge variant={roleVariant[user.role] ?? "outline"}>{roleLabels[user.role] ?? user.role}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={statusVariant[user.status] ?? "default"}
                  className="uppercase tracking-tight inline-flex min-w-[96px] justify-center"
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-muted-foreground">{user.createdAt.slice(0, 10)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
