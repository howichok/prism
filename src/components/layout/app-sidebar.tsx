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
    <div className={cn("space-y-4", className)}>
      <div className="px-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className={cn("size-4 shrink-0", active ? "text-primary" : "")} />
              <span className="truncate">{item.label}</span>
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
      <div className="rounded-xl border border-border bg-card p-3">
        <AppSidebarPanel title={title} description={description} items={items} />
      </div>
    </aside>
  );
}
