import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Building2,
  Compass,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Users2,
} from "lucide-react";

import { startGuestSessionAction } from "@/actions/session";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { Button } from "@/components/ui/button";
import { getHomeData } from "@/lib/data";
import { titleCase } from "@/lib/format";
import { getOptionalViewer, isGuestViewer } from "@/lib/session";

export default async function HomePage() {
  const [data, viewer] = await Promise.all([
    getHomeData().catch((error) => {
      console.error("[home] Failed to load public home data.", error);
      return null;
    }),
    getOptionalViewer(),
  ]);

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <PublicDataUnavailable
          title="PrismMTR overview is temporarily offline"
          description="We could not load companies, posts, and project highlights right now."
        />
      </div>
    );
  }

  const guestMode = isGuestViewer(viewer);
  const signedIn = Boolean(viewer && !guestMode);
  const primaryMembership = viewer && !guestMode ? viewer.companyMemberships[0] ?? null : null;
  const primaryCompanyHref = primaryMembership ? `/dashboard/company/${primaryMembership.company.slug}` : "/dashboard/company/create";

  const hero = signedIn
    ? {
      eyebrow: "Workspace ready",
      title: "PrismMTR is ready. Open your dashboard and continue work.",
      description:
        "Your dashboard is the main surface for company hubs, posts, notifications, and identity settings.",
      primary: { href: "/dashboard", label: "Open dashboard" },
      secondary: { href: primaryCompanyHref, label: primaryMembership ? "Open company hub" : "Create company hub" },
    }
    : guestMode
      ? {
        eyebrow: "Guest mode",
        title: "Preview PrismMTR without an account.",
        description:
          "Guest mode opens a local dashboard shell so you can inspect the product before connecting Discord.",
        primary: { href: "/dashboard", label: "Continue guest dashboard" },
        secondary: { href: "/sign-in", label: "Sign in with Discord" },
      }
      : {
        eyebrow: "PrismMTR",
        title: "One dashboard for identity, company hubs, and public network work.",
        description:
          "Use PrismMTR to manage members, publish updates, run company spaces, and explore the wider MTR network.",
        primary: { href: "/sign-in", label: "Sign in with Discord" },
        secondary: { href: "/discovery", label: "Explore discovery" },
      };

  const previewSidebar = signedIn
    ? [
      { label: "Dashboard", state: "Current route", active: true },
      { label: primaryMembership ? primaryMembership.company.name : "Company hub", state: primaryMembership ? "Primary workspace" : "Create or join" },
      { label: "Notifications", state: "Queue and approvals" },
      { label: "Profile", state: "Identity and settings" },
    ]
    : guestMode
      ? [
        { label: "Guest dashboard", state: "Local mode", active: true },
        { label: "Discovery", state: "Fully visible" },
        { label: "Companies", state: "Public hubs" },
        { label: "Restricted actions", state: "Locked until sign-in" },
      ]
      : [
        { label: "Dashboard", state: "Unlock after sign-in", active: true },
        { label: "Company hubs", state: "Members and projects" },
        { label: "Publishing", state: "Posts and updates" },
        { label: "Discovery", state: "Public network" },
      ];

  const previewTasks = signedIn
    ? [
      {
        label: "Continue company work",
        body: primaryMembership
          ? `Open ${primaryMembership.company.name} and manage members, projects, and posts.`
          : "Create a company workspace and submit it for review.",
        href: primaryCompanyHref,
        icon: Building2,
      },
      {
        label: "Check notifications",
        body: "Review moderation requests, inbox changes, and workflow updates from one place.",
        href: "/dashboard/notifications",
        icon: Bell,
      },
    ]
    : guestMode
      ? [
        {
          label: "Inspect dashboard structure",
          body: "See how the real workspace is organized before connecting a full account.",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Move into full access",
          body: "Sign in with Discord when you want publishing, company control, and notifications.",
          href: "/sign-in",
          icon: ShieldCheck,
        },
      ]
      : [
        {
          label: "Enter the dashboard",
          body: "Sign in once and use one workspace for identity, company hubs, and publishing.",
          href: "/sign-in",
          icon: ShieldCheck,
        },
        {
          label: "Explore the public network",
          body: "Browse companies, members, projects, and posts before creating an account.",
          href: "/discovery",
          icon: Compass,
        },
      ];

  const livePreview = [
    data.featuredCompanies[0]
      ? {
        label: "Company hub",
        title: data.featuredCompanies[0].name,
        meta: `${data.featuredCompanies[0].counts.members} members / ${titleCase(data.featuredCompanies[0].recruitingStatus)}`,
        href: `/companies/${data.featuredCompanies[0].slug}`,
      }
      : {
        label: "Company hub",
        title: "PrismMTR Open Source",
        meta: "1,204 members / Recruiting",
        href: "/discovery",
      },
    data.featuredProjects[0]
      ? {
        label: "Project",
        title: data.featuredProjects[0].title,
        meta: `${data.featuredProjects[0].company.name} / ${titleCase(data.featuredProjects[0].status)}`,
        href: `/companies/${data.featuredProjects[0].company.slug}`,
      }
      : {
        label: "Project",
        title: "Next.js Integration Rewrite",
        meta: "PrismMTR / Active",
        href: "/discovery",
      },
    data.featuredPosts[0]
      ? {
        label: "Post",
        title: data.featuredPosts[0].title,
        meta: `${data.featuredPosts[0].author.displayName} / ${titleCase(data.featuredPosts[0].type)}`,
        href: `/posts/${data.featuredPosts[0].slug}`,
      }
      : {
        label: "Post",
        title: "Q3 Community Update & Roadmap",
        meta: "Alex / Announcement",
        href: "/discovery",
      },
  ].filter(Boolean) as Array<{ label: string; title: string; meta: string; href: string }>;

  const capabilityItems = [
    {
      icon: Users2,
      title: "Identity",
      body: "Profiles, roles, and presence stay tied to one account and one dashboard.",
    },
    {
      icon: Building2,
      title: "Company hubs",
      body: "Members, projects, invites, and posts stay together inside a shared workspace.",
    },
    {
      icon: Megaphone,
      title: "Publishing and discovery",
      body: "Public updates flow out from the workspace into discovery for the wider network.",
    },
  ];

  const workflowItems = [
    {
      step: "01",
      title: signedIn ? "Return to your dashboard" : guestMode ? "Preview the dashboard" : "Connect your identity",
      body: signedIn
        ? "Start from the dashboard instead of hunting through separate sections."
        : guestMode
          ? "Guest mode shows the real shell without giving account-only permissions."
          : "Discord unlocks the same identity across profile, company access, and moderation-aware routes.",
    },
    {
      step: "02",
      title: "Work inside a company hub",
      body: "Use one workspace for members, projects, posts, applications, and company settings.",
    },
    {
      step: "03",
      title: "Publish to the network",
      body: "Posts, projects, and public company activity stay visible through discovery and public profiles.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1380px] px-4 pb-18 pt-8 sm:px-6 lg:px-8">
      <section className="border-b border-white/8 pb-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/72">
            <span className="size-2 rounded-full bg-blue-400" />
            {hero.eyebrow}
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-[2.3rem] leading-[0.92] text-white sm:text-[3.2rem] xl:text-[4rem]">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/72">{hero.description}</p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button render={<Link href={hero.primary.href} />} size="lg">
              {hero.primary.label}
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" render={<Link href={hero.secondary.href} />} size="lg">
              {hero.secondary.label}
            </Button>
          </div>

          {!signedIn && !guestMode ? (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="text-sm text-white/50">or preview dashboard locally</div>
              <form action={startGuestSessionAction}>
                <button
                  type="submit"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  <span className="border-b border-white/20 pb-0.5 transition-colors group-hover:border-white/60">
                    Continue as guest
                  </span>
                  <ArrowRight className="size-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                </button>
              </form>
            </div>
          ) : null}
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.15rem] border border-white/8 bg-[linear-gradient(180deg,rgba(14,14,16,0.96),rgba(9,9,11,0.98))] shadow-[0_20px_48px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 sm:px-6">
            <div className="inline-flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-[0.85rem] border border-blue-400/16 bg-blue-400/[0.08] text-blue-200">
                <LayoutDashboard className="size-4.5" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Dashboard preview</div>
                <div className="text-xs text-white/56">
                  {signedIn
                    ? "This is where company work, publishing, and notifications stay connected."
                    : guestMode
                      ? "Guest mode opens this shell locally without a full account."
                      : "Sign in once, then use the dashboard as the main PrismMTR workspace."}
                </div>
              </div>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/68 sm:block">
              {signedIn ? "Active account" : guestMode ? "Local guest session" : "After sign-in"}
            </div>
          </div>

          <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="border-b border-white/8 px-4 py-5 lg:border-b-0 lg:border-r lg:px-5">
              <div className="space-y-2">
                {previewSidebar.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-[0.9rem] px-3 py-2.5 ${item.active ? "border border-white/10 bg-white/[0.04]" : "border border-transparent"}`}
                  >
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="mt-1 text-xs leading-5 text-white/56">{item.state}</div>
                  </div>
                ))}
              </div>
            </aside>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="px-4 py-5 sm:px-6">
                <div className="border-b border-white/8 pb-4">
                  <div className="panel-label">What you can do next</div>
                  <h2 className="mt-3 font-display text-[1.6rem] leading-none text-white">
                    {signedIn ? "Continue work from one place" : guestMode ? "Explore the product before signing in" : "See how PrismMTR is organized"}
                  </h2>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {previewTasks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group border-t border-white/8 pt-4 transition-colors hover:border-white/14"
                    >
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-white">
                        <item.icon className="size-4 text-blue-300" />
                        {item.label}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/68">{item.body}</p>
                      <div className="mt-3 inline-flex items-center gap-2 text-sm text-white/66 transition-colors group-hover:text-white">
                        Open
                        <ArrowRight className="size-3.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/8 px-4 py-5 sm:px-6 lg:border-l lg:border-t-0">
                <div className="border-b border-white/8 pb-4">
                  <div className="panel-label">Live on the network</div>
                  <h2 className="mt-3 font-display text-[1.35rem] leading-none text-white">Public activity stays connected</h2>
                </div>

                <div className="mt-5 space-y-4">
                  {livePreview.map((item) => (
                    <Link key={item.href} href={item.href} className="group block border-b border-white/8 pb-4 transition-colors hover:border-white/14">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/46">{item.label}</div>
                      <div className="mt-2 text-sm font-medium text-white">{item.title}</div>
                      <div className="mt-2 text-sm leading-6 text-white/62">{item.meta}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-10 border-b border-white/8 py-12 lg:grid-cols-[minmax(0,0.9fr)_1.1fr]">
        <div>
          <div className="panel-label">What PrismMTR does</div>
          <h2 className="mt-3 font-display text-[2rem] leading-none text-white">A workspace first, not just a public directory.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/68">
            PrismMTR combines member identity, company coordination, and public discovery so the dashboard becomes the place where the network actually moves.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {capabilityItems.map((item) => (
            <div key={item.title} className="border-t border-white/8 pt-4">
              <div className="flex size-10 items-center justify-center rounded-[0.9rem] border border-white/10 bg-white/[0.03] text-white/76">
                <item.icon className="size-4.5" />
              </div>
              <div className="mt-4 text-base font-medium text-white">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-white/68">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-2xl">
          <div className="panel-label">How it works</div>
          <h2 className="mt-3 font-display text-[2rem] leading-none text-white">Public discovery and workspace activity stay in the same flow.</h2>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {workflowItems.map((item) => (
            <div key={item.step} className="border-t border-white/8 pt-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-blue-400">{item.step}</div>
              <div className="mt-3 text-base font-medium text-white">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-white/68">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/8 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xl font-display text-white">
              {signedIn
                ? "Go back to the dashboard and continue from the real workspace."
                : guestMode
                  ? "Keep exploring locally, or sign in when you want full access."
                  : "Start in the dashboard when you are ready to use PrismMTR."}
            </div>
            <p className="mt-2 text-sm leading-6 text-white/66">
              {signedIn
                ? "Everything important routes through your account, company access, and notifications."
                : guestMode
                  ? "Guest mode is useful for exploration, but account-based work starts with Discord identity."
                  : "Dashboard is the main destination for companies, publishing, profile controls, and notifications."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button render={<Link href={hero.primary.href} />}>{hero.primary.label}</Button>
            <Button variant="outline" render={<Link href={hero.secondary.href} />}>
              {hero.secondary.label}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
