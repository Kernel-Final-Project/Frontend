import api from '@/lib/api';

// 반복 유형
export type RepeatType = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

// 반복 규칙
export interface RecurrenceRuleDto {
  repeatType: RepeatType;
  repeatInterval?: number | null;
  daysOfWeek?: number[] | null;      // 0=일요일, 1=월요일, ..., 6=토요일
  daysOfMonth?: number[] | null;     // 1-31
  timesOfDay?: string[] | null;      // "HH:mm" 형식
  startAt: string;                   // ISO 8601 형식
  endAt?: string | null;             // ISO 8601 형식
}

// 백엔드 응답용 (id, readableRule 포함)
export interface RecurrenceRule extends RecurrenceRuleDto {
  id?: number;
  readableRule?: string;  // 백엔드에서 자동 생성
}

// 백엔드 API 응답 구조
export interface Workflow {
  workflowId: number;
  userId: number;
  siteUrl: string;
  siteName: string;
  blogType: string;
  blogUrl: string;
  trendCategoryName: string;
  blogAccountId: string;
  readableRule: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'DELETED' | 'COMPLETED';
  testStatus: 'TESTING' | 'TEST_PASSED' | 'TEST_FAILED';
  recurrenceRule?: RecurrenceRule;  // 선택적 (응답에서 id와 readableRule 포함)
}

export interface WorkflowEditResponse {
  workflowId: number;
  userId: number;
  siteUrl: string;
  siteName?: string;
  blogTypeId: number;
  blogTypeName: string;
  blogUrl: string;
  blogAccountId: string;
  recurrenceRule: RecurrenceRule;
  setTrendCategory: TrendCategory;
}

export interface WorkTestResponse {
  workflowId: number;
  contentGenerateRequested: boolean;
  blogUploadCount: number;
  message: string;
  testStatus: string;
}

export interface WorkflowDetailResponse {
  workflowId: number;
  userId: number;
  userName?: string;
  status: string;
  testStatus: string;
  siteUrl: string;
  siteName?: string;
  blogType: string;
  blogUrl: string;
  blogAccountId: string;
  recurrenceRule: RecurrenceRule;
  setTrendCategory: SetTrendCategory;
}

export interface TrendCategory {
  depth1Category: number;
  depth2Category: number | null;
  depth3Category: number | null;
  mainCategoryName: string;
}

export interface SetTrendCategory {
  depth1Category: string;
  depth2Category: string | null;
  depth3Category: string | null;
}

// create/update 공통 요청 타입
export interface WorkflowRequest {
  siteUrl: string;
  blogTypeId: number;        // string → number 변경
  blogTypeName: string;
  blogUrl: string;
  blogAccountId: string;
  categoryId: number;        // trendCategoryName → categoryId 변경
  blogAccountPwd: string;
  recurrenceRule: RecurrenceRuleDto;  // DTO 사용
}

export interface WorkflowRegisterRequest extends Partial<WorkflowRequest> {
  replaceWorkflowId?: number | null;
}

export interface SiteInfo {
  siteName: string;
  siteUrl: string;
}

export interface BlogType {
  blogTypeId: number;
  blogTypeName: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  children?: Category[];  // 하위 카테고리 배열
}

export type SiteInfoResponse = SiteInfo[];

