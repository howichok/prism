"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Compass,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  Settings,
  Shield,
  UserCircle2,
  UsersRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

const sidebarIcons = {
  bell: Bell,
  briefcaseBusiness: BriefcaseBusiness,
  building2: Building2,
  clipboardCheck: ClipboardCheck,
  compass: Compass,
  folderKanban: FolderKanban,
  layoutDashboard: LayoutDashboard,
  megaphone: Megaphone,
  settings: Settings,
  shield: Shield,
  userCircle2: UserCircle2,
  usersRound: UsersRound,
} as const;

export type SidebarIconKey = keyof typeof sidebarIcons;

export type SidebarItem = {
  href: string;
  label: string;
  icon: SidebarIconKey;
};

function SidebarLink({ item, active }: { item: SidebarItem; active: boolean }) {
  const Icon = sidebarIcons[item.icon] ?? LayoutDashboard;

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
        active
          ? "bg-white/[0.06] font-medium text-white"
          : "text-white/45 hover:bg-white/[0.03] hover:text-white/75",
      )}
    >
      {active && (
        <div className="absolute inset-y-2 left-0 w-[2px] rounded-r-full bg-blue-400" />
      )}
      <Icon className={cn("size-4 shrink-0", active ? "text-blue-400" : "text-white/30")} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function AppSidebarPanel({
  title,
  description,
  items,
  className,
}: {
  title: string;
  description: string;
  items: SidebarItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const overviewItem = items[0];
  const workspaceItems = items.slice(1);

  return (
    <div className={cn("space-y-5", className)}>
      <div className="border-b border-white/6 pb-3">
        <h2 className="font-display text-base text-white">{title}</h2>
        <p className="mt-1 max-w-[15rem] text-xs text-white/35">{description}</p>
      </div>

      <nav className="space-y-4">
        {overviewItem ? (
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">Overview</div>
            <SidebarLink
              item={overviewItem}
              active={pathname === overviewItem.href || pathname.startsWith(`${overviewItem.href}/`)}
            />
          </div>
        ) : null}

        {workspaceItems.length ? (
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">Workspace</div>
            {workspaceItems.map((item) => (
              <SidebarLink key={item.href} item={item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
            ))}
          </div>
        ) : null}
      </nav>
    </div>
  );
}

export function AppSidebar({
  title,
  description,
  items,
  className,
}: {
  title: string;
  description: string;
  items: SidebarItem[];
  className?: string;
}) {
  return (
    <aside className={className}>
      <AppSidebarPanel title={title} description={description} items={items} />
    </aside>
  );
}
