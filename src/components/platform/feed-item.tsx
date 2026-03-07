import Link from "next/link";
import { ActivitySquare, BriefcaseBusiness, ClipboardCheck, FolderKanban, ShieldCheck, UserPlus2, UserRoundCog } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { ActivitySummary } from "@/lib/data";
import { formatRelativeTime } from "@/lib/format";

const activityIconMap = {
  MEMBER_JOINED: UserPlus2,
  POST_PUBLISHED: ActivitySquare,
  ROLE_CHANGED: UserRoundCog,
  APPLICATION_REVIEWED: ClipboardCheck,
  PROJECT_CREATED: FolderKanban,
  COMPANY_UPDATED: BriefcaseBusiness,
  BUILD_REQUEST_SUBMITTED: ShieldCheck,
} as const;

export function FeedItem({ item }: { item: ActivitySummary }) {
  const Icon = activityIconMap[item.type as keyof typeof activityIconMap] ?? ActivitySquare;

  return (
    <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {item.actor ? (
            <MiniProfileHoverCard user={item.actor} primaryCompany={item.company}>
              <div className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-secondary px-2 py-1">
                <UserAvatar
                  name={item.actor.displayName}
                  image={item.actor.avatarUrl}
                  accentColor={item.actor.accentColor}
                  size="sm"
                />
                <span className="text-sm font-medium text-foreground">{item.actor.displayName}</span>
              </div>
            </MiniProfileHoverCard>
          ) : null}
          <span className="text-sm text-muted-foreground">{item.title}</span>
          <span className="text-xs text-muted-foreground/60">{formatRelativeTime(item.createdAt)}</span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
        {item.company ? (
          <Link
            href={`/companies/${item.company.slug}`}
            className="mt-2 inline-flex rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.company.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
