import Link from "next/link";
import { ArrowRight, Building2, FileText, FolderKanban, Users2 } from "lucide-react";

import { startGuestSessionAction } from "@/actions/session";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { Button } from "@/components/ui/button";
import { getHomeData } from "@/lib/data";
import { formatCompactNumber } from "@/lib/format";
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
      title: "Your workspace is ready",
      description: "Continue where you left off in your dashboard.",
      primary: { href: "/dashboard", label: "Open dashboard" },
      secondary: { href: primaryCompanyHref, label: primaryMembership ? primaryMembership.company.name : "Create company" },
    }
    : guestMode
      ? {
        title: "Previewing PrismMTR",
        description: "Explore the workspace locally. Sign in with Discord for full access.",
        primary: { href: "/dashboard", label: "Continue guest dashboard" },
        secondary: { href: "/sign-in", label: "Sign in with Discord" },
      }
      : {
        title: "Your transit network workspace",
        description: "Identity, company hubs, and publishing in one dashboard.",
        primary: { href: "/sign-in", label: "Sign in with Discord" },
        secondary: { href: "/discovery", label: "Explore the network" },
      };

  const networkStats = [
    { label: "Members", value: formatCompactNumber(data.stats.members), icon: Users2 },
    { label: "Companies", value: formatCompactNumber(data.stats.companies), icon: Building2 },
    { label: "Posts", value: formatCompactNumber(data.stats.posts), icon: FileText },
    { label: "Projects", value: formatCompactNumber(data.stats.projects), icon: FolderKanban },
  ];

  const featured = [
    ...data.featuredCompanies.slice(0, 3).map((company) => ({
      type: "Company" as const,
      title: company.name,
      meta: `${formatCompactNumber(company.counts.members)} members`,
      href: `/companies/${company.slug}`,
    })),
    ...data.featuredPosts.slice(0, 2).map((post) => ({
      type: "Post" as const,
      title: post.title,
      meta: post.author.displayName,
      href: `/posts/${post.slug}`,
    })),
  ].slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/60">
          <span className="size-1.5 rounded-full bg-blue-400 animate-pulse-soft" />
          PrismMTR
        </div>

        <h1 className="animate-fade-up mt-6 max-w-3xl font-display text-[2.5rem] leading-[0.93] text-white sm:text-[3.5rem] lg:text-[4.2rem]" style={{ animationDelay: "80ms" }}>
          {hero.title}
        </h1>

        <p className="animate-fade-up mt-5 max-w-lg text-base leading-7 text-white/60" style={{ animationDelay: "150ms" }}>
          {hero.description}
        </p>

        <div className="animate-fade-up mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "220ms" }}>
          <Button render={<Link href={hero.primary.href} />} size="lg">
            {hero.primary.label}
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link href={hero.secondary.href} />} size="lg">
            {hero.secondary.label}
          </Button>
        </div>

        {!signedIn && !guestMode ? (
          <form action={startGuestSessionAction} className="mt-5">
            <button
              type="submit"
              className="text-sm text-white/40 transition-colors hover:text-white/70"
            >
              or continue as guest
            </button>
          </form>
        ) : null}
      </section>

      {/* Network stats */}
      <section className="animate-fade-up mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/8 bg-white/[0.04] sm:mt-20 sm:grid-cols-4" style={{ animationDelay: "300ms" }}>
        {networkStats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 bg-[hsl(0_0%_4%)] px-4 py-5 sm:py-6">
            <stat.icon className="mb-1 size-4 text-white/30" />
            <div className="font-display text-2xl text-white">{stat.value}</div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-white/40">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Featured activity */}
      {featured.length > 0 ? (
        <section className="animate-fade-up mt-14 sm:mt-16" style={{ animationDelay: "400ms" }}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-medium text-white/50">Recent on the network</h2>
            <Link
              href="/discovery"
              className="text-sm text-white/30 transition-colors hover:text-white/60"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4 motion-lift hover:border-white/12 hover:bg-white/[0.04]"
              >
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">{item.type}</div>
                  <div className="mt-1 truncate text-sm font-medium text-white/90">{item.title}</div>
                  <div className="mt-0.5 text-xs text-white/40">{item.meta}</div>
                </div>
                <ArrowRight className="ml-4 size-4 shrink-0 text-white/15 transition-colors group-hover:text-white/40" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Bottom CTA - only for signed-out */}
      {!signedIn ? (
        <section className="mt-16 flex flex-col items-center border-t border-white/6 pt-12 text-center sm:mt-20">
          <h2 className="font-display text-xl text-white sm:text-2xl">
            {guestMode
              ? "Ready for full access?"
              : "Start from one workspace"}
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/45">
            {guestMode
              ? "Sign in with Discord to unlock publishing, company management, and notifications."
              : "Dashboard, company hubs, publishing, and identity in one place."}
          </p>
          <div className="mt-6 flex gap-3">
            <Button render={<Link href={guestMode ? "/sign-in" : hero.primary.href} />}>
              {guestMode ? "Sign in with Discord" : hero.primary.label}
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