export interface WorkflowPageResponse {
  content: Workflow[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface WorkflowTestDetailResponse {
  workflowId: number;
  userId: number;
  userName?: string;
  siteName: string;
  siteUrl: string;
  blogType: string;
  blogUrl: string;
  blogAccountId: string;
  setTrendCategory: SetTrendCategory;
  recurrenceRule: RecurrenceRule;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'DELETED' | 'COMPLETED';
  testStatus: 'TESTING' | 'TEST_PASSED' | 'TEST_FAILED';
  latestWork: TestWorkInfo | null;
}

export interface TestWorkInfo {
  workId: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  completedAt: string | null;
  failureReason: string | null;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const workflowService = {
  // 워크플로우 목록 조회 (페이지네이션)
  async getWorkflows(page: number = 0): Promise<ApiResponse<WorkflowPageResponse>> {
    const response = await api.get(`/api/v1/workflow?page=${page}`);
    return response.data;
  },

  // 워크플로우 단건 조회(수정용)
  async getWorkflowByIdEdit(id: number): Promise<ApiResponse<WorkflowEditResponse>> {
    const response = await api.get(`/api/v1/workflow/${id}/edit`);
    return response.data;
  },

  // 워크플로우 단건 조회(조회용)
  async getWorkflowById(id: number): Promise<ApiResponse<WorkflowDetailResponse>> {
    const response = await api.get(`/api/v1/workflow/${id}`);
    return response.data;
  },

  // // 워크플로우 생성
  // async createWorkflow(data: WorkflowRequest): Promise<ApiResponse<Workflow>> {
  //   const response = await api.post('/api/v1/workflow', data);
  //   return response.data;
  // },

  // 워크플로우 테스트
  async testWorkflow(data: WorkflowRequest, replaceWorkflowId?: number): Promise<ApiResponse<WorkTestResponse>> {
    const url = replaceWorkflowId
      ? `/api/v1/workflow/test?replaceWorkflowId=${replaceWorkflowId}`
      : `/api/v1/workflow/test`;
    const response = await api.post(url, data);  // data 추가!
    return response.data;
  },

  // 워크플로우 등록
  async registerWorkflow(id: number, data: WorkflowRegisterRequest): Promise<ApiResponse<Workflow>> {
    const response = await api.post(`/api/v1/workflow/${id}/register`, data);
    return response.data;
  },

  async getTestWorkflowDetail(workflowId: number): Promise<ApiResponse<WorkflowTestDetailResponse>> {
    const response = await api.get(`/api/v1/workflow/test/${workflowId}`);
    return response.data;
  },

  // 워크플로우 수정
  async updateWorkflow(id: number, data: Partial<WorkflowRequest>): Promise<ApiResponse<Workflow>> {
    const response = await api.put(`/api/v1/workflow/${id}`, data);
    return response.data;
  },

  // 워크플로우 삭제
  async deleteWorkflow(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/api/v1/workflow/${id}`);
    return response.data;
  },

  // 사이트 정보 가져오기
  async getSiteInfo(): Promise<ApiResponse<SiteInfoResponse>> {
    const response = await api.get("/api/v1/workflow/site-info");
    return response.data;
  },

  // 트렌드 카테고리 가져오기
  async getTrendCategory(): Promise<ApiResponse<Category[]>> {
    const response = await api.get("/api/v1/workflow/trend-category")

    return response.data;
  },

  // 블로그 유형 가져오기
  async getBlogTypes(): Promise<ApiResponse<BlogType[]>> {
    const response = await api.get("/api/v1/workflow/blog-type")

    return response.data;
  },

  // 관리자 - 전체 워크플로우 목록 조회 (페이지네이션, 사용자 필터링 옵션)
  async getWorkflowsForAdmin(page: number = 0, userId?: number): Promise<ApiResponse<WorkflowPageResponse>> {
    const params = new URLSearchParams({ page: page.toString() });
    if (userId !== undefined) {
      params.append('userId', userId.toString());
    }
    const response = await api.get(`/api/v1/admin/workflow?${params.toString()}`);
    return response.data;
  },

  async generateTestContent(workflowId: number): Promise<ApiResponse<void>> {
    const response = await api.post(`/api/v1/test/${workflowId}/content-generate`);
    return response.data;
  },

  async updateWorkflowStatus(
    workflowId: number,
    newStatus: 'ACTIVE' | 'INACTIVE'
  ): Promise<ApiResponse<void>> {
    const response = await api.patch(`/api/v1/workflow/${workflowId}/status`, { newStatus });
    return response.data;
  }
};
