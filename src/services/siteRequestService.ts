import api from "@/lib/api";
import { ApiResponse } from "./workflowService";

/* =========================
 * TYPES
 * ========================= */

export type SiteRequestState = "RECEIVED" | "APPROVED" | "REJECTED";

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
  description: string | null;
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

/* =========================
 * SERVICE
 * ========================= */

export const siteRequestService = {
  /* ---------- USER ---------- */

  async submitRequest(
    payload: SiteRequestPayload
  ): Promise<ApiResponse<void>> {
    const response = await api.post("/api/v1/site-requests", payload);
    return response.data;
  },

  async getMyRequests(
    page: number = 0
  ): Promise<ApiResponse<SiteRequestPageResponse>> {
    const response = await api.get(
      `/api/v1/site-requests/my?page=${page}`
    );
    return response.data;
  },

  /* ---------- ADMIN ---------- */

  async getSiteRequests(
    page: number = 0
  ): Promise<ApiResponse<SiteRequestPageResponse>> {
    const response = await api.get(
      `/api/v1/admin/site-requests?page=${page}`
    );
    return response.data;
  },

  async approveSiteRequest(
    requestId: number
  ): Promise<ApiResponse<SiteRequestResponse>> {
    const response = await api.patch(
      `/api/v1/admin/site-requests/${requestId}/approve`
    );
    return response.data;
  },

  async rejectSiteRequest(
    requestId: number
  ): Promise<ApiResponse<SiteRequestResponse>> {
    const response = await api.patch(
      `/api/v1/admin/site-requests/${requestId}/reject`
    );
    return response.data;
  },
};