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
    <div
      className={cn(
        "surface-panel-strong relative overflow-hidden p-6 sm:p-7",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-32 before:bg-[radial-gradient(circle_at_top_left,rgba(85,212,255,0.16),transparent_56%)] before:content-['']",
        className,
      )}
    >
      {eyebrow ? (
        <div className="inline-flex items-center rounded-full border border-cyan-400/18 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
          {eyebrow}
        </div>
      ) : null}
      <div className="relative mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-[2.3rem]">{title}</h1>
          <p className="max-w-3xl text-sm leading-7 text-white/64 sm:text-[0.98rem]">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div> : null}
      </div>
    </div>
  );
}
