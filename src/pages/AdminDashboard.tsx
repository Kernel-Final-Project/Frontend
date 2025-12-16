import { useState } from "react";
import { Header } from "@/components/common/Header";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMainContent } from "@/components/admin/AdminMainContent";
import { AdminNavItem, AdminSection, UserFilterInfo, WorkflowFilterInfo } from "@/components/admin/types";
import { ClipboardList, Settings2, Users, Workflow, FileText, BarChart3 } from "lucide-react";

const adminNav: AdminNavItem[] = [
    { id: "notice", label: "공지사항 관리", description: "공지 등록/수정/삭제", icon: ClipboardList },
    { id: "user", label: "사용자 관리", description: "권한/계정 관리", icon: Users },
    { id: "workflow", label: "워크플로우 관리", description: "전체 워크플로우 조회/관리", icon: Workflow },
    { id: "work", label: "워크 관리", description: "전체 워크 조회/관리", icon: FileText },
    { id: "code", label: "공통 코드 관리", description: "카테고리 코드 관리", icon: Settings2 },
    { id: "stats", label: "사용자 통계", description: "가입/활성 사용자 추이", icon: BarChart3 },
];

export default function AdminDashboard() {
    const [section, setSection] = useState<AdminSection>("notice");
    const [userFilter, setUserFilter] = useState<UserFilterInfo | undefined>(undefined);
    const [workflowFilter, setWorkflowFilter] = useState<WorkflowFilterInfo | undefined>(undefined);

    const handleSectionChange = (newSection: AdminSection, newUserFilter?: UserFilterInfo, newWorkflowFilter?: WorkflowFilterInfo) => {
        setSection(newSection);
        setUserFilter(newUserFilter);
        setWorkflowFilter(newWorkflowFilter);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-10 xl:px-16">
                <div className="mx-auto w-full max-w-[1600px] space-y-6">
                    <div className="flex gap-4 lg:gap-6 xl:gap-8">
                        <AdminSidebar items={adminNav} activeId={section} onSelect={(newSection) => {
                            setSection(newSection);
                            setUserFilter(undefined); // 메뉴 클릭 시 필터 초기화
                            setWorkflowFilter(undefined); // 메뉴 클릭 시 워크플로우 필터 초기화
                        }} />

                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">관리자</p>
                                <h1 className="text-2xl font-bold text-foreground">관리자 대시보드</h1>
                            </div>
                            <div className="min-h-[560px]">
                                <AdminMainContent
                                    section={section}
                                    onSectionChange={handleSectionChange}
                                    userFilter={userFilter}
                                    workflowFilter={workflowFilter}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
