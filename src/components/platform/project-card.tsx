import Link from "next/link";
import { ArrowUpRight, DraftingCompass, Map } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { ProjectSummary } from "@/lib/data";
import { titleCase } from "@/lib/format";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <DraftingCompass className="size-3.5" />
            {titleCase(project.type)}
          </div>
          <h3 className="font-display text-[1.45rem] leading-[0.96] text-foreground">{project.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[0.65rem] border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground whitespace-nowrap uppercase tracking-[0.18em]"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/companies/${project.company.slug}`}
          className="inline-flex items-center gap-2 rounded-[0.8rem] border border-white/8 bg-white/[0.03] px-3 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-white/14 hover:text-foreground"
        >
          <Map className="size-3.5" />
          {project.company.name}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
        <MiniProfileHoverCard user={project.author} primaryCompany={project.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-[1rem] border border-transparent px-2 py-1.5 transition-colors hover:bg-white/[0.04]">
            <UserAvatar
              name={project.author.displayName}
              image={project.author.avatarUrl}
              accentColor={project.author.accentColor}
              size="sm"
            />
            <span className="text-xs font-medium text-white/80">{project.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        <div className="rounded-[1rem] border border-white/5 bg-white/[0.02] px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white/50">
          Active infrastructure
        </div>
      </div>
    </div>
  );
}
