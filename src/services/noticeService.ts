import api from "@/lib/api";

export type ApiNotice = {
    noticeId: number;
    title: string;
    content: string;
    announcementType: "GENERAL" | string;
    isImportant: boolean;
    authorId: number;
    authorName?: string;
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

export const noticeService = {
    async getNotices(): Promise<ApiNotice[]> {
        const res = await api.get("/api/v1/notices");
        return res.data?.data ?? [];
    },

    async getNoticeById(id: string): Promise<ApiNotice> {
        const res = await api.get(`/api/v1/notices/${id}`);
        return res.data?.data;
    },
};
