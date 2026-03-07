import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyHubLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <aside className="hidden self-start lg:block">
          <Skeleton className="h-[34rem] rounded-[2rem] bg-white/8" />
        </aside>
        <main className="space-y-6">
          <Skeleton className="h-40 rounded-[2rem] bg-white/8" />
          <Skeleton className="h-[28rem] rounded-[2rem] bg-white/8" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[24rem] rounded-[2rem] bg-white/8" />
            <Skeleton className="h-[24rem] rounded-[2rem] bg-white/8" />
          </div>
        </main>
        <aside className="hidden space-y-6 xl:block">
          <Skeleton className="h-72 rounded-[2rem] bg-white/8" />
          <Skeleton className="h-56 rounded-[2rem] bg-white/8" />
        </aside>
      </div>
    </div>
  );
}
