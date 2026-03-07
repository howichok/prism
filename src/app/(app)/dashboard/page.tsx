import Link from "next/link";
import { ArrowRight, ClipboardList, Compass, Link2, Megaphone, PlusSquare, UserCircle2 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyCard } from "@/components/platform/company-card";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/data";
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
    >
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${viewer.displayName ?? viewer.username ?? "member"}`}
        description="Use this workspace as your operating surface for identity, company access, publishing, and account readiness."
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

      <section className="grid gap-3 lg:grid-cols-3">
        {[
          {
            href: "/dashboard/posts/new",
            icon: Megaphone,
            title: "Create post",
            body: "Publish an update, showcase, or recruitment surface.",
          },
          {
            href: "/dashboard/company/create",
            icon: PlusSquare,
            title: "Create company",
            body: "Open a new company hub and send it into review.",
          },
          {
            href: "/companies",
            icon: Compass,
            title: "Browse companies",
            body: "Scan visible hubs, recruiting posture, and activity.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-4 transition-colors hover:border-white/14 hover:bg-white/[0.05]"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[0.9rem] border border-blue-400/16 bg-blue-400/[0.08] text-blue-200">
                <item.icon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white">{item.title}</div>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{item.body}</p>
              </div>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
          </Link>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <div className="panel-label">Company access</div>
              <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">My company spaces</h2>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/companies" />}>
              Directory
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
              description="Create a company, redeem an invite, or browse the public network."
              action={
                <Button size="sm" render={<Link href="/dashboard/company/create" />}>
                  Create Company
                </Button>
              }
            />
          )}
        </section>

        <section className="surface-panel space-y-4 p-5">
          <div className="border-b border-white/8 pb-4">
            <div className="panel-label">Account status</div>
            <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">Identity and readiness</h2>
          </div>

          <div className="space-y-2">
            <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Minecraft nickname</div>
              <div className="mt-2 text-sm text-white">{viewer.minecraftNickname ?? "Not set yet"}</div>
            </div>
            <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Connected surfaces</div>
              <div className="mt-2 text-sm text-white">{viewer.linkedAccounts.length} linked account(s)</div>
            </div>
            <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Notifications</div>
              <div className="mt-2 text-sm text-white">{data.notifications.length} waiting</div>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { href: "/dashboard/profile", label: "Update profile", icon: UserCircle2 },
              { href: "/dashboard/settings", label: "Linked accounts", icon: Link2 },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3 text-sm transition-colors hover:border-white/14 hover:bg-white/[0.05]"
              >
                <span className="inline-flex items-center gap-2 text-white">
                  <item.icon className="size-4 text-primary/80" />
                  {item.label}
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </Link>
            ))}
          </div>

          <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Future launcher relation</div>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Microsoft linking stays future-ready, while Discord and Prism profile data remain the current identity source.
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <div className="panel-label">Workflow load</div>
              <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">Pending items</h2>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/applications" />}>
              Applications
            </Button>
          </div>
          <div className="space-y-2">
            {data.companyApplications.length ? (
              data.companyApplications.map((application) => (
                <div key={application.id} className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Company application</div>
                      <div className="mt-2 text-sm font-medium text-white">{application.company.name}</div>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">{application.message}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                No pending company applications.
              </div>
            )}

            {data.buildRequests.slice(0, 2).map((request) => (
              <div key={request.id} className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Build request</div>
                    <div className="mt-2 text-sm font-medium text-white">{request.title}</div>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">{request.description}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <div className="panel-label">Publishing</div>
              <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">Recent posts</h2>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/posts" />}>
              All posts
            </Button>
          </div>
          {data.posts.length ? (
            <div className="space-y-3">
              {data.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4 text-sm text-muted-foreground">
              No authored posts yet. Start with a post from the dashboard.
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
