import type { SidebarItem } from "@/components/layout/app-sidebar";

export const dashboardSidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: "layoutDashboard" },
  { href: "/dashboard/profile", label: "My Profile", icon: "userCircle2" },
  { href: "/dashboard/applications", label: "Applications", icon: "clipboardCheck" },
  { href: "/dashboard/posts", label: "My Posts", icon: "megaphone" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "bell" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export const guestDashboardSidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: "layoutDashboard" },
  { href: "/discovery", label: "Discovery", icon: "compass" },
  { href: "/companies", label: "Companies", icon: "building2" },
  { href: "/sign-in", label: "Sign In", icon: "userCircle2" },
];

export const moderationSidebarItems: SidebarItem[] = [
  { href: "/moderation", label: "Overview", icon: "shield" },
  { href: "/moderation/posts", label: "Posts", icon: "megaphone" },
  { href: "/moderation/companies", label: "Companies", icon: "building2" },
  { href: "/moderation/reports", label: "Reports", icon: "clipboardCheck" },
  { href: "/moderation/users", label: "Users", icon: "usersRound" },
];

export function getCompanySidebarItems(slug: string): SidebarItem[] {
  return [
    { href: `/dashboard/company/${slug}`, label: "Overview", icon: "layoutDashboard" },
    { href: `/dashboard/company/${slug}/members`, label: "Members", icon: "usersRound" },
    { href: `/dashboard/company/${slug}/projects`, label: "Projects", icon: "folderKanban" },
    { href: `/dashboard/company/${slug}/posts`, label: "Posts", icon: "megaphone" },
    { href: `/dashboard/company/${slug}/applications`, label: "Applications", icon: "clipboardCheck" },
    { href: `/dashboard/company/${slug}/invites`, label: "Invites", icon: "briefcaseBusiness" },
    { href: `/dashboard/company/${slug}/settings`, label: "Settings", icon: "settings" },
  ];
}
