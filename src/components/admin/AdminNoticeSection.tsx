import { useEffect, useMemo, useState } from "react";
import { noticeService } from "@/services/noticeService";
import { AdminNoticePanel } from "./AdminNoticePanel";
import { NoticeRow } from "./types";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type AdminNoticeSectionProps = {
  active: boolean;
};

export function AdminNoticeSection({ active }: AdminNoticeSectionProps) {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<NoticeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const fetchNotices = async () => {
      try {
        setLoading(true);
        const rows = await noticeService.getNotices();
        const mapped: NoticeRow[] = rows.map((n) => ({
          id: n.noticeId,
          title: n.title,
          author:
            n.userName ??
            n.authorName ??
            n.author?.name ??
            n.author?.username ??
            "작성자 미확인",
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
  }, [active]);

  const orderedNotices = useMemo(() => {
    return [...notices].sort((a, b) => {
      if (a.important !== b.important) return Number(b.important) - Number(a.important);
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [notices]);

  const handleCreate = () => {
    navigate("/admin/notices/new");
  };

  const handleEdit = (id: number) => {
    toast({
      title: "공지 수정",
      description: `공지 ${id} 수정 기능은 준비 중입니다.`,
    });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("정말 이 공지를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await noticeService.deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
      toast({
        title: "삭제 완료",
        description: `공지 ${id}가 삭제되었습니다.`,
      });
    } catch (err) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "공지 삭제에 실패했습니다.";
      toast({
        title: "삭제 실패",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminNoticePanel
      notices={orderedNotices}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      deletingId={deletingId}
    />
  );
}
