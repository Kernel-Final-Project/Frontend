import { AdminNavItem } from "./types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type AdminSidebarProps = {
  items: AdminNavItem[];
  activeId: AdminNavItem["id"];
  onSelect: (id: AdminNavItem["id"]) => void;
};

export function AdminSidebar({ items, activeId, onSelect }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "transition-all duration-200 ease-in-out",
        "bg-card border border-border card-shadow rounded-xl",
        "relative overflow-hidden w-[280px]",
      )}
    >
      <div className="p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-foreground">관리 항목</p>
          <p className="text-xs text-muted-foreground">메뉴를 선택하면 오른쪽 콘텐츠가 전환됩니다.</p>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors",
                  activeId === item.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/40",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold leading-tight">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
