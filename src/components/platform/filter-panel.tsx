export function FilterPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-panel space-y-5 p-5">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="h-px w-7 bg-white/12" />
          <div className="panel-label">{title}</div>
        </div>
        <div>
          <h3 className="font-display text-[1.45rem] leading-[0.95] text-white">{title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
