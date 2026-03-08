import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Compass,
  Link2,
  LockKeyhole,
  Megaphone,
  PlusSquare,
  Shield,
  UserCircle2,
} from "lucide-react";

import { endGuestSessionAction } from "@/actions/session";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { StatusBadge } from "@/components/platform/status-badge";
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
        description="A local workspace tour for exploring PrismMTR without a linked account."
        items={guestDashboardSidebarItems}
      >
        <PageHeader
          eyebrow="Guest mode"
          title="Explore the PrismMTR workspace locally"
          description="A safe environment to explore public companies, identities, and the transit network without a linked account."
          actions={
            <>
              <Button render={<Link href="/sign-in" />}>
                <Shield className="size-4" />
                Sign in with Discord
              </Button>
              <Button variant="outline" render={<Link href="/discovery" />}>
                <Compass className="size-4" />
                Open discovery
              </Button>
              <form action={endGuestSessionAction}>
                <Button type="submit" variant="secondary">
                  Exit guest mode
                </Button>
              </form>
            </>
          }
        />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Main Hero Bento (Spans 2 cols, 2 rows) */}
          <Link
            href="/discovery"
            className="group relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] md:col-span-2 md:row-span-2"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 inline-flex size-14 items-center justify-center rounded-[1.2rem] border border-blue-400/20 bg-blue-400/10 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/30 transition-transform duration-500 group-hover:scale-110">
              <Compass className="size-6" />
            </div>

            <div className="relative z-10 mt-8">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400/80">Primary Route</div>
              <h2 className="mt-3 font-display text-3xl leading-none text-white transition-colors duration-300 group-hover:text-blue-50 sm:text-4xl">Inspect the public network</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground transition-colors duration-300 group-hover:text-white/80">
                Discovery, public companies, member identity surfaces, and publishing remain fully visible in guest mode. Your local exploration does not affect the actual environment.
              </p>
            </div>
            <ArrowRight className="absolute bottom-8 right-8 size-6 text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white/60" />
          </Link>

          {/* Boundaries Bento (Spans 1 col, 2 rows) */}
          <div className="relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm md:row-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/60">
                <Shield className="size-4.5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Guest Limits</div>
            </div>
            <div className="flex flex-1 flex-col justify-center space-y-5">
              {[
                "Local-only exploration without an account.",
                "Post creation, editing, and config stay locked.",
                "Meaningful access to real workspace data.",
              ].map((line, i) => (
                <div key={i} className="relative pl-5 text-[13px] leading-relaxed text-muted-foreground">
                  <span className="absolute left-0 top-2 size-1.5 rounded-full bg-blue-500/30 ring-2 ring-blue-500/10" />
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Action Bentos (Square) */}
          {[
            {
              href: "/companies",
              title: "Open companies",
              body: "Inspect recruiting hubs and details.",
              icon: PlusSquare,
            },
            {
              href: "/sign-in",
              title: "Upgrade to account",
              body: "Unlock posting and linked identity.",
              icon: Shield,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex size-11 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-white/70 transition-colors duration-300 group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-white">
                <item.icon className="size-5" />
              </div>

              <div className="relative z-10 mt-6">
                <h3 className="font-display text-xl text-white transition-colors group-hover:text-blue-100">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Link>
          ))}

          {/* Surface & Locked Wide Bentos (Span 2 cols) */}
          <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-8 backdrop-blur-sm md:col-span-2 xl:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/60">
                <Compass className="size-4.5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Live Product Surfaces</div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { title: "Discovery", body: "Search the network and view projects.", icon: Compass },
                { title: "Companies", body: "Inspect leadership and public pages.", icon: Building2 },
                { title: "Identity", body: "Hover mini profiles & public members.", icon: UserCircle2 },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                    <item.icon className="size-4 text-primary/60" />
                    {item.title}
                  </div>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-8 backdrop-blur-sm md:col-span-2 xl:col-span-2">
            <div className="mb-6 flex items-center gap-3 opacity-60">
              <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/60">
                <LockKeyhole className="size-4.5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Locked until sign-in</div>
            </div>
            <div className="grid gap-6 opacity-60 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100 md:grid-cols-2">
              {[
                { title: "Notifications", body: "Personal workflow requires an account.", icon: Bell },
                { title: "Post studio", body: "Drafts and publishing stay disabled.", icon: Megaphone },
                { title: "Control", body: "Settings and role actions are locked.", icon: Shield },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                    <item.icon className="size-4" />
                    {item.title}
                  </div>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
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
  const companyHubTitle = primaryMembership ? `Open ${primaryMembership.name}` : "Create company hub";
  const companyHubBody = primaryMembership
    ? "Jump straight into your primary company workspace, roster, and publishing flow."
    : "Start a new company workspace and send it into review.";
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
        description="Your personal control panel for identity, network access, and publishing."
        actions={
          <>
            <Button variant="outline" render={<Link href={companyHubHref} />}>
              <Compass className="size-4" />
              {primaryMembership ? "Open Company Hub" : "Create Company Hub"}
            </Button>
            <Button render={<Link href="/dashboard/posts/new" />}>
              <Megaphone className="size-4" />
              Create Post
            </Button>
            {canAccessModeration(viewer.siteRole) ? (
              <Button variant="outline" render={<Link href="/moderation" />}>
                <Shield className="size-4" />
                Staff Inbox
              </Button>
            ) : (
              <Button variant="outline" render={<Link href="/dashboard/company/create" />}>
                <PlusSquare className="size-4" />
                Create Company
              </Button>
            )}
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Main Hero Bento (Primary Company Hub) */}
        <Link
          href={companyHubHref}
          className="group relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] md:col-span-2 lg:row-span-2"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10 inline-flex size-14 items-center justify-center rounded-[1.2rem] border border-blue-400/20 bg-blue-400/10 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/30 transition-transform duration-500 group-hover:scale-110">
            <Compass className="size-6" />
          </div>

          <div className="relative z-10 mt-8">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400/80">Primary Hub</div>
            <h2 className="mt-3 font-display text-3xl leading-none text-white transition-colors duration-300 group-hover:text-blue-50 sm:text-4xl">{companyHubTitle}</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground transition-colors duration-300 group-hover:text-white/80">
              {companyHubBody}
            </p>
          </div>
          <ArrowRight className="absolute bottom-8 right-8 size-6 text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white/60" />
        </Link>

        {/* Action Bentos */}
        <Link
          href="/dashboard/posts/new"
          className="group relative flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex size-11 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-white/70 transition-colors duration-300 group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-amber-300">
            <Megaphone className="size-5" />
          </div>
          <div className="relative z-10 mt-6">
            <h3 className="font-display text-xl text-white transition-colors group-hover:text-amber-100">Post Studio</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">Draft and publish network announcements.</p>
          </div>
        </Link>

        <Link
          href={canAccessModeration(viewer.siteRole) ? "/moderation" : "/dashboard/applications"}
          className="group relative flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex size-11 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-white/70 transition-colors duration-300 group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-emerald-300">
            {canAccessModeration(viewer.siteRole) ? <Shield className="size-5" /> : <ClipboardCheck className="size-5" />}
          </div>
          <div className="relative z-10 mt-6">
            <h3 className="font-display text-xl text-white transition-colors group-hover:text-emerald-100">
              {canAccessModeration(viewer.siteRole) ? "Staff Inbox" : "Applications"}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {canAccessModeration(viewer.siteRole)
                ? pendingModerationCount
                  ? `${pendingModerationCount} item(s) need attention.`
                  : "No urgent approvals waiting."
                : "Track requests and pending workflow."}
            </p>
          </div>
        </Link>

        {/* Metric Square Bentos */}
        <div className="flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Memberships</div>
            <Building2 className="size-4 text-white/40" />
          </div>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="font-display text-5xl leading-none text-white">{data.memberships.length}</div>
            <div className="text-right text-xs leading-5 text-muted-foreground">Active<br />hubs</div>
          </div>
        </div>

        <div className="flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Notifications</div>
            <Bell className="size-4 text-white/40" />
          </div>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="font-display text-5xl leading-none text-white">{data.notifications.length}</div>
            <div className="text-right text-xs leading-5 text-muted-foreground">Unread<br />alerts</div>
          </div>
        </div>

        {/* Wide Content List Bento: My Companies / Pending (Spans 2 cols) */}
        <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-8 backdrop-blur-sm md:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/60">
                <Building2 className="size-4.5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">My Workspaces</div>
            </div>
            <Link href="/companies" className="text-xs font-medium text-white/50 transition-colors hover:text-white">Directory &rarr;</Link>
          </div>

          <div className="flex flex-col space-y-3">
            {data.memberships.length ? (
              data.memberships.map((membership) => (
                <Link
                  key={membership.id}
                  href={`/dashboard/company/${membership.slug}`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-white/5 bg-white/[0.01] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white/90 transition-colors group-hover:text-blue-100">{membership.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground truncate">{membership.description}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                      {membership.currentRole.replaceAll("_", " ")}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {membership.counts.members} members
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-8 text-center">
                <ClipboardList className="mb-2 size-6 text-white/20" />
                <div className="text-sm font-medium text-white/70">No active memberships</div>
                <Link href="/dashboard/company/create" className="mt-2 text-xs text-primary/80 hover:text-primary">Create a company hub</Link>
              </div>
            )}
          </div>
        </div>

        {/* Wide Content Box: Publishing (Spans 2 cols) */}
        <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-8 backdrop-blur-sm md:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/60">
                <Megaphone className="size-4.5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Recent Publishing</div>
            </div>
            <Link href="/dashboard/posts" className="text-xs font-medium text-white/50 transition-colors hover:text-white">All posts &rarr;</Link>
          </div>

          {data.posts.length ? (
            <div className="space-y-3">
              {data.posts.slice(0, 2).map((post) => (
                <div key={post.id} className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.01] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-8 text-center text-sm text-white/40">
              No authored posts yet. Start with a post from the dashboard.
            </div>
          )}
        </div>

      </section>
    </AppShell>
  );
}
