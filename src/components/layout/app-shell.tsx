import { PanelLeft } from "lucide-react";

import { AppSidebar, AppSidebarPanel, SidebarItem } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AppShell({
  title,
  description,
  items,
  children,
  rail,
}: {
  title: string;
  description: string;
  items: SidebarItem[];
  children: React.ReactNode;
  rail?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      <div className="border-b border-white/6 pb-4 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">Workspace</div>
            <div className="mt-1.5 font-display text-lg text-foreground">{title}</div>
          </div>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon-sm" />}>
              <PanelLeft className="size-4" />
              <span className="sr-only">Open navigation</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-xs border-border bg-card p-0 sm:max-w-xs">
              <SheetHeader className="sr-only">
                <SheetTitle>{title}</SheetTitle>
                <SheetDescription>{description}</SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <AppSidebarPanel title={title} description={description} items={items} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-10">
        <AppSidebar
          title={title}
          description={description}
          items={items}
          className="hidden self-start lg:sticky lg:top-[4.5rem] lg:block"
        />
        <div className="min-w-0 space-y-8 lg:border-l lg:border-white/6 lg:pl-10 xl:pl-12">
          <main className="animate-fade-up min-w-0 space-y-8">{children}</main>
          {rail ? <div className="grid gap-6 xl:grid-cols-2">{rail}</div> : null}
        </div>
      </div>
    </div>
  );
}
