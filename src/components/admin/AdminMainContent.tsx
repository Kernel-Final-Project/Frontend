import { AdminNoticeSection } from "./AdminNoticeSection";
import { AdminPlaceholderPanel } from "./AdminPlaceholderPanel";
import { AdminSection, UserFilterInfo, WorkflowFilterInfo } from "./types";
import { AdminUserSection } from "./AdminUserSection";
import { AdminWorkflowSection } from "./AdminWorkflowSection";
import { AdminWorkSection } from "./AdminWorkSection";
import { Settings2 } from "lucide-react";
import { AdminUserStatsSection } from "./AdminUserStatsSection";
import { AdminCommonCodeSection } from "./AdminCommonCodeSection";
import { AdminBlogStatsSection } from "./AdminBlogStatsSection";
import { AdminSiteRequestSection } from "./AdminSiteRequestSection";

type AdminMainContentProps = {
  section: AdminSection;
  onSectionChange?: (section: AdminSection, userFilter?: UserFilterInfo, workflowFilter?: WorkflowFilterInfo) => void;
  userFilter?: UserFilterInfo;
  workflowFilter?: WorkflowFilterInfo;
};

export function AdminMainContent({ section, onSectionChange, userFilter, workflowFilter }: AdminMainContentProps) {
  if (section === "notice") {
    return <AdminNoticeSection active />;
  }

  if (section === "user") {
    return (
      <AdminUserSection
        active
        onNavigateToWorkflow={(userId, userName) => {
          onSectionChange?.("workflow", { userId, userName });
        }}
      />
    );
  }

  if (section === "workflow") {
    return (
      <AdminWorkflowSection
        key={userFilter?.userId || 'all'}
        active
        userFilter={userFilter}
        onNavigateToWork={(workflowId) => {
          onSectionChange?.("work", undefined, { workflowId });
        }}
      />
    );
  }


  if (section === "work") {
    return (
      <AdminWorkSection
        key={workflowFilter?.workflowId || 'all'}
        active
        workflowId={workflowFilter?.workflowId}
      />
    );
  }


  if (section === "stats") {
    return <AdminUserStatsSection active />;
  }

  if (section === "blog") {
    return <AdminBlogStatsSection active />;
  }

  if (section === "site-request") {
    return <AdminSiteRequestSection active />;
  }

  if (section === "code") {
    return <AdminCommonCodeSection active />;
  }

  return (
      <AdminPlaceholderPanel
          title="알 수 없는 섹션"
          icon={<Settings2 className="h-4 w-4" />}
          description="알 수 없는 섹션입니다."
      />
  );
}
