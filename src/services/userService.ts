import api from "@/lib/api";

export type ApiUser = {
  userId: number;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  suspensionInfo?: unknown;
};

export type UserListResponse = {
  content: ApiUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export const userService = {
  async getUsers(params?: { page?: number; size?: number }) {
    const res = await api.get("/api/v1/admin/users", { params });
    return res.data?.data as UserListResponse;
  },

  async getUserById(id: number | string) {
    const res = await api.get(`/api/v1/admin/users/${id}`);
    return res.data?.data as ApiUser;
  },

  /**
   * 상태를 변경합니다. (예: ACTIVE -> SUSPEND, SUSPEND -> INACTIVE)
   * 백엔드 명세:
   * - 정지: POST /api/v1/admin/users/{userId}/suspend (reason 옵션)
   * - 해제: POST /api/v1/admin/users/{userId}/unsuspend
   */
  async updateUserStatus(id: number | string, status: string, reason?: string): Promise<ApiUser | null> {
    if (status === "SUSPEND") {
      const res = await api.post(`/api/v1/admin/users/${id}/suspend`, { reason });
      return (res.data?.data as ApiUser) ?? null;
    }

    const res = await api.post(`/api/v1/admin/users/${id}/unsuspend`);
    return (res.data?.data as ApiUser) ?? null;
  },
};
