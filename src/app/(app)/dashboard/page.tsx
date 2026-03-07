import Link from "next/link";
import { ArrowRight, ClipboardList, Compass, Link2, Megaphone, PlusSquare, UserCircle2 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyCard } from "@/components/platform/company-card";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { dashboardSidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const viewer = await requireUser({ onboarded: true });
  const data = await getDashboardData(viewer.id);

  return (
    <AppShell
      title="Dashboard"
      description="Personal overview, company access, posts, and identity controls."
      items={dashboardSidebarItems}
      rail={
        <>
          {/* Notifications */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Notifications</div>
            <div className="mt-3 space-y-2">
              {data.notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{notification.title}</span>
                    {notification.readAt ? null : <span className="size-2 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{notification.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Linked accounts */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Linked accounts</div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              {viewer.linkedAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                  <span>{account.provider}</span>
                  <span className="text-xs text-muted-foreground/60">Connected</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground/60">
                Microsoft linking is future-ready for launcher rollout.
              </p>
            </div>
          </div>

          {/* Pending items */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending</div>
            <div className="mt-3 space-y-2">
              {[
                { label: "Applications", count: data.companyApplications.length },
                { label: "Build requests", count: data.buildRequests.length },
                { label: "Draft posts", count: data.posts.length },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      }
    >
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${viewer.displayName ?? viewer.username ?? "member"}`}
        description="Manage your company spaces, handle workflows, and keep your identity current."
        actions={
          <>
            <Button render={<Link href="/dashboard/posts/new" />}>
              <Megaphone className="size-4" />
              Create Post
            </Button>
            <Button variant="outline" render={<Link href="/dashboard/company/create" />}>
              <PlusSquare className="size-4" />
              Create Company
            </Button>
          </>
        }
      />

      {/* Profile Overview */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex items-start gap-4">
            <UserAvatar
              name={viewer.displayName ?? viewer.username}
              image={viewer.avatarUrl}
              accentColor={viewer.accentColor}
              size="lg"
              className="size-20"
            />
            <div className="space-y-2">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Personal control center</div>
                <div className="mt-1 text-2xl font-semibold text-foreground">@{viewer.username ?? "member"}</div>
              </div>
              <p className="max-w-lg text-sm text-muted-foreground">
                Your Discord-first identity, company memberships, posts, and linked accounts in one place.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {viewer.companyMemberships.slice(0, 3).map((membership) => (
                  <Link
                    key={membership.id}
                    href={`/dashboard/company/${membership.company.slug}`}
                    className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {membership.company.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { href: "/dashboard/profile", icon: UserCircle2, label: "Update profile", body: "Keep your public identity current." },
              { href: "/companies", icon: Compass, label: "Browse companies", body: "Find recruiting and active hubs." },
              { href: "/dashboard/settings", icon: Link2, label: "Linked accounts", body: "Manage Discord and future integrations." },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-center justify-between rounded-lg bg-muted/30 p-3 transition-colors hover:bg-secondary">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.body}</div>
                  </div>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Companies", value: data.memberships.length },
          { label: "Posts", value: data.posts.length },
          { label: "Requests", value: data.buildRequests.length },
          { label: "Notifications", value: data.notifications.length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Companies + Workflows side by side */}
      <div className="grid gap-6 2xl:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">My companies</h2>
            <Button variant="outline" size="sm" render={<Link href="/companies" />}>
              <Compass className="size-3.5" />
              Browse
            </Button>
          </div>
          {data.memberships.length ? (
            <div className="grid gap-3">
              {data.memberships.map((membership) => (
                <CompanyCard key={membership.id} company={membership} href={`/dashboard/company/${membership.slug}`} compact />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No company memberships"
              description="Create a company, redeem an invite, or browse discovery."
              action={<Button size="sm" render={<Link href="/dashboard/company/create" />}>Create Company</Button>}
            />
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Pending workflows</h2>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/applications" />}>
              Applications
            </Button>
          </div>
          <div className="space-y-2">
            {data.companyApplications.length ? (
              data.companyApplications.map((application) => (
                <div key={application.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Company application</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">{application.company.name}</div>
                      <p className="mt-1.5 text-xs text-muted-foreground">{application.message}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                No pending applications.
              </div>
            )}
            {data.buildRequests.slice(0, 2).map((request) => (
              <div key={request.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Build request</div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{request.title}</div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{request.description}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent posts */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent posts</h2>
          <span className="text-xs text-muted-foreground">Updated {formatDate(new Date())}</span>
        </div>
        {data.posts.length ? (
          <div className="space-y-3">
            {data.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            No authored posts yet. Start with a post from the dashboard.
          </div>
        )}
      </section>
    </AppShell>
  );
}
