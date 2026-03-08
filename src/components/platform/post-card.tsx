import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { PostSummary } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group rounded-xl border border-white/6 bg-white/[0.02] p-5 motion-lift hover:border-white/12 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-white/35">
              <Newspaper className="size-3" />
              {titleCase(post.type)}
            </span>
            <StatusBadge status={post.status} />
          </div>

          <Link
            href={`/posts/${post.slug}`}
            className="block font-display text-lg leading-tight text-white transition-colors hover:text-white/80"
          >
            {post.title}
          </Link>

          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-white/40">
            {post.excerpt ?? post.content}
          </p>

          {post.tags.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/6 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {post.company ? (
          <Link
            href={`/companies/${post.company.slug}`}
            className="hidden shrink-0 items-center gap-1 rounded-lg border border-white/6 bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:border-white/12 hover:text-white/60 sm:flex"
          >
            {post.company.name}
            <ArrowUpRight className="size-3" />
          </Link>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
        <MiniProfileHoverCard user={post.author} primaryCompany={post.company}>
          <div className="inline-flex cursor-pointer items-center gap-2">
            <UserAvatar
              name={post.author.displayName}
              image={post.author.avatarUrl}
              accentColor={post.author.accentColor}
              size="sm"
            />
            <span className="text-xs font-medium text-white/60">{post.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        <span className="text-xs text-white/20">{formatDate(post.createdAt)}</span>
      </div>
    </article>
  );
}
