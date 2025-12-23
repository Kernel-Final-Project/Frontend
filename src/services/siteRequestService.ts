import api from '@/lib/api';
import { ApiResponse } from './workflowService';
import { SiteRequestPageResponse, SiteRequest } from '@/components/admin/types';

export const siteRequestService = {
  // 사이트 등록 요청 목록 조회 (페이지네이션)
  async getSiteRequests(page: number = 0): Promise<ApiResponse<SiteRequestPageResponse>> {
    const response = await api.get(`/api/v1/admin/site-requests`);
    return response.data;
  },

  // 사이트 등록 요청 승인
  async approveSiteRequest(requestId: number): Promise<ApiResponse<SiteRequest>> {
    const response = await api.patch(`/api/v1/admin/site-requests/${requestId}/approve`);
    return response.data;
  },

  // 사이트 등록 요청 거부
  async rejectSiteRequest(requestId: number): Promise<ApiResponse<SiteRequest>> {
    const response = await api.patch(`/api/v1/admin/site-requests/${requestId}/reject`);
    return response.data;
  },
};

