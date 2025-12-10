import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { WorkInfoCard } from "@/components/WorkInfoCard";
import { BlogLinkTable } from "@/components/BlogLinkTable";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - 실제로는 API에서 가져올 데이터
const mockWorkflowInfo = {
  id: 4,
  url: "http://ssadagu.com",
  blog: "오씨픽",
  criteria: "구글 트렌드",
  postCount: 24,
};

const mockBlogLinks = [
  { id: 4, blogLink: "http://ohseepick/user1/21", product: "청소기", executionTime: "2025.11.19 08:00", status: "성공" as const },
  { id: 5, blogLink: "http://ohseepick/user1/22", product: "선풍기", executionTime: "2025.11.19 08:01", status: "성공" as const },
  { id: 6, blogLink: "http://ohseepick/user1/23", product: "냉장고", executionTime: "2025.11.19 08:01", status: "진행중" as const },
  { id: 7, blogLink: "-", product: "냉장고", executionTime: "2025.11.19 08:01", status: "실패" as const },
  { id: 8, blogLink: "http://ohseepick/user1/24", product: "에어컨", executionTime: "2025.11.19 08:02", status: "성공" as const },
];

const WorkManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const handleLogDetail = (linkId: number) => {
    toast({
      title: "로그 관리",
      description: `블로그 링크 ${linkId}번의 로그를 확인합니다.`,
    });
  };

  const handleStatsDetail = (linkId: number) => {
    toast({
      title: "통계 관리",
      description: `블로그 링크 ${linkId}번의 통계를 확인합니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-24 pb-12">
        {/* Page Title */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-2xl font-bold text-foreground">워크 관리</h1>
        </div>

        {/* Back Button */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/workflows")}
            className="h-10 w-10 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Workflow Info Card */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <WorkInfoCard workflow={mockWorkflowInfo} />
        </div>

        {/* Blog Links Table */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <BlogLinkTable
            blogLinks={mockBlogLinks}
            onLogDetail={handleLogDetail}
            onStatsDetail={handleStatsDetail}
          />
        </div>

        {/* Pagination */}
        <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
};

export default WorkManagement;
