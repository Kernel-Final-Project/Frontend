import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, Users } from "lucide-react";
import { AdminUser } from "./types";
import { userService } from "@/services/userService";
import { AdminUserTable } from "./AdminUserTable";
import { AdminUserDetailModal } from "./AdminUserDetailModal";

type AdminUserSectionProps = {
  active: boolean;
};

export function AdminUserSection({ active }: AdminUserSectionProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!active) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await userService.getUsers();
        const mapped = (res?.content ?? []).map((u) => ({
          userId: u.userId,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
        }));
        setUsers(mapped);
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

    fetchUsers();
  }, [active]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q),
    );
  }, [users, query]);

  return (
    <>
      <Card className="card-shadow overflow-hidden">
        <CardHeader className="bg-muted/40 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>사용자 관리</span>
          </div>
          <CardTitle className="text-xl">전체 사용자</CardTitle>
          <p className="text-sm text-muted-foreground">권한과 상태를 확인하고 관리할 수 있습니다.</p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름으로 검색"
              className="w-full sm:w-64"
            />
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
              총 {users.length}명
            </Badge>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              불러오는 중입니다...
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-background/70 py-10 text-center text-muted-foreground">
              조건에 맞는 사용자가 없습니다.
            </div>
          ) : (
            <AdminUserTable
              users={filtered}
              onSelect={(id) => {
                setSelectedUserId(id);
                setDetailOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      <AdminUserDetailModal
        userId={selectedUserId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusChange={(id, nextStatus) => {
          setUsers((prev) => prev.map((u) => (u.userId === id ? { ...u, status: nextStatus } : u)));
        }}
      />
    </>
  );
}
