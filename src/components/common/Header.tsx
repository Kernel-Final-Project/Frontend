import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "워크플로우 관리", href: "/workflows" },
  { label: "이용 안내", href: "/howToUse" },
  { label: "사이트 등록 요청", href: "/howToUse" },
  { label: "공지사항", href: "/notices" }
];

type HeaderProps = {
  onLoginClick?: () => void;
};

export function Header({ onLoginClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-1">
          <img
            src={logoImg}
            alt="OCP 로고"
            className="w-20 h-24 object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className="text-sm font-semibold text-muted-foreground transition-colors"
              style={{
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#5271ff'}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
              activeClassName="text-primary font-semibold"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="w-32 h-10" />
          ) : isAuthenticated && user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-3 py-2 focus:outline-none hover:bg-accent/50 transition-colors">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || '사용자'}
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                      <span className="text-primary font-medium text-sm">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.provider}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/mypage')}>
                  <User className="mr-2 h-4 w-4" />
                  마이페이지
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => {
                if (onLoginClick) {
                  onLoginClick();
                } else {
                  navigate('/', { state: { loginRequired: true } });
                }
              }}
            >
              로그인
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 토글"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="container py-4 flex flex-col gap-3">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || '사용자'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                    <span className="text-primary font-medium">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                activeClassName="text-primary font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {isLoading ? (
              <div className="h-20" />
            ) : isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/mypage');
                    setIsMenuOpen(false);
                  }}
                  className="mt-2 justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  마이페이지
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  if (onLoginClick) {
                    onLoginClick();
                    setIsMenuOpen(false);
                  } else {
                    navigate('/', { state: { loginRequired: true } });
                  }
                }}
                className="mt-2"
              >
                로그인
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
