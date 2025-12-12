import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminNoticeForm, type NoticeFormValues } from "@/components/admin/AdminNoticeForm";
import { noticeService } from "@/services/noticeService";
import { toast } from "@/hooks/use-toast";

const NoticeCreatePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: NoticeFormValues) => {
    try {
      setSubmitting(true);
      const file = values.file && values.file.length > 0 ? values.file[0] : null;
      await noticeService.createNotice({
        title: values.title,
        content: values.content,
        announcementType: values.announcementType,
        isImportant: values.isImportant,
        file,
      });

      toast({
        title: "등록 완료",
        description: "새 공지가 등록되었습니다.",
      });
      navigate("/admin");
    } catch (err) {
      const msg =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "공지 등록에 실패했습니다.";
      toast({
        title: "등록 실패",
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
                신규
              </Badge>
              <h1 className="text-2xl font-bold text-foreground">공지 등록</h1>
            </div>
            <p className="text-muted-foreground">공지 제목, 내용, 분류, 중요 여부와 첨부파일을 입력해 등록하세요.</p>
          </div>

          <Card className="card-shadow">
            <CardHeader className="bg-muted/40">
              <CardTitle className="text-lg">공지 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AdminNoticeForm onSubmit={handleSubmit} submitting={submitting} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NoticeCreatePage;
