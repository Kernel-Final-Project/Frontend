import { Header } from "@/components/common/Header";
import { HeroSection } from "@/components/main/HeroSection";
import { FeaturesSection } from "@/components/main/FeaturesSection";
import { CTASection } from "@/components/main/CTASection";
import { NewsSection } from "@/components/NewsSection";
import { Footer } from "@/components/common/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
