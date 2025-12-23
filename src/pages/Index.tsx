import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { HeroSection } from "@/components/main/HeroSection";
import { FeaturesSection } from "@/components/main/FeaturesSection";
import { NoticeSection } from "@/components/NoticeSection.tsx";
import { Footer } from "@/components/common/Footer";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { WhySection } from "@/components/main/WhySection";
import { FloatingLogosCTA } from "@/components/main/FloatingLogosCTA";

const Index = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL state 확인
    if (location.state && (location.state as any).loginRequired) {
      setLoginOpen(true);
      navigate(location.pathname, { replace: true });
      return;
    }

    // URL 쿼리 파라미터 확인
    const params = new URLSearchParams(location.search);
    if (params.get('loginRequired') === 'true') {
      setLoginOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.search, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => setLoginOpen(true)} />
      <main className="pt-16">
        {/* <HeroSection /> */}
        <FloatingLogosCTA />
        <WhySection />
        <FeaturesSection />
        <NoticeSection />
      </main>
      <Footer />
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
};

export default Index;
