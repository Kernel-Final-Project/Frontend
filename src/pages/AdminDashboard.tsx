import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMainContent } from "@/components/admin/AdminMainContent";
import { AdminNavItem, AdminSection, UserFilterInfo, WorkflowFilterInfo } from "@/components/admin/types";
import { Home, ClipboardList, Settings2, Users, Workflow, FileText, BarChart3, BookOpen, Globe } from "lucide-react";

const adminNav: AdminNavItem[] = [
    { id: "dashboard", label: "대시보드", description: "전체 통계 요약", icon: Home },
    { id: "notice", label: "공지사항 관리", description: "공지 등록/수정/삭제", icon: ClipboardList },
    { id: "user", label: "사용자 관리", description: "권한/계정 관리", icon: Users },
    { id: "workflow", label: "워크플로우 관리", description: "전체 워크플로우 조회/관리", icon: Workflow },
    { id: "work", label: "워크 관리", description: "전체 워크 조회/관리", icon: FileText },
    { id: "site-request", label: "사이트 등록 요청", description: "사이트 등록 요청 조회/관리", icon: Globe },
    { id: "code", label: "공통 코드 관리", description: "카테고리 코드 관리", icon: Settings2 },
    { id: "stats", label: "사용자 통계", description: "가입/활성 사용자 추이", icon: BarChart3 },
    { id: "blog", label: "블로그 통계", description: "포스트 발행 추이", icon: BookOpen },
];

export default function AdminDashboard() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [userFilter, setUserFilter] = useState<UserFilterInfo | undefined>(undefined);
    const [workflowFilter, setWorkflowFilter] = useState<WorkflowFilterInfo | undefined>(undefined);

    // URL에서 탭 정보 읽기, 없으면 기본값 "notice"
    const section = (searchParams.get("tab") as AdminSection) || "notice";

    // 탭 변경 시 URL 업데이트
    const handleSectionChange = (newSection: AdminSection, newUserFilter?: UserFilterInfo, newWorkflowFilter?: WorkflowFilterInfo) => {
        setSearchParams({ tab: newSection });
        setUserFilter(newUserFilter);
        setWorkflowFilter(newWorkflowFilter);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <AdminSidebar items={adminNav} activeId={section} onSelect={(newSection) => {
                setSearchParams({ tab: newSection });
                setUserFilter(undefined);
                setWorkflowFilter(undefined);
            }} />

            {/* 메인 콘텐츠 - 사이드바 너비만큼 왼쪽 마진 */}
            <main className="ml-[200px] pt-14 min-h-screen">
                <div className="p-8">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">관리자 대시보드</h1>
                    <AdminMainContent
                        section={section}
                        onSectionChange={handleSectionChange}
                        userFilter={userFilter}
                        workflowFilter={workflowFilter}
                    />
                </div>
            </main>
        </div>
    );
}
