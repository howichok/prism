import Link from "next/link";
import { ArrowUpRight, CalendarClock, Newspaper } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { PostSummary } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <Newspaper className="size-3.5" />
            {titleCase(post.type)}
          </div>
          <StatusBadge status={post.status} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-start">
          <div className="space-y-3">
            <Link
              href={`/posts/${post.slug}`}
              className="block font-display text-[1.55rem] leading-[0.96] text-foreground transition-colors hover:text-foreground/80 cursor-pointer"
            >
              {post.title}
            </Link>
            <p className="line-clamp-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              {post.excerpt ?? post.content}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[0.65rem] border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground whitespace-nowrap uppercase tracking-[0.18em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-white/5 bg-white/[0.02] p-4 transition-colors group-hover:border-white/10 group-hover:bg-white/[0.04]">
            <div className="panel-label">Surface</div>
            <div className="mt-4 space-y-3 text-sm">
              {post.company ? (
                <Link
                  href={`/companies/${post.company.slug}`}
                  className="flex items-center justify-between rounded-[1rem] border border-white/5 bg-white/[0.02] px-3 py-2.5 text-white/70 transition-colors hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                >
                  <span className="truncate text-xs font-semibold">{post.company.name}</span>
                  <ArrowUpRight className="size-3.5 shrink-0" />
                </Link>
              ) : (
                <div className="rounded-[1rem] border border-white/5 bg-white/[0.01] px-3 py-2.5 text-xs font-medium text-white/40">
                  Independent post
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-[1rem] border border-white/5 bg-white/[0.01] px-3 py-2.5 text-xs text-white/50">
                <CalendarClock className="size-3.5" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-3 border-t border-border/80 pt-4 text-sm text-muted-foreground">
        <MiniProfileHoverCard user={post.author} primaryCompany={post.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-[0.8rem] border border-transparent px-2 py-1.5 transition-colors hover:bg-muted/50">
            <UserAvatar
              name={post.author.displayName}
              image={post.author.avatarUrl}
              accentColor={post.author.accentColor}
              size="sm"
            />
            <span className="text-xs font-medium text-foreground">{post.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
      </div>
    </article>
  );
}
