import { Zap, TrendingUp, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Automation",
    subtitle: "자동화",
    description: "반복적인 작업을 자동화하여 업무 생산성을 높이고, 인적 오류를 줄여 비즈니스 프로세스를 최적화합니다.",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Optimization",
    subtitle: "최적화",
    description: "데이터 기반 실시간 분석 비즈니스 프로세스를 최적화하고, 의사결정의 정확도를 높여 경쟁력을 강화합니다.",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Efficiency",
    subtitle: "효율성",
    description: "스마트한 워크플로 관리와 프로세스 개선을 통해 운영 비용을 절감하고 성과를 극대화 합니다.",
    color: "from-green-400 to-emerald-400"
  }
];

export function FeaturesSection() {
  return (
      <section className="py-20 lg:py-28 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="group relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {feature.title}{' '}
                    <span className="text-blue-600">{feature.subtitle}</span>
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`}></div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}