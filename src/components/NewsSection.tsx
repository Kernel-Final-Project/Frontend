import { ArrowRight } from "lucide-react";

const newsItems = [
  {
    id: 1,
    category: "공지사항",
    title: "OCP 솔루션 v2.0 업데이트 안내",
    date: "2024.12.01",
    excerpt: "새로운 기능과 개선된 성능으로 더욱 강력해진 OCP 솔루션을 만나보세요.",
  },
  {
    id: 2,
    category: "보도자료",
    title: "OCP, 글로벌 AI 혁신 어워드 수상",
    date: "2024.11.25",
    excerpt: "OCP가 혁신적인 AI 솔루션으로 글로벌 어워드를 수상했습니다.",
  },
  {
    id: 3,
    category: "이벤트",
    title: "2024 디지털 혁신 컨퍼런스 개최",
    date: "2024.11.15",
    excerpt: "OCP가 주최하는 디지털 혁신 컨퍼런스에 참여해보세요.",
  },
];

export function NewsSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Our Latest News
          </h2>
          <p className="mt-3 text-muted-foreground">
            OCP의 새로운 소식과 업데이트를 확인하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <article
              key={item.id}
              className="group bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {item.category}
                </span>
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {item.excerpt}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                자세히 보기
                <ArrowRight className="w-4 h-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
