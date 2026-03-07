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
    <div className="surface-panel-soft flex gap-4 p-4">
      <div className="mt-1 flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {item.actor ? (
            <MiniProfileHoverCard user={item.actor} primaryCompany={item.company}>
              <div className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/6 px-2.5 py-1">
                <UserAvatar
                  name={item.actor.displayName}
                  image={item.actor.avatarUrl}
                  accentColor={item.actor.accentColor}
                  size="sm"
                />
                <span className="text-sm text-white">{item.actor.displayName}</span>
              </div>
            </MiniProfileHoverCard>
          ) : null}
          <span className="text-sm text-white/72">{item.title}</span>
          <span className="text-xs uppercase tracking-[0.18em] text-white/42">{formatRelativeTime(item.createdAt)}</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
        {item.company ? (
          <Link
            href={`/companies/${item.company.slug}`}
            className="mt-3 inline-flex rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/58 transition hover:text-white"
          >
            {item.company.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
