"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SidebarItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

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

  return (
    <div className={cn("surface-panel-strong space-y-5 p-4", className)}>
      <div className="rounded-[0.85rem] border border-white/6 bg-white/[0.03] p-4">
        <div className="panel-label">Workspace shell</div>
        <h2 className="mt-3 font-display text-[1.55rem] leading-none text-white">{title}</h2>
        <p className="mt-3 max-w-[15rem] text-xs leading-6 text-muted-foreground">{description}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-[0.7rem] border border-white/6 bg-background/65 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Mode</div>
            <div className="mt-2 text-xs font-medium text-foreground">Operational</div>
          </div>
          <div className="rounded-[0.7rem] border border-white/6 bg-background/65 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">State</div>
            <div className="mt-2 text-xs font-medium text-foreground">Connected</div>
          </div>
        </div>
      </div>
      <div className="px-1">
        <div className="panel-label px-3">Navigation</div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-[0.8rem] border px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                active
                  ? "border-primary/18 bg-[linear-gradient(180deg,rgba(37,99,235,0.14),rgba(255,255,255,0.02))] text-white shadow-[0_14px_30px_rgba(37,99,235,0.12)]"
                  : "border-transparent text-muted-foreground hover:border-white/6 hover:bg-white/[0.035] hover:text-white",
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-[0.7rem] border transition-colors",
                  active
                    ? "border-primary/20 bg-primary/12 text-primary"
                    : "border-white/6 bg-background/55 text-muted-foreground group-hover:border-primary/15 group-hover:text-white",
                )}
              >
                <item.icon className="size-4 shrink-0" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="truncate">{item.label}</span>
              </div>
            </Link>
          );
        })}
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
      <div className="flex flex-col gap-6 py-2">
        <AppSidebarPanel title={title} description={description} items={items} />
      </div>
    </aside>
  );
}
