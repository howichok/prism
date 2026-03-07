"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

import { cn } from "@/lib/utils";

const sidebarIcons = {
  bell: Bell,
  briefcaseBusiness: BriefcaseBusiness,
  building2: Building2,
  clipboardCheck: ClipboardCheck,
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
        "group flex items-center gap-3 rounded-[0.95rem] border px-3 py-3 text-[13px] font-medium transition-colors",
        active
          ? "border-white/12 bg-white/[0.06] text-white"
          : "border-transparent text-muted-foreground hover:border-white/8 hover:bg-white/[0.03] hover:text-white",
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-[0.8rem] border transition-colors",
          active
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-white/8 bg-background/70 text-muted-foreground group-hover:border-white/12 group-hover:text-white",
        )}
      >
        <Icon className="size-4 shrink-0" />
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
    <div className={cn("space-y-6 rounded-[1.05rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4", className)}>
      <div className="rounded-[0.9rem] border border-white/8 bg-white/[0.02] p-4">
        <div className="panel-label">Workspace</div>
        <h2 className="mt-3 font-display text-[1.35rem] leading-none text-white">{title}</h2>
        <p className="mt-3 max-w-[15rem] text-xs leading-6 text-muted-foreground">{description}</p>
      </div>

      <nav className="space-y-5">
        {overviewItem ? (
          <div className="space-y-1.5">
            <div className="px-1">
              <div className="panel-label px-3">Overview</div>
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
              <div className="panel-label px-3">Workspace</div>
            </div>
            {workspaceItems.map((item) => (
              <SidebarLink key={item.href} item={item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
            ))}
          </div>
        ) : null}
      </nav>

      <div className="rounded-[0.9rem] border border-white/8 bg-white/[0.02] px-4 py-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/36">System</div>
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
