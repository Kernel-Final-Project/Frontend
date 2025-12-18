import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User as UserIcon, Mail, Shield, Calendar } from "lucide-react";
import { AdminUser } from "./types";

type AdminUserDetailContentProps = {
  user: AdminUser;
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
  ACTIVE: "success",
  INACTIVE: "secondary",
  DELETED: "destructive",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  DELETED: "삭제됨",
};

const roleLabels: Record<string, string> = {
  ADMIN: "관리자",
  USER: "사용자",
};

export function AdminUserDetailContent({ user }: AdminUserDetailContentProps) {
  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={statusVariant[user.status] ?? "default"}
                className="tracking-tight"
              >
                {statusLabels[user.status] || user.status}
              </Badge>
              <Badge variant="outline" className="tracking-tight">
                {roleLabels[user.role] || user.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* 사용자 정보 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">사용자 정보</h3>
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" />
              사용자 ID
            </p>
            <p className="text-sm text-foreground font-medium">#{user.userId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              이메일
            </p>
            <p className="text-sm text-foreground font-medium">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              권한
            </p>
            <p className="text-sm text-foreground font-medium">{roleLabels[user.role] || user.role}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              가입일
            </p>
            <p className="text-sm text-foreground font-medium">{user.createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
