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
    <div className={cn("relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center p-7 text-center sm:p-8", className)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-100" />
      <div className="relative mb-4 flex size-12 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.035]">
        <Icon className="size-4.5 text-blue-200/58" />
      </div>
      <div className="panel-label">No result</div>
      <h3 className="mt-3 font-display text-[1.55rem] leading-none text-white">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
