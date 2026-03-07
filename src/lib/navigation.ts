import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  Settings,
  Shield,
  UserCircle2,
  UsersRound,
} from "lucide-react";

import type { SidebarItem } from "@/components/layout/app-sidebar";

export const dashboardSidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: UserCircle2 },
  { href: "/dashboard/applications", label: "Applications", icon: ClipboardCheck },
  { href: "/dashboard/posts", label: "My Posts", icon: Megaphone },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export const moderationSidebarItems: SidebarItem[] = [
  { href: "/moderation", label: "Overview", icon: Shield },
  { href: "/moderation/posts", label: "Posts", icon: Megaphone },
  { href: "/moderation/companies", label: "Companies", icon: Building2 },
  { href: "/moderation/reports", label: "Reports", icon: ClipboardCheck },
  { href: "/moderation/users", label: "Users", icon: UsersRound },
];

export function getCompanySidebarItems(slug: string): SidebarItem[] {
  return [
    { href: `/dashboard/company/${slug}`, label: "Overview", icon: LayoutDashboard },
    { href: `/dashboard/company/${slug}/members`, label: "Members", icon: UsersRound },
    { href: `/dashboard/company/${slug}/projects`, label: "Projects", icon: FolderKanban },
    { href: `/dashboard/company/${slug}/posts`, label: "Posts", icon: Megaphone },
    { href: `/dashboard/company/${slug}/applications`, label: "Applications", icon: ClipboardCheck },
    { href: `/dashboard/company/${slug}/invites`, label: "Invites", icon: BriefcaseBusiness },
    { href: `/dashboard/company/${slug}/settings`, label: "Settings", icon: Settings },
  ];
}
