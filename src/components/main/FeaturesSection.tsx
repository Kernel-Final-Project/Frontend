import automationImg from "@/assets/automation.jpg";
import optimizationImg from "@/assets/optimization.jpg";
import efficiencyImg from "@/assets/efficiency.jpg";

const features = [
  {
    title: "Automation",
    titleKo: "자동화",
    description:
      "반복적인 작업을 자동화하여 업무 효율성을 높이고, 인적 오류를 줄여 비즈니스 프로세스를 최적화합니다.",
    image: automationImg,
    imagePosition: "left" as const,
  },
  {
    title: "Optimization",
    titleKo: "최적화",
    description:
      "데이터 기반 분석을 통해 비즈니스 프로세스를 최적화하고, 의사결정의 정확도를 높여 경쟁력을 강화합니다.",
    image: optimizationImg,
    imagePosition: "right" as const,
  },
  {
    title: "Efficiency",
    titleKo: "효율성",
    description:
      "스마트한 리소스 관리와 프로세스 개선을 통해 운영 비용을 절감하고 생산성을 극대화합니다.",
    image: efficiencyImg,
    imagePosition: "left" as const,
  },
];

export function FeaturesSection() {
  return (
    <section id="products" className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="space-y-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex flex-col gap-8 ${
                feature.imagePosition === "right"
                  ? "lg:flex-row-reverse"
                  : "lg:flex-row"
              } items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="overflow-hidden rounded-xl shadow-card">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 lg:px-8">
                <div className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {feature.title}{" "}
                    <span className="text-primary">{feature.titleKo}</span>
                  </h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
