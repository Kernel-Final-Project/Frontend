import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { MySiteRequestsCard } from "@/components/mypage/MySiteRequestsCard";

const MyPage = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();
  const [withdrawing, setWithdrawing] = useState(false);

  const providerButton = useMemo(() => {
    const provider = (user?.provider || "").toUpperCase();
    const map: Record<string, { label: string; className: string }> = {
      KAKAO: { label: "KAKAO로 로그인", className: "bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FEE500] cursor-not-allowed" },
      NAVER: { label: "NAVER로 로그인", className: "bg-[#03C75A] text-white hover:bg-[#03C75A] cursor-not-allowed" },
      GOOGLE: { label: "GOOGLE로 로그인", className: "bg-white text-[#1F1F1F] border border-border hover:bg-white cursor-not-allowed" },
    };
    return map[provider] ?? { label: `${provider || "UNKNOWN"}로 로그인`, className: "bg-muted text-muted-foreground cursor-not-allowed" };
  }, [user?.provider]);

  const handleWithdraw = async () => {
    if (!confirm("정말 회원을 탈퇴하시겠어요? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    try {
      setWithdrawing(true);
      await authService.withdraw();
      toast({ title: "탈퇴 완료", description: "회원 탈퇴가 완료되었습니다." });
      await logout();
      navigate("/");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      toast({
        title: "탈퇴 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setWithdrawing(false);
    }
  };

  const handleViewWorks = () => navigate("/workflows");
  const handleAddWorkflow = () => navigate("/workflows/add");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto w-full max-w-[1400px] space-y-6">
          <div className="flex gap-4 lg:gap-6">
            <aside className="w-[260px] shrink-0 bg-card border border-border rounded-xl p-4 space-y-3 card-shadow">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">바로가기</p>
                <p className="text-xs text-muted-foreground">워크 관리 메뉴를 선택하세요.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={handleViewWorks}
                >
                  내 워크조회
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={handleAddWorkflow}
                >
                  워크플로우 등록하러 가기
                </Button>
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">마이페이지</h1>
                <p className="text-muted-foreground">내 계정 정보를 확인하고 관리하세요.</p>
              </div>

              <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>내 계정 정보</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">계정으로 로그인한 소셜 정보를 확인하세요.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      disabled
                      className={`h-9 px-4 text-sm font-semibold ${providerButton.className}`}
                    >
                      {providerButton.label}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 rounded-lg border bg-muted/40">
                        <p className="text-xs text-muted-foreground">이름</p>
                        <p className="text-lg font-semibold">{user?.name || "-"}</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-muted/40">
                        <p className="text-xs text-muted-foreground">이메일</p>
                        <p className="text-lg font-semibold break-all">{user?.email || "-"}</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-muted/40">
                        <p className="text-xs text-muted-foreground">로그인 제공자</p>
                        <p className="text-lg font-semibold">{user?.provider || "-"}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      onClick={handleWithdraw}
                      disabled={withdrawing}
                    >
                      {withdrawing ? "탈퇴 중..." : "회원 탈퇴하기"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 사이트 요청 목록 */}
              <MySiteRequestsCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
