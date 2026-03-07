import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="hidden self-start lg:block">
          <div className="rounded-xl border border-border bg-card p-3">
            <Skeleton className="h-8 w-24 bg-secondary" />
            <div className="mt-3 space-y-1.5">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 rounded-lg bg-secondary" />
              ))}
            </div>
          </div>
        </aside>
        <main className="space-y-6">
          <Skeleton className="h-24 rounded-xl bg-secondary" />
          <div className="grid gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-xl bg-secondary" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-xl bg-secondary" />
            ))}
          </div>
        </main>
        <aside className="hidden space-y-4 xl:block">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-xl bg-secondary" />
          ))}
        </aside>
      </div>
    </div>
  );
}
