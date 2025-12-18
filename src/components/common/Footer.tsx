export function Footer() {
  return (
      <footer className="bg-background border-t border-border">
        <div className="container py-2">
          <div className="flex flex-col items-center justify-center gap-1">
            {/* 로고 */}
            <img src="/src/assets/logo.png" alt="OCP 로고" className="w-20 h-24 object-contain"/>
            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} OCP. Allㅎ  rights reserved.
            </p>
          </div>
        </div>
      </footer>
  );
}