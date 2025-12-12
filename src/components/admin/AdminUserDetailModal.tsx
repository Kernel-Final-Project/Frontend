import { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, Shield, User, CalendarClock } from "lucide-react";
import { userService } from "@/services/userService";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "dark"> = {
  ACTIVE: "success",
  SUSPEND: "destructive",
  SUSPENDED: "destructive",
  INACTIVE: "secondary",
  DORMANT: "default",
  WITHDRAWN: "dark",
};

type AdminUserDetailModalProps = {
  userId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (userId: number, nextStatus: string) => void;
};

export function AdminUserDetailModal({ userId, open, onOpenChange, onStatusChange }: AdminUserDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [user, setUser] = useState<{
    userId: number;
    name: string;
    email: string;
    status: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  } | null>(null);

  useEffect(() => {
    if (!open || userId == null) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserById(userId);
        setUser(data);
        setError(null);
      } catch (err) {
        const msg =
          (err as any)?.response?.data?.message ||
          (err as Error)?.message ||
          "사용자 정보를 불러오지 못했습니다.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [open, userId]);

  const handleToggleStatus = async () => {
    if (!user) return;
    const isSuspended = user.status === "SUSPEND" || user.status === "SUSPENDED";
    const nextStatus = isSuspended ? "UNSUSPEND" : "SUSPEND";

    if (nextStatus === "SUSPEND" && !reason.trim()) {
      toast({
        title: "사유 입력 필요",
        description: "정지 사유를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(true);
      const updated = await userService.updateUserStatus(user.userId, nextStatus, reason || undefined);
      const refreshed = updated ?? (await userService.getUserById(user.userId));

      if (!refreshed) {
        throw new Error("사용자 정보를 갱신하지 못했습니다.");
      }

      setUser(refreshed);
      if (nextStatus === "UNSUSPEND") {
        setReason("");
      }
      toast({
        title: "상태 변경 완료",
        description: `${refreshed.name}님의 상태가 ${refreshed.status}로 변경되었습니다.`,
      });
      onStatusChange?.(refreshed.userId, refreshed.status);
    } catch (err) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "상태 변경에 실패했습니다.";
      toast({
        title: "상태 변경 실패",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const roleLabel = useMemo(() => {
    if (!user) return "";
    if (user.role === "ADMIN") return "관리자";
    if (user.role === "USER") return "사용자";
    return user.role;
  }, [user]);

  const isSuspended = user?.status === "SUSPEND" || user?.status === "SUSPENDED";
  const statusLabel = user?.status ?? "";
  const badgeVariant = statusVariant[statusLabel] ?? "secondary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>사용자 관리</DialogTitle>
          <DialogDescription>계정 상태와 정보를 확인하고 변경하세요.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            불러오는 중입니다...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive text-sm">
            {error}
          </div>
        ) : user ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {user.userId}</p>
                </div>
              </div>
              <Badge variant={badgeVariant} className="uppercase tracking-tight">
                {statusLabel}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span className="text-foreground">{roleLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                <span className="text-foreground">
                  가입일 {format(new Date(user.createdAt), "yyyy.MM.dd HH:mm")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                <span className="text-foreground">
                  마지막 로그인 {format(new Date(user.updatedAt), "yyyy.MM.dd HH:mm")}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">사유</span>
                <span className="text-xs text-muted-foreground">정지 시 필수 입력</span>
              </div>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="정지 또는 상태 변경 사유를 입력하세요."
                rows={3}
                disabled={isSuspended && updating}
              />
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button
                variant={isSuspended ? "outline" : "destructive"}
                onClick={handleToggleStatus}
                disabled={updating}
              >
                {updating
                  ? "변경 중..."
                  : isSuspended
                    ? "정지 해제"
                    : "정지하기"}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
