import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/common/Header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, Paperclip, Pin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { noticeService } from "@/services/noticeService";

type Notice = {
    noticeId: number;
    title: string;
    category: string;
    date: string;
    owner: string;
    pinned: boolean;
    views: number;
    attachmentName?: string;
    attachmentUrl?: string;
};

export default function NoticeListPage() {
    const [query, setQuery] = useState("");
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const rows = await noticeService.getNotices();
                const mapped: Notice[] = rows.map((n) => ({
                    noticeId: n.noticeId,
                    title: n.title,
                    category: n.announcementType === "GENERAL" ? "일반" : n.announcementType,
                    date: n.createdAt.slice(0, 10),
                    owner: n.authorName ?? n.author?.name ?? n.author?.username ?? `작성자 ${n.authorId}`,
                    pinned: n.isImportant,
                    views: n.viewCount ?? 0,
                    attachmentName: n.noticeFile?.originalName ?? undefined,
                    attachmentUrl: n.noticeFile?.fileUrl ?? undefined,
                }));
                setNotices(mapped);
                setError(null);
            } catch (err) {
                const msg =
                    (err as any)?.response?.data?.message ||
                    (err as Error)?.message ||
                    "알 수 없는 오류";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return notices;
        return notices.filter((notice) => {
            return (
                notice.title.toLowerCase().includes(q) ||
                notice.category.toLowerCase().includes(q) ||
                notice.owner.toLowerCase().includes(q)
            );
        });
    }, [notices, query]);

    const ordered = useMemo(() => {
        return [...filtered].sort((a, b) => {
            if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned);
            return b.date.localeCompare(a.date);
        });
    }, [filtered]);

    const pinnedCount = useMemo(() => notices.filter((notice) => notice.pinned).length, [notices]);

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container pt-24 pb-12 space-y-8">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">공지사항</p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">공지사항 목록</h1>
                            <p className="text-muted-foreground">서비스 업데이트와 안내를 한곳에서 확인하세요.</p>
                        </div>
                    </div>
                </div>

                <section
                    className="rounded-xl border border-border bg-card card-shadow p-4 space-y-4"
                    style={{ animationDelay: "0.05s" }}
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="제목, 카테고리, 작성자 검색"
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>전체 {notices.length}건</span>
                            <span className="hidden h-4 w-px bg-border sm:inline-block" />
                            <span className="flex items-center gap-1">
                                <Pin className="h-4 w-4" />
                                중요 {pinnedCount}건
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            불러오는 중입니다...
                        </div>
                    ) : error ? (
                        <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <span>공지 불러오기 실패: {error}</span>
                        </div>
                    ) : ordered.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border bg-background/60 py-10 text-center text-muted-foreground">
                            조건에 맞는 공지가 없습니다.
                        </div>
                    ) : (
                        <div className="rounded-lg border border-border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                                        <TableHead className="w-16 font-semibold text-foreground text-center">No</TableHead>
                                        <TableHead className="font-semibold text-foreground text-center">제목</TableHead>
                                        <TableHead className="w-28 font-semibold text-foreground text-center">분류</TableHead>
                                        <TableHead className="w-28 font-semibold text-foreground text-center">작성자</TableHead>
                                        <TableHead className="w-28 font-semibold text-foreground text-center">작성일</TableHead>
                                        <TableHead className="w-20 font-semibold text-foreground text-center">조회</TableHead>
                                        <TableHead className="w-32 font-semibold text-foreground text-center">첨부파일</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ordered.map((notice, index) => (
                                        <TableRow
                                            key={notice.noticeId}
                                            className={cn(
                                                "transition-colors hover:bg-muted/50",
                                                notice.pinned ? "bg-primary/5" : undefined,
                                            )}
                                            style={{ animationDelay: `${index * 0.04}s` }}
                                        >
                                            <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                                            <TableCell className="text-left">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {notice.pinned && (
                                                            <Badge variant="secondary" className="gap-1 text-[11px] bg-primary/10 text-primary border-primary/40">
                                                                <Pin className="h-3.5 w-3.5" />
                                                                중요
                                                            </Badge>
                                                        )}
                                                        <Link
                                                            to={`/notices/${notice.noticeId}`}
                                                            className="font-semibold text-foreground hover:text-primary"
                                                        >
                                                            {notice.title}
                                                        </Link>
                                                    </div>

                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">{notice.category}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center text-muted-foreground">{notice.owner}</TableCell>
                                            <TableCell className="text-center text-muted-foreground">{notice.date}</TableCell>
                                            <TableCell className="text-center font-medium">
                                                {notice.views.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {notice.attachmentName ? (
                                                    <a
                                                        href={notice.attachmentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                                    >
                                                        <Paperclip className="h-4 w-4" />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">없음</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
