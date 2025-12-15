import { AdminNoticeSection } from "./AdminNoticeSection";
import { AdminPlaceholderPanel } from "./AdminPlaceholderPanel";
import { AdminSection } from "./types";
import { AdminUserSection } from "./AdminUserSection";
import { Settings2, Users } from "lucide-react";
import { AdminUserStatsSection } from "./AdminUserStatsSection";

type AdminMainContentProps = {
  section: AdminSection;
};

export function AdminMainContent({ section }: AdminMainContentProps) {
  if (section === "notice") {
    return <AdminNoticeSection active />;
  }

  if (section === "user") {
    return <AdminUserSection active />;
  }

  if (section === "stats") {
    return <AdminUserStatsSection active />;
  }

  return (
    <AdminPlaceholderPanel
      title="공통 코드 관리"
      icon={<Settings2 className="h-4 w-4" />}
      description="카테고리 및 코드 관리 영역입니다."
    />
  );
}
