import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { siteRequestService } from "@/services/siteRequestService";

type SiteRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SiteRequestDialog({ open, onOpenChange }: SiteRequestDialogProps) {
  const [siteUrl, setSiteUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSiteUrl("");
    setSiteName("");
    setDescription("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!siteUrl.trim() || !siteName.trim() || !description.trim()) {
      toast({
        title: "입력 필요",
        description: "사이트 주소, 이름, 설명을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await siteRequestService.submitRequest({
        siteUrl: siteUrl.trim(),
        siteName: siteName.trim(),
        description: description.trim(),
      });

      if (response.success) {
        toast({
          title: "요청 완료",
          description: "사이트 등록 요청이 접수되었습니다.",
        });
        resetForm();
        onOpenChange(false);
      } else {
        toast({
          title: "요청 실패",
          description: response.message || "사이트 등록 요청 중 문제가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("사이트 등록 요청 실패:", error);
      toast({
        title: "오류",
        description: "사이트 등록 요청 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>사이트 등록 요청</DialogTitle>
          <DialogDescription>등록을 원하는 사이트 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteUrl">사이트 주소</Label>
            <Input
              id="siteUrl"
              placeholder="https://example.com"
              value={siteUrl}
              onChange={(event) => setSiteUrl(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteName">사이트 이름</Label>
            <Input
              id="siteName"
              placeholder="사이트 이름을 입력하세요"
              value={siteName}
              onChange={(event) => setSiteName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">설명</Label>
            <Textarea
              id="siteDescription"
              placeholder="사이트 등록이 필요한 이유를 작성해주세요."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "요청 중..." : "등록 요청 보내기"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
