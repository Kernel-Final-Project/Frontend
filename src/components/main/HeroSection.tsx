import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "@/assets/main-side-img1.png";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-br from-primary/10 via-background to-background">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Overlay */}
      <div className="absolute " />

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
          <div className="mt-60 animate-fade-up">
          </div>
        </div>
      </div>

    </section>
  );
}
