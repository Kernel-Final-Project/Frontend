import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Workflow } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { workflowService, SiteInfo, RecurrenceRuleDto, WorkflowRequest, BlogType, Category } from '@/services/workflowService';
import { RecurrenceRuleForm } from '@/components/workflow/RecurrenceRuleForm';
import { validateRecurrenceRule } from '@/utils/recurrenceRuleHelper';
import naverBlogLogo from '/naverBlog_logo.png';
import tistoryLogo from '/tistory_logo.png';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

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
  const [testStatus, setTestStatus] = useState<'NOT_TESTED' | 'TESTING' | 'TEST_PASSED' | 'TEST_FAILED'>('NOT_TESTED');
  const [testWorkflowId, setTestWorkflowId] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testErrorMessage, setTestErrorMessage] = useState<string | null>(null);
  const [originalTestFields, setOriginalTestFields] = useState<{
    blogId: string;
    blogPassword: string;
    blogUrl: string;
  } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

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
    if (testStatus !== 'TEST_PASSED') {
      toast({
        title: "테스트 필요",
        description: "테스트 성공 후 수정이 가능합니다.",
        variant: "destructive"
      });
      return;
    }

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
      blogAccountPwd: blogPassword || undefined as any,
      recurrenceRule,
    };

    try {
      setIsRegistering(true);

      // 테스트는 이미 완료, 바로 등록
      const registerResponse = await workflowService.registerWorkflow(workflowId, req);

      if (registerResponse.success) {
        toast({ title: "수정 완료", description: "워크플로우가 수정되었습니다." });
        onSuccess();
      } else {
        toast({
          title: "수정 실패",
          description: registerResponse.message || "워크플로우 수정에 실패했습니다.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ title: "오류", description: "저장 실패", variant: "destructive" });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleTest = async () => {
    if (!blogId || !blogPassword || !blogUrl) {
      toast({ title: "알림", description: "블로그 계정 정보를 모두 입력해주세요.", variant: "destructive" });
      return;
    }

    if (!siteUrl || !selectedCategoryId || !selectedBlogTypeId) {
      toast({ title: "입력 오류", description: "모든 필수 필드를 입력해주세요.", variant: "destructive" });
      return;
    }

    const ruleError = validateRecurrenceRule(recurrenceRule);
    if (ruleError) {
      toast({ title: "반복 규칙 오류", description: ruleError, variant: "destructive" });
      return;
    }

    const selectedBlogType = blogTypes.find(bt => bt.blogTypeId === selectedBlogTypeId);
    const req: WorkflowRequest = {
      siteUrl,
      blogTypeId: selectedBlogTypeId,
      blogTypeName: selectedBlogType?.blogTypeName ?? '',
      blogUrl,
      categoryId: selectedCategoryId,
      blogAccountId: blogId,
      blogAccountPwd: blogPassword || undefined as any,
      recurrenceRule,
    };

    try {
      setIsTesting(true);
      setTestStatus('TESTING');
      setTestErrorMessage(null);

      // Edit 모드: replaceWorkflowId 전달
      const testResponse = await workflowService.testWorkflow(req, workflowId);

      if (!testResponse.success) {
        setTestStatus('TEST_FAILED');
        setTestErrorMessage(testResponse.message || "워크플로우 테스트에 실패했습니다.");
        toast({
          title: "테스트 실패",
          description: testResponse.message || "워크플로우 테스트에 실패했습니다.",
          variant: "destructive"
        });
        setIsTesting(false);
        return;
      }

      setTestWorkflowId(testResponse.data.workflowId);
      setOriginalTestFields({
        blogId,
        blogPassword,
        blogUrl,
      });
    } catch (error) {
      setTestStatus('TEST_FAILED');
      setTestErrorMessage("테스트 중 오류가 발생했습니다.");
      setIsTesting(false);
      toast({ title: "오류", description: "테스트 실패", variant: "destructive" });
    }
  };

  // 테스트 상태 폴링
  useEffect(() => {
    if (testStatus !== 'TESTING' || !testWorkflowId) return;

    const interval = setInterval(async () => {
      try {
        const response = await workflowService.getTestWorkflowDetail(testWorkflowId);
        if (response.success) {
          const status = response.data.testStatus;
          if (status === 'TEST_PASSED' || status === 'TEST_FAILED') {
            setTestStatus(status);
            setIsTesting(false);
            clearInterval(interval);

            if (status === 'TEST_PASSED') {
              toast({ title: "테스트 성공", description: "워크플로우 테스트에 성공했습니다." });
              setTestErrorMessage(null);
            } else {
              const failureReason = response.data.latestWork?.failureReason || "워크플로우 테스트에 실패했습니다.";
              setTestErrorMessage(failureReason);
              toast({ title: "테스트 실패", description: failureReason, variant: "destructive" });
            }
          }
        }
      } catch (error) {
        console.error('테스트 상태 조회 실패:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [testStatus, testWorkflowId]);


  // 계정 정보 변경 시 테스트 초기화
  useEffect(() => {
    if (!originalTestFields || testStatus !== 'TEST_PASSED') return;

    const fieldsChanged =
      blogId !== originalTestFields.blogId ||
      (blogPassword && blogPassword !== originalTestFields.blogPassword) ||
      blogUrl !== originalTestFields.blogUrl;

    if (fieldsChanged) {
      setTestStatus('NOT_TESTED');
      setTestWorkflowId(null);
      setTestErrorMessage(null);
      setOriginalTestFields(null);
    }
  }, [blogId, blogPassword, blogUrl, originalTestFields, testStatus]);

  if (isLoading) {
    return (
      <Card className="card-shadow overflow-hidden">
        <CardHeader className="bg-muted/40 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8 rounded-lg hover:bg-muted -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Workflow className="h-4 w-4" />
            <span>워크플로우 관리</span>
          </div>
          <CardTitle className="text-xl">워크플로우 수정</CardTitle>
          <p className="text-sm text-muted-foreground">
            워크플로우 정보를 수정합니다.
          </p>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-shadow overflow-hidden">
      <CardHeader className="bg-muted/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8 rounded-lg hover:bg-muted -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Workflow className="h-4 w-4" />
          <span>워크플로우 관리</span>
        </div>
        <CardTitle className="text-xl">워크플로우 수정</CardTitle>
        <p className="text-sm text-muted-foreground">
          워크플로우 정보를 수정합니다.
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* URL Section */}
        <div className="rounded-xl border border-border bg-card card-shadow p-6">
          <h3 className="text-lg font-semibold mb-4">사이트 선택</h3>
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
          <h3 className="text-lg font-semibold mb-4">반복 규칙 설정</h3>
          <RecurrenceRuleForm
            value={recurrenceRule}
            onChange={setRecurrenceRule}
          />
        </div>

        {/* Category Selection Section */}
        <div className="rounded-xl border border-border bg-card card-shadow p-6">
          <h3 className="text-lg font-semibold mb-4">상품 선택 기준</h3>
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
        <div className="rounded-xl border border-border bg-card card-shadow p-6">
          <h3 className="text-lg font-semibold mb-4">블로그 선택</h3>
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
        <div className="rounded-xl border border-border bg-card card-shadow p-6">
          <h3 className="text-lg font-semibold mb-4">계정 입력</h3>
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
                placeholder="변경하려면 입력하세요"
                value={blogPassword}
                onChange={(e) => setBlogPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                비밀번호를 변경하지 않으려면 비워두세요
              </p>
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
        <br />

        {/* 테스트 상태 표시 */}
        {testStatus === 'TESTING' && (
          <Alert className="bg-blue-50 border-blue-200">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>테스트 진행 중</AlertTitle>
            <AlertDescription>
              AI 콘텐츠를 생성하고 블로그에 업로드하는 테스트를 진행하고 있습니다. 잠시만 기다려주세요...
            </AlertDescription>
          </Alert>
        )}

        {testStatus === 'TEST_PASSED' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">테스트 성공</AlertTitle>
            <AlertDescription className="text-green-700">
              AI 콘텐츠 생성 및 블로그 업로드 테스트에 성공했습니다. 이제 수정할 수 있습니다.
            </AlertDescription>
          </Alert>
        )}

        {testStatus === 'TEST_FAILED' && testErrorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>테스트 실패</AlertTitle>
            <AlertDescription>
              {testErrorMessage}
            </AlertDescription>
          </Alert>
        )}


        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleTest}
            className="px-8"
            disabled={isTesting || isRegistering || !blogId || !blogUrl}
          >
            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isTesting ? "테스트 중..." : "테스트"}
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            className="px-8"
            disabled={testStatus !== 'TEST_PASSED' || isRegistering || isTesting}
          >
            {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isRegistering ? "수정 중..." : "수정"}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
