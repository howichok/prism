import { cn } from "@/lib/utils"

import { Skeleton } from "@/components/ui/skeleton"

type LoadingFrameProps = {
  children: React.ReactNode
  className?: string
  maxWidthClassName?: string
  paddingClassName?: string
}

export function LoadingFrame({
  children,
  className,
  maxWidthClassName = "max-w-[1440px]",
  paddingClassName = "px-4 py-6 sm:px-6 lg:px-8",
}: LoadingFrameProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col gap-6 animate-fade-in",
        maxWidthClassName,
        paddingClassName,
        className,
      )}
    >
      {children}
    </div>
  )
}

export function LoadingWorkspaceGrid({
  children,
  className,
  withAside = false,
}: {
  children: React.ReactNode
  className?: string
  withAside?: boolean
}) {
  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]",
        withAside && "xl:grid-cols-[260px_minmax(0,1fr)_300px]",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function LoadingSidebar({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <aside className={cn("hidden self-start lg:block", className)}>{children}</aside>
}

export function LoadingMain({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <main className={cn("space-y-6", className)}>{children}</main>
}

export function LoadingAside({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <aside className={cn("hidden space-y-4 xl:block", className)}>{children}</aside>
}

export function LoadingRevealList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("loading-reveal-list", className)}>{children}</div>
}

export function LoadingBlock({
  className,
}: {
  className?: string
}) {
  return <Skeleton className={cn("rounded-[1rem]", className)} />
}

export function LoadingRail({
  className,
  navCount = 6,
}: {
  className?: string
  navCount?: number
}) {
  return (
    <div className={cn("surface-panel-strong p-3", className)}>
      <LoadingBlock className="h-8 w-28 rounded-lg" />
      <LoadingRevealList className="mt-3 space-y-1.5">
        {Array.from({ length: navCount }).map((_, index) => (
          <LoadingBlock key={index} className="h-10 rounded-lg" />
        ))}
      </LoadingRevealList>
    </div>
  )
}

export function LoadingGrid({
  count,
  className,
  itemClassName,
}: {
  count: number
  className?: string
  itemClassName: string
}) {
  return (
    <LoadingRevealList className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingBlock key={index} className={itemClassName} />
      ))}
    </LoadingRevealList>
  )
}

export function LoadingChipRow({
  count,
  className,
  itemClassName = "h-9 w-24 rounded-full",
}: {
  count: number
  className?: string
  itemClassName?: string
}) {
  return (
    <LoadingGrid
      count={count}
      className={cn("flex gap-2", className)}
      itemClassName={itemClassName}
    />
  )
}
