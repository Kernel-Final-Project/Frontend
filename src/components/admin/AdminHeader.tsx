import { Button } from "@/components/ui/button";
import { LogOut, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/logo.png";

export function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-6">
        {/* 왼쪽: 로고 + 타이틀 */}
        <div className="flex items-center gap-3">
          <a href="/admin" className="flex items-center">
            <img
              src={logoImg}
              alt="OCP 로고"
              className="h-12 w-auto object-contain"
            />
          </a>
          <span className="text-base font-medium text-gray-700">관리자 시스템</span>
        </div>

        {/* 오른쪽: 버튼들 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="h-8 text-sm"
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            로그아웃
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="h-8 text-sm"
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            나가기
          </Button>
        </div>
      </div>
    </header>
  );
}
