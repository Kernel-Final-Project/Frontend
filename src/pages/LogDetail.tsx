import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LogAccordion } from "@/components/LogAccordion";

const mockLogData = [
  {
    id: 1,
    title: "쇼핑몰 HTML 추출 결과",
    status: "success" as const,
    log: `[2025-11-19 08:00:01] 쇼핑몰 페이지 접속 시작...
[2025-11-19 08:00:02] HTML 문서 다운로드 중...
[2025-11-19 08:00:03] HTML 파싱 완료
[2025-11-19 08:00:03] 상품 목록 추출 완료 (총 24개 상품)`,
    result: "성공적으로 24개의 상품 정보를 추출했습니다.",
  },
  {
    id: 2,
    title: "트렌드 크롤링 결과",
    status: "success" as const,
    log: `[2025-11-19 08:00:04] 구글 트렌드 API 호출 시작...
[2025-11-19 08:00:05] 키워드 분석 중...
[2025-11-19 08:00:06] 트렌드 데이터 수집 완료`,
    result: "상위 10개 트렌드 키워드를 성공적으로 수집했습니다.",
  },
  {
    id: 3,
    title: "크롤링 코드 생성 결과",
    status: "success" as const,
    log: `[2025-11-19 08:00:07] AI 코드 생성 모델 초기화...
[2025-11-19 08:00:10] 크롤링 스크립트 생성 중...
[2025-11-19 08:00:15] 코드 검증 완료`,
    result: "크롤링 코드가 성공적으로 생성되었습니다.",
  },
  {
    id: 4,
    title: "크롤링 코드 실행 결과",
    status: "success" as const,
    log: `[2025-11-19 08:00:16] 크롤링 코드 실행 시작...
[2025-11-19 08:00:20] 데이터 수집 중...
[2025-11-19 08:00:25] 실행 완료`,
    result: "크롤링이 성공적으로 완료되었습니다.",
  },
  {
    id: 5,
    title: "상품 선택 결과",
    status: "success" as const,
    log: `[2025-11-19 08:00:26] 상품 필터링 시작...
[2025-11-19 08:00:27] 조건에 맞는 상품 선택 중...
[2025-11-19 08:00:28] 상품 선택 완료`,
    result: "5개의 상품이 선택되었습니다.",
  },
  {
    id: 6,
    title: "콘텐츠 생성 결과",
    status: "progress" as const,
    log: `[2025-11-19 08:00:29] AI 콘텐츠 생성 시작...
[2025-11-19 08:00:35] 블로그 포스트 작성 중...
[2025-11-19 08:00:40] 이미지 생성 중...`,
    result: "콘텐츠 생성 진행 중입니다...",
  },
  {
    id: 7,
    title: "콘텐츠 업로드 결과",
    status: "pending" as const,
    log: `대기 중...`,
    result: "이전 단계 완료 후 실행됩니다.",
  },
];

export default function LogDetail() {
  const navigate = useNavigate();
  const { workId, logId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/work/${workId}`)}
          className="mb-6 hover:bg-muted"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            워크 관리 (상세 로그)
          </h1>

          <div className="space-y-3">
            {mockLogData.map((item) => (
              <LogAccordion
                key={item.id}
                id={item.id}
                title={item.title}
                status={item.status}
                log={item.log}
                result={item.result}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
