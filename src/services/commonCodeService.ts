import api from "@/lib/api";

// Response Types
export type CommonCodeResponse = {
    codeId: string;
    groupId: string;
    codeName: string;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
    createAt: string;
    updateAt: string;
};

export type CommonCodeGroupResponse = {
    groupId: string;
    groupName: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    commonCodes?: CommonCodeResponse[];
};

// Request Types
export type CommonCodeRequest = {
    codeId: string;
    groupId: string;
    codeName: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
};

export type CommonCodeGroupRequest = {
    groupId: string;
    groupName: string;
    description?: string;
};

// Page Response Type (페이징 응답)
export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

// 공통 코드 API
const commonCodeService = {
    // ========== 공통 코드 API ==========

    // 공통코드 생성
    async createCode(request: CommonCodeRequest): Promise<CommonCodeResponse> {
        const res = await api.post("/api/v1/admin/common-codes", request);
        return res.data?.data;
    },

    // 공통코드 단건 조회
    async getCode(groupId: string, codeId: string): Promise<CommonCodeResponse> {
        const res = await api.get(`/api/v1/admin/common-codes/${groupId}/${codeId}`);
        return res.data?.data;
    },

    // 그룹별 코드 목록 조회 (리스트)
    async getCodesByGroup(groupId: string): Promise<CommonCodeResponse[]> {
        const res = await api.get(`/api/v1/admin/common-codes/${groupId}`);
        return res.data?.data;
    },

    // 그룹별 코드 목록 조회 (페이징)
    async getCodesByGroupPaged(groupId: string, page: number = 0, size: number = 10): Promise<PageResponse<CommonCodeResponse>> {
        const res = await api.get(`/api/v1/admin/common-codes/${groupId}/paged`, {
            params: { page, size }
        });
        return res.data?.data;
    },

    // 활성화된 코드만 조회
    async getActiveCodesByGroup(groupId: string): Promise<CommonCodeResponse[]> {
        const res = await api.get(`/api/v1/admin/common-codes/${groupId}/active`);
        return res.data?.data;
    },

    // 공통코드 검색
    async searchCodes(
        groupId?: string,
        codeName?: string,
        isActive?: boolean,
        page: number = 0,
        size: number = 10
    ): Promise<PageResponse<CommonCodeResponse>> {
        const res = await api.get("/api/v1/admin/common-codes/search", {
            params: { groupId, codeName, isActive, page, size }
        });
        return res.data?.data;
    },

    // 코드 정보 수정
    async updateCode(groupId: string, codeId: string, request: CommonCodeRequest): Promise<CommonCodeResponse> {
        const res = await api.put(`/api/v1/admin/common-codes/${groupId}/${codeId}`, request);
        return res.data?.data;
    },

    // 코드 활성화
    async activateCode(groupId: string, codeId: string): Promise<CommonCodeResponse> {
        const res = await api.patch(`/api/v1/admin/common-codes/${groupId}/${codeId}/activate`);
        return res.data?.data;
    },

    // 코드 비활성화
    async deactivateCode(groupId: string, codeId: string): Promise<CommonCodeResponse> {
        const res = await api.patch(`/api/v1/admin/common-codes/${groupId}/${codeId}/deactivate`);
        return res.data?.data;
    },

    // 그룹별 코드 개수 조회
    async getCodeCountByGroup(groupId: string): Promise<number> {
        const res = await api.get(`/api/v1/admin/common-codes/${groupId}/count`);
        return res.data?.data;
    },

    // 그룹별 활성 코드 개수 조회
    async getActiveCodeCountByGroup(groupId: string): Promise<number> {
        const res = await api.get(`/api/v1/admin/common-codes/${groupId}/count/active`);
        return res.data?.data;
    },

    // ========== 공통 코드 그룹 API ==========

    // 공통코드 그룹 생성
    async createGroup(request: CommonCodeGroupRequest): Promise<CommonCodeGroupResponse> {
        const res = await api.post("/api/v1/admin/common-codes/groups", request);
        return res.data?.data;
    },

    // 공통코드 그룹 단건 조회
    async getGroup(groupId: string): Promise<CommonCodeGroupResponse> {
        const res = await api.get(`/api/v1/admin/common-codes/groups/${groupId}`);
        return res.data?.data;
    },

    // 공통코드 그룹 + 코드 조회 (N+1 방지)
    async getGroupWithCodes(groupId: string): Promise<CommonCodeGroupResponse> {
        const res = await api.get(`/api/v1/admin/common-codes/groups/${groupId}/with-codes`);
        return res.data?.data;
    },

    // 공통코드 그룹 목록 조회 (페이징)
    async getAllGroups(page: number = 0, size: number = 10): Promise<PageResponse<CommonCodeGroupResponse>> {
        const res = await api.get("/api/v1/admin/common-codes/groups", {
            params: { page, size }
        });
        return res.data?.data;
    },

    // 공통코드 그룹 검색
    async searchGroups(
        groupId?: string,
        groupName?: string,
        page: number = 0,
        size: number = 10
    ): Promise<PageResponse<CommonCodeGroupResponse>> {
        const res = await api.get("/api/v1/admin/common-codes/groups/search", {
            params: { groupId, groupName, page, size }
        });
        return res.data?.data;
    },

    // 공통코드 그룹 정보 수정
    async updateGroup(groupId: string, request: CommonCodeGroupRequest): Promise<CommonCodeGroupResponse> {
        const res = await api.put(`/api/v1/admin/common-codes/groups/${groupId}`, request);
        return res.data?.data;
    },

    // 공통코드 그룹 삭제
    async deleteGroup(groupId: string): Promise<void> {
        await api.delete(`/api/v1/admin/common-codes/groups/${groupId}`);
    },
};

export { commonCodeService };