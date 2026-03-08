import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/[0.04]",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.8s_var(--motion-ease-in-out)_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/[0.07] after:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
