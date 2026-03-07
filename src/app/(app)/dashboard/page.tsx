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

  return (
    <AppShell
      title="Dashboard"
      description="Personal overview, company access, posts, and identity controls."
      items={dashboardSidebarItems}
      rail={
        <>
          <div className="surface-panel p-4">
            <div className="panel-label">Signal inbox</div>
            <div className="mt-3 space-y-2">
              {data.notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{notification.title}</span>
                    {notification.readAt ? null : <span className="size-2 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{notification.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-4">
            <div className="panel-label">Identity readiness</div>
            <div className="mt-4 grid gap-2">
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3.5 py-3 text-sm">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Minecraft name</div>
                <div className="mt-2 text-white">{viewer.minecraftNickname ?? "Not set yet"}</div>
              </div>
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3.5 py-3 text-sm">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Linked surfaces</div>
                <div className="mt-2 text-white">{viewer.linkedAccounts.length} connected</div>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              {viewer.linkedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-2.5"
                >
                  <span>{account.provider}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/44">Connected</span>
                </div>
              ))}
              <p className="text-xs leading-6 text-muted-foreground/70">
                Microsoft linking is future-ready for launcher rollout.
              </p>
            </div>
          </div>

          <div className="surface-panel p-4">
            <div className="panel-label">Pending load</div>
            <div className="mt-3 space-y-2">
              {[
                { label: "Applications", count: data.companyApplications.length },
                { label: "Build requests", count: data.buildRequests.length },
                { label: "Draft posts", count: data.posts.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      }
    >
      <PageHeader
        eyebrow="Dashboard"
        title={`Your operating center, ${viewer.displayName ?? viewer.username ?? "member"}`}
        description="Keep identity, memberships, posts, and company workflows in one workspace instead of bouncing between isolated pages."
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

      <div className="surface-panel-strong overflow-hidden p-0">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <UserAvatar
                name={viewer.displayName ?? viewer.username}
                image={viewer.avatarUrl}
                accentColor={viewer.accentColor}
                size="lg"
                className="size-20"
              />
              <div className="space-y-3">
                <div>
                  <div className="panel-label">Personal control center</div>
                  <div className="mt-3 font-display text-[2.2rem] leading-[0.95] text-white">
                    {viewer.displayName ?? viewer.username ?? "Prism member"}
                  </div>
                  <div className="mt-2 text-sm uppercase tracking-[0.2em] text-white/42">@{viewer.username ?? "member"}</div>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  Your Discord-first identity, company memberships, authored posts, and launcher readiness signals live here in one operational view.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Memberships", value: data.memberships.length, body: "Company spaces you can enter right now." },
                { label: "Notifications", value: data.notifications.length, body: "Signals waiting for review or action." },
                { label: "Open requests", value: data.buildRequests.length, body: "Needs and workflows still in flight." },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.2rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{item.label}</div>
                  <div className="mt-3 font-display text-[2rem] leading-none text-white">{item.value}</div>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {viewer.companyMemberships.slice(0, 4).map((membership) => (
                <Link
                  key={membership.id}
                  href={`/dashboard/company/${membership.company.slug}`}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white/14 hover:text-white"
                >
                  {membership.company.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/8 bg-[hsl(0_0%_5%)]/94 p-6 xl:border-l xl:border-t-0">
            <div className="panel-label">Quick routes</div>
            <div className="mt-4 space-y-2">
              {[
                { href: "/dashboard/profile", icon: UserCircle2, label: "Update profile", body: "Refine your public identity and presentation." },
                { href: "/companies", icon: Compass, label: "Browse companies", body: "Scan recruiting and active company hubs." },
                { href: "/dashboard/settings", icon: Link2, label: "Linked accounts", body: "Keep Discord and future launcher surfaces aligned." },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-3.5 transition-colors hover:border-white/14 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-[0.95rem] border border-blue-400/14 bg-blue-400/[0.08] text-blue-200">
                      <item.icon className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.label}</div>
                      <div className="text-xs leading-6 text-muted-foreground">{item.body}</div>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Launcher readiness</div>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Minecraft nickname</span>
                  <span className="font-medium text-white">{viewer.minecraftNickname ? "Ready" : "Missing"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discord linked</span>
                  <span className="font-medium text-white">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Future Microsoft link</span>
                  <span className="font-medium text-white/60">Standby</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Companies", value: data.memberships.length },
          { label: "Posts", value: data.posts.length },
          { label: "Requests", value: data.buildRequests.length },
          { label: "Notifications", value: data.notifications.length },
        ].map((stat) => (
          <div key={stat.label} className="surface-panel p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">{stat.label}</div>
            <div className="mt-3 font-display text-[2rem] leading-none text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-2">
        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <div className="panel-label">Company access</div>
              <h2 className="mt-3 font-display text-[1.7rem] leading-none text-white">My company spaces</h2>
            </div>
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

        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <div className="panel-label">Workflow load</div>
              <h2 className="mt-3 font-display text-[1.7rem] leading-none text-white">Pending workflows</h2>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/applications" />}>
              Applications
            </Button>
          </div>
          <div className="space-y-2">
            {data.companyApplications.length ? (
              data.companyApplications.map((application) => (
                <div key={application.id} className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Company application</div>
                      <div className="mt-2 text-sm font-semibold text-foreground">{application.company.name}</div>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">{application.message}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                No pending applications.
              </div>
            )}
            {data.buildRequests.slice(0, 2).map((request) => (
              <div key={request.id} className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Build request</div>
                    <div className="mt-2 text-sm font-semibold text-foreground">{request.title}</div>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">{request.description}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface-panel space-y-4 p-5">
        <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
          <div>
            <div className="panel-label">Publishing</div>
            <h2 className="mt-3 font-display text-[1.7rem] leading-none text-white">Recent posts</h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/42">Updated {formatDate(new Date())}</span>
        </div>
        {data.posts.length ? (
          <div className="space-y-3">
            {data.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 text-sm text-muted-foreground">
            No authored posts yet. Start with a post from the dashboard.
          </div>
        )}
      </section>
    </AppShell>
  );
}
