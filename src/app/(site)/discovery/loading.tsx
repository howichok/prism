import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoveryLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
      <div className="surface-panel-strong p-6">
        <Skeleton className="h-5 w-28 bg-white/10" />
        <Skeleton className="mt-4 h-12 w-1/2 bg-white/10" />
        <Skeleton className="mt-3 h-16 bg-white/8" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-[1.8rem] bg-white/8" />
          ))}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-72 rounded-[2rem] bg-white/8" />
          <div className="grid gap-4 2xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-72 rounded-[1.8rem] bg-white/8" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
