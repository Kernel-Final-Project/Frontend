import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-medium text-primary">
            Online Commerce Promotion
          </span>
          <h2 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            AI 기술과 자동화로 비즈니스 혁신을 이끕니다.
          </h2>
          <p className="mt-6 text-muted-foreground">
            지금 바로 OCP와 함께 디지털 트랜스포메이션을 시작하세요.
          </p>
          <Button size="lg" className="mt-8 px-10">
            문의하기
          </Button>
        </div>
      </div>
    </section>
  );
}
