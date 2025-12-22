import { Zap, TrendingUp, Sparkles } from "lucide-react";
import automationIcon from '@/assets/automation-icon.png';
import optimizationIcon from '@/assets/optimization-icon.png';
import efficiencyIcon from '@/assets/efficiency-icon.png';

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Automation",
    subtitle: "자동화",
    description: "반복적인 작업을 자동화하여 업무 생산성을 높이고, 인적 오류를 줄여 비즈니스 프로세스를 최적화합니다.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Optimization",
    subtitle: "최적화",
    description: "데이터 기반 실시간 분석 비즈니스 프로세스를 최적화하고, 의사결정의 정확도를 높여 경쟁력을 강화합니다.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Efficiency",
    subtitle: "효율성",
    description: "스마트한 워크플로 관리와 프로세스 개선을 통해 운영 비용을 절감하고 성과를 극대화 합니다.",
    color: "from-green-500 to-emerald-500"
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
              className="group relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* 배경 그라데이션 효과 */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>

              {/* 아이콘 컨테이너 */}
              <div className={`relative w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <div className="text-white scale-75">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3 relative">
                {feature.title}{' '}
                <span className="text-blue-600">{feature.subtitle}</span>
              </h3>

              <p className="text-gray-600 leading-relaxed relative">
                {feature.description}
              </p>

              {/* 하단 액센트 라인 */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} w-0 group-hover:w-full transition-all duration-500`}></div>
            </div>
          ))}
        </div>
      </div>
    </section >
  );
}