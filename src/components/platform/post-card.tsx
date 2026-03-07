import Link from "next/link";
import { CalendarClock, Newspaper } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { PostSummary } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-primary">
          <Newspaper className="size-3.5" />
          <span className="font-medium">{post.type.replaceAll("_", " ")}</span>
        </div>
        <Link href={`/posts/${post.slug}`} className="block text-lg font-semibold text-foreground transition-colors hover:text-primary">
          {post.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt ?? post.content}</p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={post.status} />
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
        <MiniProfileHoverCard user={post.author} primaryCompany={post.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-2 py-1">
            <UserAvatar name={post.author.displayName} image={post.author.avatarUrl} accentColor={post.author.accentColor} size="sm" />
            <span className="text-xs font-medium text-foreground">{post.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        {post.company ? (
          <Link href={`/companies/${post.company.slug}`} className="rounded-md bg-secondary px-2 py-1 text-xs transition-colors hover:text-foreground">
            {post.company.name}
          </Link>
        ) : null}
        <div className="inline-flex items-center gap-1.5 text-xs">
          <CalendarClock className="size-3.5" />
          {formatDate(post.createdAt)}
        </div>
      </div>
    </article>
  );
}
