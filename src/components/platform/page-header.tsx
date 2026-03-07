import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4 border-b border-white/8 pb-5", className)}>
      {eyebrow ? (
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary/28" />
          <div className="panel-label">{eyebrow}</div>
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,auto)] lg:items-end">
        <div className="space-y-3">
          <h1 className="max-w-4xl font-display text-[2rem] leading-[0.94] text-foreground sm:text-[2.35rem] xl:text-[2.7rem]">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2 lg:justify-end lg:self-start">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
