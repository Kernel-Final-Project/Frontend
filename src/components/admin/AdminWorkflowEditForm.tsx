import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { workflowService, SiteInfo, RecurrenceRuleDto, WorkflowRequest, BlogType, Category } from '@/services/workflowService';
import { RecurrenceRuleForm } from '@/components/workflow/RecurrenceRuleForm';
import { validateRecurrenceRule } from '@/utils/recurrenceRuleHelper';
import naverBlogLogo from '/naverBlog_logo.png';
import tistoryLogo from '/tistory_logo.png';

type AdminWorkflowEditFormProps = {
  workflowId: number;
  onCancel: () => void;
  onSuccess: () => void;
};

export function AdminWorkflowEditForm({
  workflowId,
  onCancel,
  onSuccess,
}: AdminWorkflowEditFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [siteUrl, setSiteUrl] = useState("");
  const [blogId, setBlogId] = useState("");
  const [blogPassword, setBlogPassword] = useState("");
  const [blogUrl, setBlogUrl] = useState("");

  const [selectedBlogTypeId, setSelectedBlogTypeId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // 카테고리 계층 상태
  const [selectedFirstCategory, setSelectedFirstCategory] = useState<Category | null>(null);
  const [selectedSecondCategory, setSelectedSecondCategory] = useState<Category | null>(null);
  const [selectedThirdCategory, setSelectedThirdCategory] = useState<Category | null>(null);

  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRuleDto>({
    repeatType: "DAILY",
    repeatInterval: 1,
    timesOfDay: ["09:00"],
    startAt: new Date().toISOString(),
    endAt: null,
    daysOfWeek: null,
    daysOfMonth: null,
  });

  // 초기 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        const [sitesRes, blogRes, categoryRes, workflowRes] = await Promise.all([
          workflowService.getSiteInfo(),
          workflowService.getBlogTypes(),
          workflowService.getTrendCategory(),
          workflowService.getWorkflowByIdEdit(workflowId),
        ]);

        setSites(sitesRes.data);
        setBlogTypes(blogRes.data);
        setCategories(categoryRes.data);

        if (workflowRes.success) {
          const data = workflowRes.data;
          setSiteUrl(data.siteUrl);
          setBlogId(data.blogAccountId);
          setBlogUrl(data.blogUrl);
          setBlogPassword(""); // 보안상 빈 값
          setSelectedBlogTypeId(data.blogTypeId);

          // 카테고리 세팅
          const depth3Id = data.setTrendCategory.depth3Category ?? data.setTrendCategory.depth2Category ?? data.setTrendCategory.depth1Category;
          if (depth3Id) {
            const { first, second, third } = findCategory(depth3Id, categoryRes.data);
            setSelectedFirstCategory(first);
            setSelectedSecondCategory(second);
            setSelectedThirdCategory(third);
            setSelectedCategoryId(third?.categoryId || second?.categoryId || first?.categoryId || null);
          }

          // 반복 규칙 적용
          setRecurrenceRule({ ...data.recurrenceRule });
        }
      } catch (error) {
        toast({ title: "오류", description: "워크플로우 정보를 불러오지 못했습니다.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [workflowId]);

  const findCategory = (categoryId: number, cats: Category[]): { first: Category | null, second: Category | null, third: Category | null } => {
    for (const first of cats) {
      if (first.categoryId === categoryId) return { first, second: null, third: null };

      if (first.children) {
        for (const second of first.children) {
          if (second.categoryId === categoryId) return { first, second, third: null };

          if (second.children) {
            for (const third of second.children) {
              if (third.categoryId === categoryId) return { first, second, third };
            }
          }
        }
      }
    }
    return { first: null, second: null, third: null };
  };

  // 카테고리 변경 핸들러
  const handleFirstCategoryChange = (categoryId: string) => {
    const selected = categories.find(c => c.categoryId === Number(categoryId)) || null;
    setSelectedFirstCategory(selected);
    setSelectedSecondCategory(null);
    setSelectedThirdCategory(null);
    setSelectedCategoryId(selected?.categoryId || null);
  };

  const handleSecondCategoryChange = (categoryId: string) => {
    const selected = selectedFirstCategory?.children?.find(c => c.categoryId === Number(categoryId)) || null;
    setSelectedSecondCategory(selected);
    setSelectedThirdCategory(null);
    setSelectedCategoryId(selected?.categoryId || null);
  };

  const handleThirdCategoryChange = (categoryId: string) => {
    const selected = selectedSecondCategory?.children?.find(c => c.categoryId === Number(categoryId)) || null;
    setSelectedThirdCategory(selected);
    setSelectedCategoryId(selected?.categoryId || null);
  };

  const handleSubmit = async () => {
    if (!siteUrl || !selectedCategoryId || !selectedBlogTypeId || !blogId || !blogUrl) {
      return toast({ title: "입력 오류", description: "필수 필드를 모두 입력해주세요.", variant: "destructive" });
    }

    const ruleError = validateRecurrenceRule(recurrenceRule);
    if (ruleError) {
      return toast({ title: "반복 규칙 오류", description: ruleError, variant: "destructive" });
    }

    const selectedBlogType = blogTypes.find(bt => bt.blogTypeId === selectedBlogTypeId);

    const req: WorkflowRequest = {
      siteUrl,
      blogTypeId: selectedBlogTypeId,
      blogTypeName: selectedBlogType?.blogTypeName ?? '',
      blogUrl,
      categoryId: selectedCategoryId,
      blogAccountId: blogId,
      blogAccountPwd: blogPassword || undefined as any, // 비밀번호 변경하지 않으면 빈 문자열
      recurrenceRule,
    };

    try {
      setIsSaving(true);
      const response = await workflowService.updateWorkflow(workflowId, req);

      if (response.success) {
        toast({ title: "수정 완료", description: "워크플로우가 수정되었습니다." });
        onSuccess();
      } else {
        toast({ title: "수정 실패", description: response.message || "워크플로우 수정에 실패했습니다.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "오류", description: "저장 실패", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="card-shadow">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-shadow">
      {/* <CardHeader className="bg-muted/40">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-xl">워크플로우 수정</CardTitle>
        </div>
      </CardHeader> */}
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* URL Section */}
          <div>
            <Label className="mb-2 block">사이트 선택</Label>
            <Select value={siteUrl} onValueChange={setSiteUrl}>
              <SelectTrigger>
                <SelectValue placeholder="사이트를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.siteUrl} value={site.siteUrl}>
                    {site.siteName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recurrence Rule Section */}
          <div>
            <Label className="mb-2 block">반복 규칙 설정</Label>
            <RecurrenceRuleForm
              value={recurrenceRule}
              onChange={setRecurrenceRule}
            />
          </div>

          {/* Category Selection Section */}
          <div>
            <Label className="mb-2 block">상품 선택 기준</Label>
            <div className="grid grid-cols-3 gap-4">
              {/* 1차 카테고리 */}
              <Select
                value={selectedFirstCategory?.categoryId.toString() || ""}
                onValueChange={handleFirstCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="1차 카테고리" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => {
                    const hasChildren = cat.children && cat.children.length > 0;
                    if (!hasChildren) return false;
                    const isChildOfAnother = categories.some(parent =>
                      parent.children?.some(child => child.categoryId === cat.categoryId)
                    );
                    return !isChildOfAnother;
                  }).map((cat) => (
                    <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 2차 카테고리 */}
              <Select
                value={selectedSecondCategory?.categoryId.toString() || ""}
                onValueChange={handleSecondCategoryChange}
                disabled={!selectedFirstCategory || !selectedFirstCategory.children?.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder="2차 카테고리" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedFirstCategory?.children || []).map((cat) => (
                    <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 3차 카테고리 */}
              <Select
                value={selectedThirdCategory?.categoryId.toString() || ""}
                onValueChange={handleThirdCategoryChange}
                disabled={!selectedSecondCategory || !selectedSecondCategory.children?.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder="3차 카테고리" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedSecondCategory?.children || []).map((cat) => (
                    <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Blog Selection Section */}
          <div>
            <Label className="mb-2 block">블로그 선택</Label>
            <div className="grid grid-cols-2 gap-3">
              {blogTypes.map((type) => {
                const getBlogLogo = (typeName: string | undefined) => {
                  if (!typeName) return null;
                  const lowerName = typeName.toLowerCase();
                  if (typeName.includes('네이버 블로그') || lowerName.includes('naver')) {
                    return naverBlogLogo;
                  }
                  if (typeName.includes('티스토리') || lowerName.includes('tistory')) {
                    return tistoryLogo;
                  }
                  return null;
                };

                const logo = getBlogLogo(type.blogTypeName);

                return (
                  <Button
                    key={type.blogTypeId}
                    variant="outline"
                    onClick={() => setSelectedBlogTypeId(type.blogTypeId)}
                    className={`flex items-center justify-center h-auto ${selectedBlogTypeId === type.blogTypeId
                      ? "border-primary border-2"
                      : ""
                      }`}
                  >
                    {logo && (
                      <img
                        src={logo}
                        alt={`${type.blogTypeName} 로고`}
                        className="w-24 h-12 object-contain"
                      />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Account Input Section */}
          <div className="space-y-4">
            <Label>계정 정보</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="blogId" className="text-sm">아이디</Label>
                <Input
                  id="blogId"
                  placeholder="블로그 ID를 입력하세요"
                  value={blogId}
                  onChange={(e) => setBlogId(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="blogPassword" className="text-sm">비밀번호</Label>
                <Input
                  id="blogPassword"
                  type="password"
                  placeholder="변경하려면 입력하세요"
                  value={blogPassword}
                  onChange={(e) => setBlogPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  비밀번호를 변경하지 않으려면 비워두세요
                </p>
              </div>
              <div>
                <Label htmlFor="blogUrl" className="text-sm">블로그 URL</Label>
                <Input
                  id="blogUrl"
                  placeholder="블로그 URL을 입력하세요"
                  value={blogUrl}
                  onChange={(e) => setBlogUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              저장
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
