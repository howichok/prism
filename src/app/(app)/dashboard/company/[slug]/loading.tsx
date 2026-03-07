import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyHubLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="hidden self-start lg:block">
          <Skeleton className="h-[28rem] rounded-xl bg-secondary" />
        </aside>
        <main className="space-y-6">
          <Skeleton className="h-24 rounded-xl bg-secondary" />
          <Skeleton className="h-[22rem] rounded-xl bg-secondary" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[18rem] rounded-xl bg-secondary" />
            <Skeleton className="h-[18rem] rounded-xl bg-secondary" />
          </div>
        </main>
        <aside className="hidden space-y-4 xl:block">
          <Skeleton className="h-56 rounded-xl bg-secondary" />
          <Skeleton className="h-44 rounded-xl bg-secondary" />
        </aside>
      </div>
    </div>
  );
}
