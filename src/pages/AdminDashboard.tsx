import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { noticeService } from "@/services/noticeService";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNoticePanel } from "@/components/admin/AdminNoticePanel";
import { AdminPlaceholderPanel } from "@/components/admin/AdminPlaceholderPanel";
import { AdminNavItem, AdminSection, NoticeRow } from "@/components/admin/types";
import { ClipboardList, Settings2, Users } from "lucide-react";

const adminNav: AdminNavItem[] = [
    { id: "notice", label: "공지사항 관리", description: "공지 등록/수정/삭제", icon: ClipboardList },
    { id: "user", label: "사용자 관리", description: "권한/계정 관리", icon: Users },
    { id: "code", label: "공통 코드 관리", description: "카테고리 코드 관리", icon: Settings2 },
];

export default function AdminDashboard() {
    const [section, setSection] = useState<AdminSection>("notice");
    const [notices, setNotices] = useState<NoticeRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (section !== "notice") return;

        const fetchNotices = async () => {
            try {
                setLoading(true);
                const rows = await noticeService.getNotices();
                const mapped: NoticeRow[] = rows.map((n) => ({
                    id: n.noticeId,
                    title: n.title,
                    author: n.authorName ?? n.author?.name ?? n.author?.username ?? `작성자 ${n.authorId}`,
                    createdAt: n.createdAt.slice(0, 10),
                    important: n.isImportant,
                }));
                setNotices(mapped);
                setError(null);
            } catch (err) {
                const msg =
                    (err as any)?.response?.data?.message ||
                    (err as Error)?.message ||
                    "공지 불러오기에 실패했습니다.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, [section]);

    const orderedNotices = useMemo(() => {
        return [...notices].sort((a, b) => {
            if (a.important !== b.important) return Number(b.important) - Number(a.important);
            return b.createdAt.localeCompare(a.createdAt);
        });
    }, [notices]);

    const renderMain = () => {
        if (section === "notice") {
            return <AdminNoticePanel notices={orderedNotices} loading={loading} error={error} />;
        }
        if (section === "user") {
            return (
                <AdminPlaceholderPanel
                    title="사용자 관리"
                    icon={<Users className="h-4 w-4" />}
                    description="계정/권한을 관리할 예정입니다."
                />
            );
        }
        return (
            <AdminPlaceholderPanel
                title="공통 코드 관리"
                icon={<Settings2 className="h-4 w-4" />}
                description="카테고리 및 코드 관리 영역입니다."
            />
        );
    };

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
                            <div className="min-h-[560px]">{renderMain()}</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
