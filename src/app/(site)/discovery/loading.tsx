import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoveryLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-24 rounded-xl bg-secondary" />
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-xl bg-secondary" />
          ))}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 rounded-xl bg-secondary" />
          <div className="grid gap-4 2xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-56 rounded-xl bg-secondary" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
