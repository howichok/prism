import Link from "next/link";
import { DraftingCompass, Eye, Map } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { ProjectSummary } from "@/lib/data";
import { titleCase } from "@/lib/format";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <div className="surface-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-cyan-200/72">
            <DraftingCompass className="size-4" />
            <span className="text-xs uppercase tracking-[0.24em]">{project.type.replaceAll("_", " ")}</span>
          </div>
          <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
          <p className="mt-2 text-sm leading-7 text-white/62">{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/58">
        <Link href={`/companies/${project.company.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-2.5 py-1.5 transition hover:text-white">
          <Map className="size-4" />
          {project.company.name}
        </Link>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
          <Eye className="size-3.5" />
          {titleCase(project.visibility)}
        </span>
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5 border-t border-white/8 pt-4">
        <MiniProfileHoverCard user={project.author} primaryCompany={project.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/6 px-2.5 py-1.5">
            <UserAvatar name={project.author.displayName} image={project.author.avatarUrl} accentColor={project.author.accentColor} size="sm" />
            <span className="text-sm text-white/66">{project.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
      </div>
    </div>
  );
}
