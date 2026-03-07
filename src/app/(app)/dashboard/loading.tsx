import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <aside className="hidden self-start lg:block">
          <div className="surface-panel p-4">
            <Skeleton className="h-8 w-28 bg-white/10" />
            <Skeleton className="mt-3 h-20 rounded-[1.6rem] bg-white/8" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 rounded-[1.35rem] bg-white/8" />
              ))}
            </div>
          </div>
        </aside>
        <main className="space-y-6">
          <div className="surface-panel-strong p-6">
            <Skeleton className="h-5 w-24 bg-white/10" />
            <Skeleton className="mt-4 h-12 w-2/3 bg-white/10" />
            <Skeleton className="mt-3 h-20 bg-white/8" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="surface-panel p-5">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="mt-4 h-10 w-16 bg-white/8" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-52 rounded-[1.8rem] bg-white/8" />
            ))}
          </div>
        </main>
        <aside className="hidden space-y-6 xl:block">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-[1.8rem] bg-white/8" />
          ))}
        </aside>
      </div>
    </div>
  );
}
