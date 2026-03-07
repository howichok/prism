import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("surface-panel flex flex-col items-center p-10 text-center", className)}>
      <div className="mb-5 flex size-14 items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/[0.04]">
        <Icon className="size-5 text-blue-200/62" />
      </div>
      <div className="panel-label">No result</div>
      <h3 className="mt-3 font-display text-2xl text-white">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
