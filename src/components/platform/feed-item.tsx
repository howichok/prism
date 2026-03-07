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
    <div className="group flex gap-3 rounded-[0.95rem] border border-border/80 bg-card/80 p-3.5 transition-colors hover:border-primary/16">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[0.8rem] border border-white/6 bg-white/[0.03] text-primary">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {item.actor ? (
            <MiniProfileHoverCard user={item.actor} primaryCompany={item.company}>
              <div className="inline-flex cursor-pointer items-center gap-1.5 rounded-[0.75rem] border border-white/6 bg-white/[0.03] px-2 py-1.5 transition-colors hover:border-primary/16">
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
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">{formatRelativeTime(item.createdAt)}</span>
        </div>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
        {item.company ? (
          <Link
            href={`/companies/${item.company.slug}`}
            className="mt-3 inline-flex rounded-[0.75rem] border border-white/6 bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/16 hover:text-foreground"
          >
            {item.company.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
