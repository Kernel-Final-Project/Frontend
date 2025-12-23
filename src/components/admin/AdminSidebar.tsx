import { AdminNavItem } from "./types";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type AdminSidebarProps = {
  items: AdminNavItem[];
  activeId: AdminNavItem["id"];
  onSelect: (id: AdminNavItem["id"]) => void;
};

export function AdminSidebar({ items, activeId, onSelect }: AdminSidebarProps) {
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[200px] bg-gray-50 border-r border-gray-200 overflow-y-auto">
      {/* 사용자 정보 */}
      {user && (
        <div className="p-4 mb-2 bg-white border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      )}

      {/* 메뉴 목록 */}
      <nav className="px-3 py-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex w-full items-center justify-between px-3 py-2.5 mb-1 text-left text-sm transition-colors rounded",
              activeId === item.id
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <span>{item.label}</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        ))}
      </nav>
    </aside>
  );
}
