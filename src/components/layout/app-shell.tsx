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
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="lg:hidden">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
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
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <AppSidebar title={title} description={description} items={items} className="hidden self-start lg:sticky lg:top-20 lg:block" />
        <main className="min-w-0 space-y-6">{children}</main>
        {rail ? <aside className="space-y-6 xl:sticky xl:top-20 xl:block">{rail}</aside> : null}
      </div>
      {rail ? <div className="space-y-6 xl:hidden">{rail}</div> : null}
    </div>
  );
}
