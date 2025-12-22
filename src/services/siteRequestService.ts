import api from "@/lib/api";
import type { ApiResponse } from "./workflowService";

export interface SiteRequestPayload {
  siteUrl: string;
  siteName: string;
  description: string;
}

export const siteRequestService = {
  async submitRequest(payload: SiteRequestPayload): Promise<ApiResponse<void>> {
    const response = await api.post("/api/v1/site-requests", payload);
    return response.data;
  },
};
