import api from "@/lib/api";

export type ApiNotice = {
    noticeId: number;
    title: string;
    content: string;
    announcementType: "GENERAL" | string;
    isImportant: boolean;
    authorName?: string;
    userName?: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    author?: {
        name?: string;
        username?: string;
    };
    noticeFile: {
        fileId: number;
        fileName: string;
        originalName: string;
        fileUrl: string;
        fileSize: number;
        fileType: string;
    } | null;
};

export type CreateNoticePayload = {
    title: string;
    content: string;
    announcementType: string;
    isImportant: boolean;
    file?: File | null;
};

export const noticeService = {
    async getNotices(): Promise<ApiNotice[]> {
        const res = await api.get("/api/v1/notices");
        return res.data?.data ?? [];
    },

    async getNoticeById(id: string): Promise<ApiNotice> {
        const res = await api.get(`/api/v1/notices/${id}`);
        return res.data?.data;
    },

    async createNotice(payload: CreateNoticePayload) {
        const { file, ...rest } = payload;
        if (file) {
            const formData = new FormData();
            formData.append("title", rest.title);
            formData.append("content", rest.content);
            formData.append("announcementType", rest.announcementType);
            formData.append("isImportant", String(rest.isImportant));
            formData.append("file", file);

            const res = await api.post("/api/v1/admin/notices", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data?.data;
        }

        const res = await api.post("/api/v1/admin/notices", {
            ...rest,
        });
        return res.data?.data;
    },

    async deleteNotice(id: number | string) {
        const res = await api.delete(`/api/v1/admin/notices/${id}`);
        return res.data?.data;
    },
};
