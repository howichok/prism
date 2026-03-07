import Link from "next/link";
import { AlertTriangle } from "lucide-react";

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
    <div className={cn("surface-panel-strong flex flex-col items-center p-10 text-center", className)}>
      <div className="mb-5 flex size-14 items-center justify-center rounded-[1.25rem] border border-destructive/18 bg-destructive/10">
        <AlertTriangle className="size-5 text-destructive" />
      </div>
      <div className="panel-label text-destructive/70">Data unavailable</div>
      <h2 className="mt-3 font-display text-2xl text-white">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
      <Link href="/" className="mt-5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
        Return home
      </Link>
    </div>
  );
}
