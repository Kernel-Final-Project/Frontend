import { useState } from "react";
import { Header } from "@/components/Header";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMainContent } from "@/components/admin/AdminMainContent";
import { AdminNavItem, AdminSection } from "@/components/admin/types";
import { ClipboardList, Settings2, Users } from "lucide-react";

const adminNav: AdminNavItem[] = [
    { id: "notice", label: "공지사항 관리", description: "공지 등록/수정/삭제", icon: ClipboardList },
    { id: "user", label: "사용자 관리", description: "권한/계정 관리", icon: Users },
    { id: "code", label: "공통 코드 관리", description: "카테고리 코드 관리", icon: Settings2 },
];

export default function AdminDashboard() {
    const [section, setSection] = useState<AdminSection>("notice");

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-10 xl:px-16">
                <div className="mx-auto w-full max-w-[1600px] space-y-6">
                    <div className="flex gap-4 lg:gap-6 xl:gap-8">
                        <AdminSidebar items={adminNav} activeId={section} onSelect={setSection} />

                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">관리자</p>
                                <h1 className="text-2xl font-bold text-foreground">관리자 대시보드</h1>
                            </div>
                            <div className="min-h-[560px]">
                                <AdminMainContent section={section} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
