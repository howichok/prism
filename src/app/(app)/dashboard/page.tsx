import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Compass,
  LockKeyhole,
  Megaphone,
  Shield,
} from "lucide-react";

import { endGuestSessionAction } from "@/actions/session";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { Button } from "@/components/ui/button";
import { getDashboardData, getModerationOverviewData } from "@/lib/data";
import { dashboardSidebarItems, guestDashboardSidebarItems } from "@/lib/navigation";
import { canAccessModeration } from "@/lib/permissions";
import { isGuestViewer, requireAppViewer } from "@/lib/session";

export default async function DashboardPage() {
  const viewer = await requireAppViewer({ onboarded: true });

  if (isGuestViewer(viewer)) {
    return (
      <AppShell
        title="Guest Dashboard"
        description="Preview the PrismMTR workspace without an account."
        items={guestDashboardSidebarItems}
      >
        <PageHeader
          eyebrow="Guest mode"
          title="Explore the PrismMTR workspace"
          description="Browse public companies, identities, and the transit network. Sign in with Discord for full access."
          actions={
            <>
              <Button render={<Link href="/sign-in" />}>
                <Shield className="size-4" />
                Sign in with Discord
              </Button>
              <Button variant="outline" render={<Link href="/discovery" />}>
                <Compass className="size-4" />
                Discovery
              </Button>
              <form action={endGuestSessionAction}>
                <Button type="submit" variant="secondary">
                  Exit guest mode
                </Button>
              </form>
            </>
          }
        />

        {/* Quick links */}
        <div className="motion-stagger grid gap-3 sm:grid-cols-3">
          <Link
            href="/discovery"
            className="group flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4 motion-lift hover:border-white/12 hover:bg-white/[0.04]"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/50">
              <Compass className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white">Discovery</div>
              <div className="mt-0.5 text-xs text-white/40">Browse the public network</div>
            </div>
          </Link>
          <Link
            href="/companies"
            className="group flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4 motion-lift hover:border-white/12 hover:bg-white/[0.04]"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/50">
              <Building2 className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white">Companies</div>
              <div className="mt-0.5 text-xs text-white/40">Inspect public hubs</div>
            </div>
          </Link>
          <Link
            href="/sign-in"
            className="group flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4 motion-lift hover:border-white/12 hover:bg-white/[0.04]"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/50">
              <Shield className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white">Full access</div>
              <div className="mt-0.5 text-xs text-white/40">Sign in with Discord</div>
            </div>
          </Link>
        </div>

        {/* Guest limits */}
        <div className="rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-white/35">
            <LockKeyhole className="size-3.5" />
            Locked until sign-in
          </div>
          <div className="mt-3 grid gap-2 text-sm text-white/40 sm:grid-cols-3">
            <div>Notifications and inbox</div>
            <div>Post creation and editing</div>
            <div>Settings and role actions</div>
          </div>
        </div>
      </AppShell>
    );
  }

  const data = await getDashboardData(viewer.id).catch((error) => {
    console.error("[dashboard] Failed to load dashboard data.", {
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (!data) {
    return (
      <AppShell
        title="Dashboard"
        description="Personal overview, company access, posts, and identity controls."
        items={dashboardSidebarItems}
      >
        <EmptyState
          icon={ClipboardList}
          title="Dashboard is temporarily unavailable"
          description="Your account is online, but the dashboard data request failed. Try again after a refresh."
          action={
            <Button size="sm" render={<Link href="/discovery" />}>
              Open Discovery
            </Button>
          }
        />
      </AppShell>
    );
  }

  const primaryMembership = data.memberships[0] ?? null;
  const companyHubHref = primaryMembership ? `/dashboard/company/${primaryMembership.slug}` : "/dashboard/company/create";
  const staffInbox = canAccessModeration(viewer.siteRole)
    ? await getModerationOverviewData().catch((error) => {
      console.error("[dashboard] Failed to load moderation overview for staff dashboard.", {
        userId: viewer.id,
        error,
      });
      return null;
    })
    : null;
  const pendingModerationCount = staffInbox
    ? staffInbox.companies.length + staffInbox.posts.length + staffInbox.reports.length
    : 0;

  return (
    <AppShell
      title="Dashboard"
      description="Personal overview, company access, posts, and identity controls."
      items={dashboardSidebarItems}
    >
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${viewer.displayName ?? viewer.username ?? "member"}`}
        description="Your workspace for identity, company hubs, and publishing."
        actions={
          <>
            <Button render={<Link href="/dashboard/posts/new" />}>
              <Megaphone className="size-4" />
              Create Post
            </Button>
            {canAccessModeration(viewer.siteRole) ? (
              <Button variant="outline" render={<Link href="/moderation" />}>
                <Shield className="size-4" />
                Staff Inbox
              </Button>
            ) : null}
          </>
        }
      />

      {/* Quick actions */}
      <div className="motion-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href={companyHubHref}
          className="group flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4 motion-lift hover:border-white/12 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Building2 className="size-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                {primaryMembership ? primaryMembership.name : "Create company"}
              </div>
              <div className="text-xs text-white/40">
                {primaryMembership ? "Open company hub" : "Start a new workspace"}
              </div>
            </div>
          </div>
          <ArrowRight className="size-4 text-white/15 transition-colors group-hover:text-white/40" />
        </Link>

        <Link
          href="/dashboard/posts/new"
          className="group flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4 motion-lift hover:border-white/12 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Megaphone className="size-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Post Studio</div>
              <div className="text-xs text-white/40">Draft a new post</div>
            </div>
          </div>
          <ArrowRight className="size-4 text-white/15 transition-colors group-hover:text-white/40" />
        </Link>

        <Link
          href={canAccessModeration(viewer.siteRole) ? "/moderation" : "/dashboard/applications"}
          className="group flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4 motion-lift hover:border-white/12 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              {canAccessModeration(viewer.siteRole) ? <Shield className="size-4" /> : <ClipboardCheck className="size-4" />}
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                {canAccessModeration(viewer.siteRole) ? "Staff Inbox" : "Applications"}
              </div>
              <div className="text-xs text-white/40">
                {canAccessModeration(viewer.siteRole)
                  ? pendingModerationCount ? `${pendingModerationCount} pending` : "No items pending"
                  : "Track requests"}
              </div>
            </div>
          </div>
          <ArrowRight className="size-4 text-white/15 transition-colors group-hover:text-white/40" />
        </Link>
      </div>

      {/* Stats row */}
      <div className="motion-stagger grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-white/35">Memberships</div>
          <div className="mt-1 font-display text-2xl text-white">{data.memberships.length}</div>
        </div>
        <div className="rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-white/35">Notifications</div>
          <div className="mt-1 font-display text-2xl text-white">{data.notifications.length}</div>
        </div>
        <div className="rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-white/35">Posts</div>
          <div className="mt-1 font-display text-2xl text-white">{data.posts.length}</div>
        </div>
        <div className="rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-white/35">Applications</div>
          <div className="mt-1 font-display text-2xl text-white">{data.companyApplications.length}</div>
        </div>
      </div>

      {/* Workspaces */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white/50">My workspaces</h2>
          <Link href="/companies" className="text-xs text-white/30 transition-colors hover:text-white/60">
            Directory
          </Link>
        </div>
        {data.memberships.length ? (
          <div className="space-y-2">
            {data.memberships.map((membership) => (
              <Link
                key={membership.id}
                href={`/dashboard/company/${membership.slug}`}
                className="group flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-5 py-3.5 motion-lift hover:border-white/12 hover:bg-white/[0.04]"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">{membership.name}</div>
                  <div className="mt-0.5 truncate text-xs text-white/40">{membership.description}</div>
                </div>
                <div className="ml-4 flex shrink-0 items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                    {membership.currentRole.replaceAll("_", " ")}
                  </span>
                  <span className="text-xs text-white/25">{membership.counts.members} members</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-white/8 py-8 text-center">
            <ClipboardList className="mb-2 size-5 text-white/20" />
            <div className="text-sm text-white/50">No active memberships</div>
            <Link href="/dashboard/company/create" className="mt-2 text-xs text-blue-400/80 hover:text-blue-400">
              Create a company hub
            </Link>
          </div>
        )}
      </section>

      {/* Recent posts */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white/50">Recent posts</h2>
          <Link href="/dashboard/posts" className="text-xs text-white/30 transition-colors hover:text-white/60">
            All posts
          </Link>
        </div>
        {data.posts.length ? (
          <div className="space-y-2">
            {data.posts.slice(0, 3).map((post) => (
              <div key={post.id} className="rounded-xl border border-white/6 bg-white/[0.02] px-5 py-3.5">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/8 py-8 text-center text-sm text-white/35">
            No posts yet. Create one from the Post Studio.
          </div>
        )}
      </section>
    </AppShell>
  );
}
