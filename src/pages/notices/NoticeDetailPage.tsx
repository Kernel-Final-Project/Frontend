import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { noticeService, type ApiNotice } from "@/services/noticeService";
import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    Clock3,
    Eye,
    Loader2,
    Paperclip,
    Pin,
    User,
} from "lucide-react";

export default function NoticeDetailPage() {
    const { noticeId } = useParams<{ noticeId: string }>();
    const navigate = useNavigate();
    const [notice, setNotice] = useState<ApiNotice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!noticeId) {
            setError("잘못된 접근입니다.");
            setLoading(false);
            return;
        }

        const fetchNotice = async () => {
            try {
                setLoading(true);
                const data = await noticeService.getNoticeById(noticeId);
                if (!data) throw new Error("공지 정보를 찾을 수 없습니다.");
                setNotice(data);
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

        fetchNotice();
    }, [noticeId]);

    const authorName = useMemo(() => {
        if (!notice) return "";
        return notice.authorName ?? notice.author?.name ?? notice.author?.username ?? `작성자 ${notice.authorId}`;
    }, [notice]);

    const categoryLabel = useMemo(() => {
        if (!notice) return "";
        return notice.announcementType === "GENERAL" ? "일반" : notice.announcementType;
    }, [notice]);

    const formatDateTime = (value?: string) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container pt-24 pb-12 space-y-6">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">공지사항</p>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">공지 상세</h1>
                            <p className="text-muted-foreground">서비스 이용에 필요한 안내를 확인하세요.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => navigate("/notices")}>
                                목록 보기
                            </Button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-14 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        불러오는 중입니다...
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>공지 불러오기 실패</AlertTitle>
                        <AlertDescription className="flex flex-col gap-3">
                            <span>{error}</span>
                            <Button variant="secondary" size="sm" onClick={() => navigate("/notices")}>
                                목록으로 이동
                            </Button>
                        </AlertDescription>
                    </Alert>
                ) : notice ? (
                    <section className="space-y-4" style={{ animationDelay: "0.05s" }}>
                        <Card className="card-shadow overflow-hidden">
                            <CardHeader className="space-y-4 bg-muted/40">
                                <div className="flex flex-wrap items-center gap-2">
                                    {notice.isImportant && (
                                        <Badge
                                            variant="secondary"
                                            className="gap-1 text-[11px] bg-primary/10 text-primary border-primary/40"
                                        >
                                            <Pin className="h-3.5 w-3.5" />
                                            중요
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-2xl leading-snug text-foreground">{notice.title}</CardTitle>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <User className="h-4 w-4" />
                                        {authorName}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="h-4 w-4" />
                                        작성일 {formatDateTime(notice.createdAt)}
                                    </span>
                                    {notice.updatedAt && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock3 className="h-4 w-4" />
                                            수정일 {formatDateTime(notice.updatedAt)}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Eye className="h-4 w-4" />
                                        조회 {notice.viewCount?.toLocaleString() ?? 0}
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="rounded-lg border border-border/60 bg-background/80 p-6 leading-relaxed text-foreground whitespace-pre-wrap">
                                    {notice.content || "내용이 없습니다."}
                                </div>

                                <Separator />

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Paperclip className="h-4 w-4" />
                                        첨부파일
                                    </div>
                                    {notice.noticeFile ? (
                                        <a
                                            href={notice.noticeFile.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={cn(
                                                "inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm transition-colors",
                                                "hover:border-primary/60 hover:text-primary",
                                            )}
                                        >
                                            <Paperclip className="h-4 w-4" />
                                            <span className="font-medium">
                                                {notice.noticeFile.originalName || notice.noticeFile.fileName}
                                            </span>
                                        </a>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">등록된 첨부파일이 없습니다.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                ) : null}
            </main>
        </div>
    );
}
