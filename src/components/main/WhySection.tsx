import { CheckCircle2 } from "lucide-react";

export function WhySection() {
  return (
    <section className="container px-4 md:px-8 mt-24">
      <div className="rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-100 via-white to-sky-50 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">WHY OCP</p>
            <h2 className="text-3xl font-semibold mb-4 text-slate-900">상품 선택부터 콘텐츠 생성을 자동화</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              반복적인 블로그 작업을 줄이고 전략과 크리에이티브에 집중하세요. OCP는 워크플로우로부터 최적의 루틴을 자동화해 일관되고 예측 가능한 결과를 제공합니다.
            </p>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                맞춤형 워크플로우 템플릿
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                API 및 외부 시스템 연동
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                관리자용 실시간 로그 추적
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">워크 등록</p>
                <p className="text-sm text-slate-600">블로그 계정과 발행 루틴을 설정하세요.</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">자동 실행</p>
                <p className="text-sm text-slate-600">설정한 주기에 맞춰 모든 단계가 자동으로 진행됩니다.</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">대시보드 모니터링</p>
                <p className="text-sm text-slate-600">실시간 로그와 통계로 결과를 확인하고 관리하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

