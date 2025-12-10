// src/pages/Login.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-28 pb-20 px-4">
        <div className="w-full max-w-md">
          {/* OCP Logo and Welcome Message */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-2xl">O</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">OCP에 오신 것을 환영합니다</h1>
            <p className="text-muted-foreground">
              AI 기반 워크플로우 자동화 플랫폼
            </p>
          </div>

          <Card className="shadow-xl border-border/50">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">로그인</CardTitle>
              <CardDescription className="text-center">
                소셜 계정으로 간편하게 로그인하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <Button
                onClick={() => login('google')}
                className="w-full h-11 text-base"
                variant="outline"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google로 로그인
              </Button>

              <Button
                onClick={() => login('naver')}
                className="w-full h-11 text-base bg-[#03C75A] hover:bg-[#02B351] text-white"
              >
                <span className="font-bold mr-2 text-lg">N</span>
                Naver로 로그인
              </Button>

              <div className="pt-4 text-center text-xs text-muted-foreground">
                로그인하시면{" "}
                <a href="#" className="text-primary hover:underline">
                  이용약관
                </a>
                {" "}및{" "}
                <a href="#" className="text-primary hover:underline">
                  개인정보처리방침
                </a>
                에 동의하는 것으로 간주됩니다.
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <span className="text-foreground">소셜 로그인으로 자동 회원가입됩니다</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}