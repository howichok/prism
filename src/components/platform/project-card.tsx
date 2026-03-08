import Link from "next/link";
import { ArrowUpRight, DraftingCompass } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { ProjectSummary } from "@/lib/data";
import { titleCase } from "@/lib/format";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <div className="group rounded-xl border border-white/6 bg-white/[0.02] p-5 motion-lift hover:border-white/12 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-white/35">
              <DraftingCompass className="size-3" />
              {titleCase(project.type)}
            </span>
            <StatusBadge status={project.status} />
          </div>
          <h3 className="font-display text-lg leading-tight text-white">{project.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-white/40">{project.description}</p>
        </div>
      </div>

      {project.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/6 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-white/30"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
        <MiniProfileHoverCard user={project.author} primaryCompany={project.company}>
          <div className="inline-flex cursor-pointer items-center gap-2">
            <UserAvatar
              name={project.author.displayName}
              image={project.author.avatarUrl}
              accentColor={project.author.accentColor}
              size="sm"
            />
            <span className="text-xs font-medium text-white/60">{project.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>

        <Link
          href={`/companies/${project.company.slug}`}
          className="inline-flex items-center gap-1 text-xs text-white/30 transition-colors hover:text-white/60"
        >
          {project.company.name}
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
