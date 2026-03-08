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
        "group relative flex items-center gap-3 rounded-[0.85rem] px-3 py-2.5 text-[13px] transition-all duration-200",
        active
          ? "bg-primary/5 font-semibold text-white ring-1 ring-primary/10"
          : "font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-white",
      )}
    >
      {active && (
        <div className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-primary shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
      )}
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-[0.8rem] transition-all duration-200",
          active
            ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-primary/30"
            : "bg-background/50 text-muted-foreground ring-1 ring-white/5 group-hover:bg-white/10 group-hover:text-white",
        )}
      >
        <Icon className={cn("shrink-0 transition-transform", active ? "size-4.5 scale-110" : "size-4")} />
      </div>
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
    <div className={cn("space-y-6 px-1", className)}>
      <div className="border-b border-white/8 pb-4">
        <div className="panel-label">Workspace</div>
        <h2 className="mt-3 font-display text-[1.35rem] leading-none text-white">{title}</h2>
        <p className="mt-3 max-w-[15rem] text-xs leading-6 text-muted-foreground">{description}</p>
      </div>

      <nav className="space-y-5">
        {overviewItem ? (
          <div className="space-y-1.5">
            <div className="px-1">
              <div className="px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 opacity-90">Overview</div>
            </div>
            <SidebarLink
              item={overviewItem}
              active={pathname === overviewItem.href || pathname.startsWith(`${overviewItem.href}/`)}
            />
          </div>
        ) : null}

        {workspaceItems.length ? (
          <div className="space-y-1.5">
            <div className="px-1">
              <div className="px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 opacity-90">Workspace</div>
            </div>
            {workspaceItems.map((item) => (
              <SidebarLink key={item.href} item={item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
            ))}
          </div>
        ) : null}
      </nav>

      <div className="border-t border-white/8 px-4 pt-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 opacity-90">System</div>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Use the sidebar as the primary workspace switch, then operate inside the main panel.
        </p>
      </div>
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
      <div className="flex flex-col gap-6 py-2">
        <AppSidebarPanel title={title} description={description} items={items} />
      </div>
    </aside>
  );
}
