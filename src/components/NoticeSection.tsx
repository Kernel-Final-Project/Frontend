import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { noticeService } from "@/services/noticeService";
import { useNavigate } from "react-router-dom";

export function NoticeSection() {
  const navigate = useNavigate();

  const { data: notices, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: () => noticeService.getNotices(),
  });

  const latestNotices = notices?.slice(-3).reverse() || [];

  const getTags = (notice: any) => {
    const tags = [];
    if (notice.isImportant) tags.push("중요");
    if (notice.announcementType === "GENERAL") tags.push("공지");
    else if (notice.announcementType) tags.push(notice.announcementType);
    return tags;
  };

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Title */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              News
            </h2>
            <p className="text-gray-400 text-base mb-2">
              다양한 소식을 전해드립니다.
            </p>
            <p className="text-gray-400 text-base mb-4">
              다양한 이벤트도 준비되어 있으니 많은 참여 바랍니다.
            </p>
            <button
              onClick={() => navigate('/notices')}
              className="text-white underline hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              전체 보기
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Right Side - News List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-400">로딩 중...</div>
            ) : (
              <>
                {latestNotices.map((notice, index) => (
                  <div
                    key={notice.noticeId}
                    className="border-t border-gray-700 pt-4 group cursor-pointer"
                    onClick={() => navigate(`/notices/${notice.noticeId}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gray-500 text-sm">
                        {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                    </div>

                    <h3 className="text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">
                      {notice.title}
                    </h3>

                    {getTags(notice).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {getTags(notice).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-gray-500 text-sm"
                          >
                            {tag}
                            {tagIndex < getTags(notice).length - 1 && ' /'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
