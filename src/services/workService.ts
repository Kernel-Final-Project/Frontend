import api from '@/lib/api';
import { ApiResponse } from './workflowService';

export interface Work {
  workId: number;
  status: 'PENDING' | 'REQUESTED' | 'TREND_KEYWORD_DONE' | 'PRODUCT_SELECTED' |
          'CONTENT_GENERATED' | 'BLOG_UPLOAD_PENDING' | 'COMPLETED' | 'FAILED';
  postingUrl: string | null;
  completedAt: string | null;
  choiceProduct: string | null;
}

// 관리자용 Work 타입 (추가 필드 포함)
export interface AdminWork {
  workId: number;
  status: 'PENDING' | 'REQUESTED' | 'TREND_KEYWORD_DONE' | 'PRODUCT_SELECTED' |
          'CONTENT_GENERATED' | 'BLOG_UPLOAD_PENDING' | 'COMPLETED' | 'FAILED';
  postingUrl: string | null;
  title: string | null;
  content: string | null;
  choiceTrendKeyword: string | null;
  completedAt: string | null;
  choiceProduct: string | null;
}

export interface WorkPageResponse {
  works: Work[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// 관리자용 Work 페이지 응답
export interface AdminWorkPageResponse {
  works: AdminWork[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const workService = {
  // 워크플로우별 Work 목록 조회 (페이지네이션)
  async getWorksByWorkflowId(
    workflowId: number,
    page: number = 0
  ): Promise<ApiResponse<WorkPageResponse>> {
    const response = await api.get(`/api/v1/work/${workflowId}?page=${page}`);
    return response.data;
  },

  // 전체 Work 목록 조회 (관리자용) - 선택적 workflowId 필터링
  async getWorksForAdmin(
    page: number = 0,
    workflowId?: number
  ): Promise<ApiResponse<AdminWorkPageResponse>> {
    const params = new URLSearchParams({ page: page.toString() });
    if (workflowId !== undefined) {
      params.append('workflowId', workflowId.toString());
    }
    const response = await api.get(`/api/v1/admin/work?${params.toString()}`);
    return response.data;
  },

  // Work 삭제 (관리자용)
  async deleteWork(workId: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/api/v1/work/${workId}`);
    return response.data;
  },
};
