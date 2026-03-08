import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-white/[0.035] bg-white/[0.035]",
        "before:absolute before:inset-0 before:animate-[skeleton-breathe_2.8s_var(--motion-ease-in-out)_infinite] before:bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.045),transparent_34%)] motion-reduce:before:animate-none",
        "after:absolute after:inset-0 after:-translate-x-full after:will-change-transform after:animate-[shimmer_2.3s_var(--motion-ease-in-out)_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/[0.065] after:to-transparent motion-reduce:after:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
