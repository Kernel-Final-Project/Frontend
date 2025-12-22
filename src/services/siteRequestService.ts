import api from "@/lib/api";
import type { ApiResponse } from "./workflowService";

export type SiteRequestState = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SiteRequestPayload {
  siteUrl: string;
  siteName: string;
  description: string;
}

export interface SiteRequestResponse {
  requestId: number;
  siteUrl: string;
  siteName: string;
  state: SiteRequestState;
  description: string;
  createdAt: string;
}

export interface SiteRequestPageResponse {
  content: SiteRequestResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export const siteRequestService = {
  async submitRequest(payload: SiteRequestPayload): Promise<ApiResponse<void>> {
    const response = await api.post("/api/v1/site-requests", payload);
    return response.data;
  },

  async getMyRequests(page: number = 0): Promise<ApiResponse<SiteRequestPageResponse>> {
    const response = await api.get(`/api/v1/site-requests/my?page=${page}`);
    return response.data;
  },
};
