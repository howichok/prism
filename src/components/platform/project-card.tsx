import Link from "next/link";
import { DraftingCompass, Map } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { ProjectSummary } from "@/lib/data";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2 text-xs text-primary">
            <DraftingCompass className="size-3.5" />
            <span className="font-medium">{project.type.replaceAll("_", " ")}</span>
          </div>
          <h3 className="text-base font-semibold text-foreground">{project.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link href={`/companies/${project.company.slug}`} className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 transition-colors hover:text-foreground">
          <Map className="size-3.5" />
          {project.company.name}
        </Link>
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-secondary px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 border-t border-border pt-3">
        <MiniProfileHoverCard user={project.author} primaryCompany={project.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-2 py-1">
            <UserAvatar name={project.author.displayName} image={project.author.avatarUrl} accentColor={project.author.accentColor} size="sm" />
            <span className="text-xs font-medium text-foreground">{project.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
      </div>
    </div>
  );
}
