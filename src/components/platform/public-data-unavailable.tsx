import Link from "next/link";
import { cn } from "@/lib/utils";

export function PublicDataUnavailable({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center", className)}>
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-destructive/10">
        <span className="text-lg">⚠</span>
      </div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground">{description}</p>
      <Link href="/" className="mt-4 text-sm font-medium text-primary transition-colors hover:text-primary/80">
        Return home
      </Link>
    </div>
  );
}
