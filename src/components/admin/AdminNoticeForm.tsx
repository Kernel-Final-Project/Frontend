import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const noticeSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  announcementType: z.string().min(1, "분류를 선택해주세요."),
  isImportant: z.boolean().default(false),
  file: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files[0] instanceof File;
      },
      { message: "유효한 파일이 아닙니다." },
    ),
});

export type NoticeFormValues = z.infer<typeof noticeSchema>;

type AdminNoticeFormProps = {
  defaultValues?: Partial<NoticeFormValues>;
  onSubmit: (values: NoticeFormValues) => Promise<void> | void;
  submitting?: boolean;
  submitLabel?: string;
};

export function AdminNoticeForm({ defaultValues, onSubmit, submitting, submitLabel }: AdminNoticeFormProps) {
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
      announcementType: defaultValues?.announcementType ?? "GENERAL",
      isImportant: defaultValues?.isImportant ?? false,
      file: undefined,
    },
  });

  const typeOptions = useMemo(
    () => [
      { value: "GENERAL", label: "일반" },
      { value: "UPDATE", label: "업데이트" },
      { value: "EVENT", label: "이벤트" },
    ],
    [],
  );

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="공지 제목을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="announcementType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>분류</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="분류를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isImportant"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                <div className="space-y-1">
                  <FormLabel>중요 공지</FormLabel>
                  <p className="text-sm text-muted-foreground">중요 공지는 목록 상단에 고정됩니다.</p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>내용</FormLabel>
              <FormControl>
                <Textarea rows={10} placeholder="공지 내용을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>첨부파일 (선택)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "저장 중..." : submitLabel ?? "등록하기"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
