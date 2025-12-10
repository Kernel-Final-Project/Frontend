import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { label: "제품소개", href: "/#products", isAnchor: true },
  { label: "솔루션", href: "/#solutions", isAnchor: true },
  { label: "회사소개", href: "/#about", isAnchor: true },
  { label: "워크플로우 관리", href: "/workflows", isAnchor: false },
  { label: "대시보드", href: "/dashboard", isAnchor: false },
  { label: "공지사항", href: "/notices", isAnchor: false },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">O</span>
          </div>
          <span className="font-bold text-lg text-foreground">OCP</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            item.isAnchor ? (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-primary font-semibold"
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            로그인
          </Button>
          <Button size="sm">시작하기</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 토글"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <nav className="container py-4 flex flex-col gap-3">
            {navItems.map((item) =>
              item.isAnchor ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  activeClassName="text-primary font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              )
            )}
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" className="justify-start">
                로그인
              </Button>
              <Button size="sm">시작하기</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
