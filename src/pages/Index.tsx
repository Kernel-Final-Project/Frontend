import { Header } from "@/components/common/Header";
import { HeroSection } from "@/components/main/HeroSection";
import { FeaturesSection } from "@/components/main/FeaturesSection";
import { NoticeSection } from "@/components/NoticeSection.tsx";
import { Footer } from "@/components/common/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <NoticeSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
