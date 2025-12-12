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

export interface WorkPageResponse {
  works: Work[];
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
};
