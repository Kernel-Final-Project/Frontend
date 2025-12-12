import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminNoticeForm, type NoticeFormValues } from "@/components/admin/AdminNoticeForm";
import { noticeService } from "@/services/noticeService";
import { toast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";

const NoticeEditPage = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<NoticeFormValues | null>(null);

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
        setInitialValues({
          title: data.title,
          content: data.content,
          announcementType: data.announcementType ?? "GENERAL",
          isImportant: data.isImportant ?? false,
          file: undefined,
        });
        setError(null);
      } catch (err) {
        const msg =
          (err as any)?.response?.data?.message ||
          (err as Error)?.message ||
          "공지 정보를 불러오지 못했습니다.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId]);

  const handleSubmit = async (values: NoticeFormValues) => {
    if (!noticeId) return;

    try {
      setSubmitting(true);
      const file = values.file && values.file.length > 0 ? values.file[0] : null;
      await noticeService.updateNotice(noticeId, {
        title: values.title,
        content: values.content,
        announcementType: values.announcementType,
        isImportant: values.isImportant,
        file,
      });

      toast({
        title: "수정 완료",
        description: "공지 내용이 업데이트되었습니다.",
      });
      navigate("/admin");
    } catch (err) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "공지 수정에 실패했습니다.";
      toast({
        title: "수정 실패",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto w-full max-w-[960px] space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">관리자 · 공지사항</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                수정
              </Badge>
              <h1 className="text-2xl font-bold text-foreground">공지 수정</h1>
            </div>
            <p className="text-muted-foreground">기존 공지를 확인하고 필요한 내용을 수정하세요.</p>
          </div>

          <Card className="card-shadow">
            <CardHeader className="bg-muted/40">
              <CardTitle className="text-lg">공지 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  불러오는 중입니다...
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              ) : initialValues ? (
                <AdminNoticeForm
                  defaultValues={initialValues}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  submitLabel="수정하기"
                />
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NoticeEditPage;
