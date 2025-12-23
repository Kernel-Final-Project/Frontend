import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import gmarketLogo from "@/assets/companies/gmarket.png";
import musinsaLogo from "@/assets/companies/musinsa.png";
import logo29cm from "@/assets/companies/29cm.png";
import oliveyoungLogo from "@/assets/companies/oliveyoung.png";
import ssadaguLogo from "@/assets/companies/싸다구.png";
import elevenLogo from "@/assets/companies/11번가.jpeg";
import ssgLogo from "@/assets/companies/SSG.jpeg";
import kreamLogo from "@/assets/companies/kream.png";

const companies = [
  { name: "G마켓", img: gmarketLogo, position: "top-[15%] left-[10%]", delay: "0s" },
  { name: "무신사", img: musinsaLogo, position: "top-[8%] right-[20%]", delay: "0.5s" },
  { name: "29CM", img: logo29cm, position: "top-[35%] left-[23%]", delay: "1s" },
  { name: "oliveyoung", img: oliveyoungLogo, position: "top-[60%] left-[12%]", delay: "1.5s" },
  { name: "싸다구", img: ssadaguLogo, position: "bottom-[5%] left-[28%]", delay: "0.3s" },
  { name: "11번가", img: elevenLogo, position: "top-[25%] right-[10%]", delay: "0.8s" },
  { name: "SSG", img: ssgLogo, position: "top-[55%] right-[18%]", delay: "1.2s" },
  { name: "KREAM", img: kreamLogo, position: "bottom-[10%] right-[30%]", delay: "0.7s" },
];

export function FloatingLogosCTA() {
  return (
    <section className="relative overflow-hidden bg-slate-100 px-4 pt-[calc(4rem+6rem)] pb-24 md:pt-[calc(4rem+8rem)] md:pb-32">
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {companies.map((company, index) => (
          <div
            key={index}
            className={`absolute ${company.position} animate-landing-float-icon`}
            style={{ animationDelay: company.delay }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200 transition-transform hover:scale-110 overflow-hidden">
              <img src={company.img} alt={company.name} className="object-contain p-2" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-4xl lg:text-5xl">
          당신의 워크, 어느 곳에서나
          <br />
          OCP가 함께합니다
        </h2>
        <p className="mb-10 text-base text-slate-600 md:text-lg">
          다양한 커머스와 블로그 채널에서 자동 발행을 경험하세요.
          <br className="hidden md:block" />
          한 번의 설정으로 자동 블로그 발행할 수 있습니다.
        </p>
        <Button
          size="lg"
          className="group bg-gradient-to-r from-primary to-primary-hover px-8 py-6 text-base font-semibold text-white shadow-lg shadow-primary/30"
          onClick={() => (window.location.href = "/workflows/add")}
        >
          워크플로우 등록하러가기
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3 md:hidden">
        {companies.map((company, index) => (
          <div key={index} className="flex h-12 w-20 items-center justify-center rounded-xl bg-white px-4 shadow-md overflow-hidden">
            <img src={company.img} alt={company.name} className="object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
}

