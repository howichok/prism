"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

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
    <div className={cn("surface-panel overflow-hidden p-4", className)}>
      <div className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4">
        <div className="panel-label">Workspace</div>
        <h2 className="mt-3 font-display text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-white/58">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/42">
          <span>{items.length} sections</span>
          <span className="size-1 rounded-full bg-white/24" />
          <span>Structured navigation</span>
        </div>
      </div>
      <nav className="mt-4 flex flex-col gap-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-[1.35rem] border px-3.5 py-3 text-sm transition",
                active
                  ? "border-cyan-400/22 bg-cyan-400/12 text-white shadow-[inset_0_0_0_1px_rgba(85,212,255,0.16),0_20px_45px_-38px_rgba(56,189,248,0.9)]"
                  : "border-white/0 text-white/64 hover:border-white/8 hover:bg-white/6 hover:text-white",
              )}
            >
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-2xl border transition",
                  active
                    ? "border-cyan-400/18 bg-cyan-400/14 text-cyan-100"
                    : "border-white/10 bg-white/6 text-white/58 group-hover:border-white/14 group-hover:text-white",
                )}
              >
                <item.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/38">
                  {active ? "Current section" : "Open section"}
                </div>
              </div>
              <ChevronRight
                className={cn(
                  "size-4 transition",
                  active ? "text-cyan-100" : "text-white/28 group-hover:translate-x-0.5 group-hover:text-white/50",
                )}
              />
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
      <AppSidebarPanel title={title} description={description} items={items} />
    </aside>
  );
}
