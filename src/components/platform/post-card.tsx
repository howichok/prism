import Link from "next/link";
import { CalendarClock, Eye, Newspaper } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { PostSummary } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="surface-panel p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-200/72">
            <Newspaper className="size-4" />
            <span className="text-xs uppercase tracking-[0.24em]">{post.type.replaceAll("_", " ")}</span>
          </div>
          <Link href={`/posts/${post.slug}`} className="font-display text-2xl font-semibold text-white transition hover:text-cyan-100">
            {post.title}
          </Link>
          <p className="max-w-3xl text-sm leading-7 text-white/62">{post.excerpt ?? post.content}</p>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={post.status} />
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
              <Eye className="size-3.5" />
              {titleCase(post.visibility)}
            </span>
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/8 pt-5 text-sm text-white/56">
        <MiniProfileHoverCard user={post.author} primaryCompany={post.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/6 px-2.5 py-1.5">
            <UserAvatar name={post.author.displayName} image={post.author.avatarUrl} accentColor={post.author.accentColor} size="sm" />
            <span>{post.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        {post.company ? (
          <Link href={`/companies/${post.company.slug}`} className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1.5 text-white/65 transition hover:text-white">
            {post.company.name}
          </Link>
        ) : null}
        <div className="inline-flex items-center gap-2">
          <CalendarClock className="size-4" />
          {formatDate(post.createdAt)}
        </div>
      </div>
    </article>
  );
}
