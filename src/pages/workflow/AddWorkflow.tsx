import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { workflowService, SiteInfo, RecurrenceRuleDto, WorkflowRequest, BlogType, Category } from '@/services/workflowService';
import { RecurrenceRuleForm } from '@/components/workflow/RecurrenceRuleForm';
import { validateRecurrenceRule } from '@/utils/recurrenceRuleHelper';
import naverBlogLogo from '/naverBlog_logo.png';
import tistoryLogo from '/tistory_logo.png';

const AddWorkflow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const workflowId = id ? Number(id) : null;

  const [isLoading, setIsLoading] = useState(false);
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

  const [workflowData, setWorkflowData] = useState<any>(null); // 수정 모드 위한 저장

  useEffect(() => {
    (async () => {
      const sitesRes = await workflowService.getSiteInfo();
      setSites(sitesRes.data);

      const blogRes = await workflowService.getBlogTypes();
      setBlogTypes(blogRes.data);

      const categoryRes = await workflowService.getTrendCategory();
      setCategories(categoryRes.data);
    })();
  }, []);

  // 수정 모드 - 워크플로우 정보 불러오기
  useEffect(() => {
    if (isEditMode && workflowId) {
      (async () => {
        try {
          const response = await workflowService.getWorkflowById(workflowId);
          if (response.success) {
            setWorkflowData(response.data);
          }
        } catch {
          toast({ title: "오류", description: "워크플로우 정보를 불러오지 못했습니다.", variant: "destructive" });
        }
      })();
    }
  }, [isEditMode, workflowId]);

  const findCategory = (categoryId: number): { first: Category | null, second: Category | null, third: Category | null } => {
    for (const first of categories) {
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


  useEffect(() => {
    if (!workflowData || categories.length === 0) return;

    setSiteUrl(workflowData.siteUrl);
    setBlogId(workflowData.blogAccountId);
    setBlogUrl(workflowData.blogUrl);
    setBlogPassword(""); // 비밀번호는 보안상 제공 X
    setSelectedBlogTypeId(workflowData.blogTypeId);

    // 카테고리 세팅 (depth3Category가 가장 깊은 ID)
    const depth3Id = workflowData.setTrendCategory.depth3Category ?? workflowData.setTrendCategory.depth2Category ?? workflowData.setTrendCategory.depth1Category;

    if (!depth3Id) return;

    const { first, second, third } = findCategory(depth3Id);

    setSelectedFirstCategory(first);
    setSelectedSecondCategory(second);
    setSelectedThirdCategory(third);

    setSelectedCategoryId(third?.categoryId || second?.categoryId || first?.categoryId || null);

    // 반복 규칙 적용
    setRecurrenceRule({ ...workflowData.recurrenceRule });

  }, [workflowData, categories]);

  // ==============================
  // 카테고리 변경 핸들러
  // ==============================
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

  const handleTest = () => {
    if (!blogId || !blogPassword || !blogUrl) {
      toast({ title: "알림", description: "블로그 계정 정보를 모두 입력해주세요.", variant: "destructive", }); return;
    }
    toast({ title: "테스트 진행", description: "블로그 계정 연결 테스트를 진행합니다.", });
  };

  const handleSubmit = async () => {
    if (!siteUrl || !selectedCategoryId || !selectedBlogTypeId || !blogId || !blogPassword || !blogUrl) {
      return toast({ title: "입력 오류", description: "모든 필드를 입력해주세요.", variant: "destructive" });
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
      blogAccountPwd: blogPassword,
      recurrenceRule,
    };

    try {
      const response = isEditMode
        ? await workflowService.updateWorkflow(workflowId!, req)
        : await workflowService.createWorkflow(req);

      if (response.success) {
        toast({ title: isEditMode ? "수정 완료" : "등록 완료" });
        navigate("/workflows");
      }
    } catch {
      toast({ title: "오류", description: "저장 실패", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container pt-24 pb-12 max-w-4xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {isEditMode ? "워크플로우 수정" : "워크플로우 등록"}
          </h1>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/workflows")}
            className="h-10 w-10 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Container */}
        <div className="space-y-8">
          {/* URL Section */}
          <div className="rounded-xl border border-border bg-card card-shadow p-6">
            <h2 className="text-lg font-semibold mb-4">사이트 선택</h2>
            <div className="flex gap-3">
              <Select value={siteUrl} onValueChange={setSiteUrl}>
                <SelectTrigger className="flex-1">
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
          </div>

          {/* Recurrence Rule Section */}
          <div className="rounded-xl border border-border bg-card card-shadow p-6">
            <h2 className="text-lg font-semibold mb-4">반복 규칙 설정</h2>
            <RecurrenceRuleForm
              value={recurrenceRule}
              onChange={setRecurrenceRule}
            />
          </div>

          {/* Category Selection Section */}
          <div className="rounded-xl border border-border bg-card card-shadow p-6">
            <h2 className="text-lg font-semibold mb-4">상품 선택 기준</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* 1차 카테고리 */}
              <div>
                <Select
                  value={selectedFirstCategory?.categoryId.toString() || ""}
                  onValueChange={handleFirstCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="1차 카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => {
                      // children이 있는 카테고리 중에서
                      // 다른 카테고리의 children에 포함되지 않은 것만 (최상위 카테고리)
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
              </div>

              {/* 2차 카테고리 */}
              <div>
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
              </div>

              {/* 3차 카테고리 */}
              <div>
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
          </div>

          {/* Blog Selection Section */}
          <div className="rounded-xl border border-border bg-card card-shadow p-6">
            <h2 className="text-lg font-semibold mb-4">블로그 선택</h2>
            <div className="grid grid-cols-2 gap-3">
              {blogTypes.map((type) => {
                // 블로그 타입별 로고 매핑
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
        </div>

        {/* Account Input Section */}
        <div className="rounded-xl border border-border bg-card card-shadow p-6">
          <h2 className="text-lg font-semibold mb-4">계정 입력</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="blogId" className="mb-2 block">아이디</Label>
              <Input
                id="blogId"
                placeholder="블로그 ID를 입력하세요"
                value={blogId}
                onChange={(e) => setBlogId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="blogPassword" className="mb-2 block">비밀번호</Label>
              <Input
                id="blogPassword"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={blogPassword}
                onChange={(e) => setBlogPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="blogUrl" className="mb-2 block">블로그 URL</Label>
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
        <div className="flex justify-end gap-3 pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handleTest}
            className="px-8"
            disabled={isLoading}
          >
            테스트
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            className="px-8"
            disabled={isLoading}
          >
            {isLoading ? "처리 중..." : isEditMode ? "수정" : "등록"}
          </Button>
        </div>
      </main >
    </div>
  );
};

export default AddWorkflow;
