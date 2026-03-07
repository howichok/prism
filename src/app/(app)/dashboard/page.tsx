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
      description="Personal overview, company access, posts, applications, and linked identity controls."
      items={dashboardSidebarItems}
      rail={
        <>
          <div className="surface-panel p-6">
            <div className="panel-label">Notifications</div>
            <div className="mt-4 space-y-3">
              {data.notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="surface-panel-soft p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-white">{notification.title}</div>
                    {notification.readAt ? null : <span className="size-2 rounded-full bg-cyan-300" />}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/58">{notification.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-6">
            <div className="panel-label">Linked accounts</div>
            <div className="mt-4 space-y-3 text-sm text-white/60">
              {viewer.linkedAccounts.map((account) => (
                <div key={account.id} className="surface-panel-soft flex items-center justify-between gap-3 p-4">
                  <span>{account.provider}</span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-white/42">Connected</span>
                </div>
              ))}
              <div className="surface-panel-soft p-4">
                Microsoft linking is intentionally future-ready here so launcher rollout can reuse the same Prism account graph later.
              </div>
            </div>
          </div>

          <div className="surface-panel p-6">
            <div className="panel-label">Pending items</div>
            <div className="mt-4 space-y-3 text-sm text-white/60">
              <div className="surface-panel-soft flex items-center justify-between p-4">
                <span>Company applications</span>
                <span>{data.companyApplications.length}</span>
              </div>
              <div className="surface-panel-soft flex items-center justify-between p-4">
                <span>Build requests</span>
                <span>{data.buildRequests.length}</span>
              </div>
              <div className="surface-panel-soft flex items-center justify-between p-4">
                <span>Draft or moderated posts</span>
                <span>{data.posts.length}</span>
              </div>
            </div>
          </div>
        </>
      }
    >
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${viewer.displayName ?? viewer.username ?? "member"}`}
        description="Jump back into your company spaces, handle pending PrismMTR workflows, and keep your identity surface current for the broader network."
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

      <section className="surface-panel-strong overflow-hidden p-6 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-start gap-4">
              <UserAvatar
                name={viewer.displayName ?? viewer.username}
                image={viewer.avatarUrl}
                accentColor={viewer.accentColor}
                size="lg"
                className="size-22"
              />
              <div className="space-y-3">
                <div>
                  <div className="panel-label">Personal control center</div>
                  <div className="mt-2 font-display text-3xl font-semibold text-white">
                    @{viewer.username ?? "member"}
                  </div>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-white/62">
                  PrismMTR keeps your Discord-first identity, company memberships, posts, applications, and future linked account surfaces in one place without drifting into chat.
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewer.companyMemberships.slice(0, 3).map((membership) => (
                    <Link
                      key={membership.id}
                      href={`/dashboard/company/${membership.company.slug}`}
                      className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/62 transition hover:text-white"
                    >
                      {membership.company.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              {
                href: "/dashboard/profile",
                icon: UserCircle2,
                label: "Update profile",
                body: "Keep your public identity, bio, and Minecraft nickname sharp.",
              },
              {
                href: "/companies",
                icon: Compass,
                label: "Browse companies",
                body: "Find public hubs that are recruiting and active right now.",
              },
              {
                href: "/dashboard/settings",
                icon: Link2,
                label: "Linked accounts",
                body: "Prepare Discord, email, and future launcher linkage in one settings surface.",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="surface-panel-soft group p-4 transition hover:border-white/16 hover:bg-white/6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-100">
                      <item.icon className="size-4" />
                    </div>
                    <div className="mt-3 text-base font-semibold text-white">{item.label}</div>
                    <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                  </div>
                  <ArrowRight className="size-4 text-white/28 transition group-hover:translate-x-0.5 group-hover:text-cyan-100" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Companies", value: data.memberships.length },
          { label: "Posts", value: data.posts.length },
          { label: "Requests", value: data.buildRequests.length },
          { label: "Notifications", value: data.notifications.length },
        ].map((stat) => (
          <div key={stat.label} className="surface-panel p-5">
            <div className="panel-label">{stat.label}</div>
            <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-white">My companies</h2>
            <Button variant="outline" render={<Link href="/companies" />}>
              <Compass className="size-4" />
              Browse Companies
            </Button>
          </div>
          {data.memberships.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {data.memberships.map((membership) => (
                <CompanyCard key={membership.id} company={membership} href={`/dashboard/company/${membership.slug}`} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No company memberships yet"
              description="Create a company, redeem an invite, or browse discovery to join an existing team."
              action={<Button render={<Link href="/dashboard/company/create" />}>Create Company</Button>}
            />
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-white">Pending workflows</h2>
            <Button variant="outline" render={<Link href="/dashboard/applications" />}>
              View applications
            </Button>
          </div>
          <div className="space-y-4">
            {data.companyApplications.length ? (
              data.companyApplications.map((application) => (
                <div key={application.id} className="surface-panel p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="panel-label">Company application</div>
                      <div className="mt-2 text-lg font-semibold text-white">{application.company.name}</div>
                      <p className="mt-2 text-sm leading-7 text-white/60">{application.message}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="surface-panel p-5 text-sm text-white/58">
                No pending company applications. Use discovery to find new public companies.
              </div>
            )}

            {data.buildRequests.slice(0, 2).map((request) => (
              <div key={request.id} className="surface-panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="panel-label">Build request</div>
                    <div className="mt-2 text-lg font-semibold text-white">{request.title}</div>
                    <p className="mt-2 text-sm leading-7 text-white/60">{request.description}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-white">Recent posts</h2>
          <div className="text-sm text-white/52">Updated {formatDate(new Date())}</div>
        </div>
        {data.posts.length ? (
          <div className="space-y-4">
            {data.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="surface-panel p-5 text-sm text-white/58">
            No authored posts yet. Start a recruitment post, announcement, or project update from the dashboard.
          </div>
        )}
      </section>
    </AppShell>
  );
}
