import { useState } from "react";
import { Header } from "@/components/Header";
import { WorkflowTable } from "@/components/WorkflowTable";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const mockWorkflows = [
  { id: 1, url: "http://ssadagu.com", blog: "네이버", criteria: "구글 트렌드", blogId: "user", status: "활성" as const },
  { id: 2, url: "http://ssadagu.com", blog: "티스토리", criteria: "구글 트렌드", blogId: "user", status: "활성" as const },
  { id: 3, url: "http://ssadagu.com", blog: "쓰레드", criteria: "구글 트렌드", blogId: "user", status: "활성" as const },
  { id: 4, url: "http://example.com", blog: "네이버", criteria: "네이버 트렌드", blogId: "admin", status: "비활성" as const },
  { id: 5, url: "http://test.com", blog: "티스토리", criteria: "구글 트렌드", blogId: "user", status: "활성" as const },
];

const Workflows = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const handleSchedule = (id: number) => {
    toast({
      title: "일정 관리",
      description: `워크플로우 ${id}번의 일정 관리 페이지로 이동합니다.`,
    });
  };

  const handleEdit = (id: number) => {
    toast({
      title: "수정",
      description: `워크플로우 ${id}번을 수정합니다.`,
    });
  };

  const handleDelete = (id: number) => {
    toast({
      title: "삭제",
      description: `워크플로우 ${id}번을 삭제합니다.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-24 pb-12">
        {/* Page Title */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-2xl font-bold text-foreground">워크 플로우 관리</h1>
          <p className="mt-1 text-muted-foreground">등록된 워크플로우를 관리하세요</p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            등록
          </Button>
        </div>

        {/* Table */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <WorkflowTable
            workflows={mockWorkflows}
            onSchedule={handleSchedule}
            onEdit={handleEdit}
            onDelete={handleDelete}
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

export default Workflows;
