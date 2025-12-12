import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Content */}
      <div className="container relative z-10 pt-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-fade-up">
            Online
            <br />
            Commerce Promotion
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            비즈니스 혁신을 위한 첨단 기술 솔루션
          </p>
          <div className="mt-8 flex gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" className="px-8">
              시작하기
            </Button>
            <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              더 알아보기
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-foreground" />
          <span className="w-2 h-2 rounded-full bg-primary-foreground/40" />
          <span className="w-2 h-2 rounded-full bg-primary-foreground/40" />
        </div>
        <button className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
