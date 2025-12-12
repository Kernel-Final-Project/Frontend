import { LucideIcon } from "lucide-react";

export type AdminSection = "notice" | "user" | "code";

export type AdminNavItem = {
  id: AdminSection;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type NoticeRow = {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  important: boolean;
};

export type AdminUser = {
  userId: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};
