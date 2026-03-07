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
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="lg:hidden">
        <div className="surface-panel-strong flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <div className="panel-label">Workspace</div>
            <div className="mt-2 font-display text-2xl font-semibold text-white">{title}</div>
            <p className="mt-1 text-sm text-white/56">{description}</p>
          </div>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon-sm" className="border-white/10 bg-white/6 text-white hover:bg-white/10" />}>
              <PanelLeft className="size-4" />
              <span className="sr-only">Open workspace navigation</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm border-white/10 bg-[#050b16]/98 p-0 sm:max-w-sm">
              <SheetHeader className="sr-only">
                <SheetTitle>{title}</SheetTitle>
                <SheetDescription>{description}</SheetDescription>
              </SheetHeader>
              <AppSidebarPanel title={title} description={description} items={items} className="h-full rounded-none border-0 bg-transparent p-4 shadow-none" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <AppSidebar title={title} description={description} items={items} className="hidden self-start lg:sticky lg:top-24 lg:block" />
        <main className="min-w-0 space-y-6">{children}</main>
        {rail ? <aside className="space-y-6 xl:sticky xl:top-24 xl:block">{rail}</aside> : null}
      </div>
      {rail ? <div className="space-y-6 xl:hidden">{rail}</div> : null}
    </div>
  );
}
