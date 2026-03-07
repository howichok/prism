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
    <div className="surface-panel p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/58">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
