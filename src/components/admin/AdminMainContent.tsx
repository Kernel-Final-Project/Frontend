import { AdminNoticeSection } from "./AdminNoticeSection";
import { AdminPlaceholderPanel } from "./AdminPlaceholderPanel";
import { AdminSection } from "./types";
import { Settings2, Users } from "lucide-react";

type AdminMainContentProps = {
  section: AdminSection;
};

export function AdminMainContent({ section }: AdminMainContentProps) {
  if (section === "notice") {
    return <AdminNoticeSection active />;
  }

  if (section === "user") {
    return (
      <AdminPlaceholderPanel
        title="사용자 관리"
        icon={<Users className="h-4 w-4" />}
        description="계정/권한을 관리할 예정입니다."
      />
    );
  }

  return (
    <AdminPlaceholderPanel
      title="공통 코드 관리"
      icon={<Settings2 className="h-4 w-4" />}
      description="카테고리 및 코드 관리 영역입니다."
    />
  );
}
