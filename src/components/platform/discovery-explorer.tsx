"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  Building2,
  ClipboardList,
  Compass,
  LayoutGrid,
  Newspaper,
  SearchSlash,
  Sparkles,
  type LucideIcon,
  UsersRound,
} from "lucide-react";

import { BuildRequestCard } from "@/components/platform/build-request-card";
import { CompanyCard } from "@/components/platform/company-card";
import { EmptyState } from "@/components/platform/empty-state";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { SearchBar } from "@/components/platform/search-bar";
import { UserCard } from "@/components/platform/user-card";
import type { BuildRequestSummary, CompanySummary, PostSummary, ProjectSummary, UserPreview } from "@/lib/data";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DiscoveryTab = "all" | "companies" | "users" | "posts" | "projects" | "requests";
type DiscoverySort = "activity" | "latest" | "a-z";

const tabs: DiscoveryTab[] = ["all", "companies", "users", "posts", "projects", "requests"];

const tabMeta: Record<
  DiscoveryTab,
  {
    label: string;
    summary: string;
    icon: LucideIcon;
  }
> = {
  all: {
    label: "All",
    summary: "Cross-network view across public companies, members, publishing, work, and requests.",
    icon: LayoutGrid,
  },
  companies: {
    label: "Companies",
    summary: "Operating hubs, recruiting posture, and leadership context.",
    icon: Building2,
  },
  users: {
    label: "Members",
    summary: "Identity surfaces with company, role, and badge context.",
    icon: UsersRound,
  },
  posts: {
    label: "Posts",
    summary: "Public publishing surfaces for announcements, showcases, and recruitment.",
    icon: Newspaper,
  },
  projects: {
    label: "Projects",
    summary: "Active work with authorship, status, and company ownership.",
    icon: Sparkles,
  },
  requests: {
    label: "Requests",
    summary: "Open operational needs and build requests across the network.",
    icon: ClipboardList,
  },
};

function sortByName<T extends { title?: string; name?: string; displayName?: string }>(left: T, right: T) {
  const a = left.name ?? left.title ?? left.displayName ?? "";
  const b = right.name ?? right.title ?? right.displayName ?? "";
  return a.localeCompare(b);
}

function SectionHeader({
  eyebrow,
  title,
  count,
  description,
}: {
  eyebrow: string;
  title: string;
  count: number;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="panel-label">{eyebrow}</div>
        <h2 className="mt-3 font-display text-[1.45rem] leading-[0.96] text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/46">{count} results</div>
    </div>
  );
}

export function DiscoveryExplorer({
  companies,
  users,
  posts,
  projects,
  buildRequests,
}: {
  companies: CompanySummary[];
  users: UserPreview[];
  posts: PostSummary[];
  projects: ProjectSummary[];
  buildRequests: BuildRequestSummary[];
}) {
  const [tab, setTab] = useState<DiscoveryTab>("all");
  const [query, setQuery] = useState("");
  const [recruiting, setRecruiting] = useState("all");
  const [privacy, setPrivacy] = useState("all");
  const [sort, setSort] = useState<DiscoverySort>("activity");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredCompanies = useMemo(() => {
    const results = companies.filter((company) => {
      const searchSpace = [company.name, company.description, company.tags.join(" "), company.owner.displayName].join(" ");
      const privacyMatch = privacy === "all" || company.privacy === privacy;
      const recruitingMatch = recruiting === "all" || company.recruitingStatus === recruiting;
      return (!deferredQuery || searchSpace.toLowerCase().includes(deferredQuery)) && privacyMatch && recruitingMatch;
    });
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      if (sort === "latest") return right.updatedAt.getTime() - left.updatedAt.getTime();
      return right.counts.members + right.counts.posts + right.counts.projects - (left.counts.members + left.counts.posts + left.counts.projects);
    });
  }, [companies, deferredQuery, privacy, recruiting, sort]);

  const filteredUsers = useMemo(() => {
    const results = users.filter((user) => {
      const searchSpace = [user.displayName, user.username ?? "", user.bio ?? "", user.memberships.map((m) => m.company.name).join(" ")].join(" ");
      return !deferredQuery || searchSpace.toLowerCase().includes(deferredQuery);
    });
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      if (sort === "latest") return right.createdAt.getTime() - left.createdAt.getTime();
      return right.memberships.length + right.badges.length - (left.memberships.length + left.badges.length);
    });
  }, [deferredQuery, sort, users]);

  const filteredPosts = useMemo(() => {
    const results = posts.filter((post) =>
      !deferredQuery || [post.title, post.excerpt ?? "", post.tags.join(" ")].join(" ").toLowerCase().includes(deferredQuery),
    );
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      return right.createdAt.getTime() - left.createdAt.getTime();
    });
  }, [deferredQuery, posts, sort]);

  const filteredProjects = useMemo(() => {
    const results = projects.filter((project) =>
      !deferredQuery || [project.title, project.description, project.tags.join(" ")].join(" ").toLowerCase().includes(deferredQuery),
    );
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      return right.updatedAt.getTime() - left.updatedAt.getTime();
    });
  }, [deferredQuery, projects, sort]);

  const filteredRequests = useMemo(() => {
    const results = buildRequests.filter((request) =>
      !deferredQuery ||
      [request.title, request.description, request.category, request.company?.name ?? ""].join(" ").toLowerCase().includes(deferredQuery),
    );
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      return right.updatedAt.getTime() - left.updatedAt.getTime();
    });
  }, [buildRequests, deferredQuery, sort]);

  const totalResults =
    filteredCompanies.length + filteredUsers.length + filteredPosts.length + filteredProjects.length + filteredRequests.length;

  const resultSplit = [
    { label: "Companies", count: filteredCompanies.length },
    { label: "Members", count: filteredUsers.length },
    { label: "Publishing", count: filteredPosts.length + filteredProjects.length },
    { label: "Requests", count: filteredRequests.length },
  ];

  const tabCounts: Record<DiscoveryTab, number> = {
    all: totalResults,
    companies: filteredCompanies.length,
    users: filteredUsers.length,
    posts: filteredPosts.length,
    projects: filteredProjects.length,
    requests: filteredRequests.length,
  };

  const activeTabMeta = tabMeta[tab];

  const companiesList = tab === "all" ? filteredCompanies.slice(0, 3) : filteredCompanies;
  const companiesSection = (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <SectionHeader
        eyebrow="Companies"
        title="Visible operating centers"
        count={filteredCompanies.length}
        description="Public companies with visible recruiting posture, leadership, and work context."
      />
      {companiesList.length ? (
        <div className="mt-6 grid gap-3">
          {companiesList.map((company) => (
            <CompanyCard key={company.id} company={company} compact />
          ))}
          {tab === "all" && filteredCompanies.length > 3 ? (
            <button
              onClick={() => setTab("companies")}
              className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              View all {filteredCompanies.length} companies
            </button>
          ) : null}
        </div>
      ) : (
        <EmptyState icon={SearchSlash} title="No companies match" description="Try broadening the current filters." className="mt-6 p-6 sm:p-7" />
      )}
    </section>
  );

  const usersList = tab === "all" ? filteredUsers.slice(0, 3) : filteredUsers;
  const usersSection = (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <SectionHeader
        eyebrow="Members"
        title="Public identity surfaces"
        count={filteredUsers.length}
        description="People with visible company, role, and badge context."
      />
      {usersList.length ? (
        <div className="mt-6 grid gap-3">
          {usersList.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
          {tab === "all" && filteredUsers.length > 3 ? (
            <button
              onClick={() => setTab("users")}
              className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              View all {filteredUsers.length} members
            </button>
          ) : null}
        </div>
      ) : (
        <EmptyState icon={UsersRound} title="No members match" description="Try a different search term." className="mt-6 p-6 sm:p-7" />
      )}
    </section>
  );

  const postsList = tab === "all" ? filteredPosts.slice(0, 3) : filteredPosts;
  const postsSection = (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <SectionHeader
        eyebrow="Posts"
        title="Public publishing stream"
        count={filteredPosts.length}
        description="Announcements, showcases, and recruiting updates with authorship and company context."
      />
      {postsList.length ? (
        <div className="mt-6 space-y-3">
          {postsList.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {tab === "all" && filteredPosts.length > 3 ? (
            <button
              onClick={() => setTab("posts")}
              className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              View all {filteredPosts.length} posts
            </button>
          ) : null}
        </div>
      ) : (
        <EmptyState icon={Newspaper} title="No posts match" description="Try a broader publishing search." className="mt-6 p-6 sm:p-7" />
      )}
    </section>
  );

  const projectsList = tab === "all" ? filteredProjects.slice(0, 3) : filteredProjects;
  const projectsSection = (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <SectionHeader
        eyebrow="Projects"
        title="Work in motion"
        count={filteredProjects.length}
        description="Active infrastructure and build surfaces with status and company ownership."
      />
      {projectsList.length ? (
        <div className="mt-6 grid gap-3">
          {projectsList.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {tab === "all" && filteredProjects.length > 3 ? (
            <button
              onClick={() => setTab("projects")}
              className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              View all {filteredProjects.length} projects
            </button>
          ) : null}
        </div>
      ) : (
        <EmptyState icon={Sparkles} title="No projects match" description="No visible project matches this lens." className="mt-6 p-6 sm:p-7" />
      )}
    </section>
  );

  const requestsList = tab === "all" ? filteredRequests.slice(0, 3) : filteredRequests;
  const requestsSection = (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <SectionHeader
        eyebrow="Requests"
        title="Operational needs"
        count={filteredRequests.length}
        description="Open build requests and public needs visible across the network."
      />
      {requestsList.length ? (
        <div className="mt-6 grid gap-3">
          {requestsList.map((request) => (
            <BuildRequestCard key={request.id} request={request} />
          ))}
          {tab === "all" && filteredRequests.length > 3 ? (
            <button
              onClick={() => setTab("requests")}
              className="mt-2 w-full rounded-xl border border-white/5 bg-white/[0.02] py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              View all {filteredRequests.length} requests
            </button>
          ) : null}
        </div>
      ) : (
        <EmptyState icon={ClipboardList} title="No requests match" description="No build request matches the current view." className="mt-6 p-6 sm:p-7" />
      )}
    </section>
  );

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Main Hero Bento (Spans 3 cols) */}
        <div className="group relative flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] lg:col-span-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10 inline-flex size-14 items-center justify-center rounded-[1.2rem] border border-blue-400/20 bg-blue-400/10 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/30 transition-transform duration-500 group-hover:scale-110">
            <Compass className="size-6" />
          </div>

          <div className="relative z-10 mt-8">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400/80">Discovery Index</div>
            <h2 className="mt-3 font-display text-3xl leading-none text-white transition-colors duration-300 group-hover:text-blue-50 sm:text-4xl">
              Browse PrismMTR as a public network, not a stack of isolated lists.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground transition-colors duration-300 group-hover:text-white/80">
              Search the network, switch lenses, then inspect the visible graph of companies, members, publishing, projects, and requests.
            </p>
          </div>
        </div>

        {/* Stats Bento (Spans 1 col) */}
        <div className="flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-8 backdrop-blur-sm lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Visible Results</div>
            <LayoutGrid className="size-4 text-white/40" />
          </div>
          <div className="mt-4 flex flex-col items-start gap-2">
            <div className="font-display text-6xl leading-none text-white">{tabCounts[tab]}</div>
            <div className="text-xs leading-5 text-muted-foreground">
              {deferredQuery ? `Filtered by "${deferredQuery}"` : "Across selected lens"}
            </div>
          </div>
        </div>

        {/* Search & Tabs Bento (Spans 3 cols) */}
        <div className="flex flex-col gap-6 overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm lg:col-span-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Search companies, members, tags, and work surfaces" />

          <div className="flex flex-wrap gap-2">
            {tabs.map((value) => {
              const meta = tabMeta[value];
              const Icon = meta.icon;

              return (
                <button
                  key={value}
                  onClick={() => setTab(value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
                    tab === value
                      ? "border-blue-500/30 bg-blue-500/10 text-white"
                      : "border-transparent text-muted-foreground hover:bg-white/[0.03] hover:text-white",
                  )}
                >
                  <Icon className={cn("size-4", tab === value ? "text-blue-400" : "")} />
                  <span>{meta.label}</span>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]",
                    tab === value ? "bg-blue-500/20 text-blue-200" : "bg-white/5 text-white/50"
                  )}>
                    {tabCounts[value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters Bento (Spans 1 col) */}
        <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm lg:col-span-1 border-white/10">
          <div className="panel-label">Filters</div>
          <div className="mt-4 grid gap-3">
            <label className="text-xs font-medium text-muted-foreground">
              Sort
              <Select value={sort} onValueChange={(value) => setSort(value as DiscoverySort)}>
                <SelectTrigger className="mt-2 h-10 w-full rounded-xl border border-white/8 bg-white/[0.02] px-3 text-sm text-white transition-colors hover:bg-white/[0.04] focus:ring-1 focus:ring-blue-400/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activity">Most active</SelectItem>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="a-z">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label className="text-xs font-medium text-muted-foreground">
              Recruiting
              <Select value={recruiting} onValueChange={(value) => setRecruiting(value as string)}>
                <SelectTrigger className="mt-2 h-10 w-full rounded-xl border border-white/8 bg-white/[0.02] px-3 text-sm text-white transition-colors hover:bg-white/[0.04] focus:ring-1 focus:ring-blue-400/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="LIMITED">Limited</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label className="text-xs font-medium text-muted-foreground">
              Privacy
              <Select value={privacy} onValueChange={(value) => setPrivacy(value as string)}>
                <SelectTrigger className="mt-2 h-10 w-full rounded-xl border border-white/8 bg-white/[0.02] px-3 text-sm text-white transition-colors hover:bg-white/[0.04] focus:ring-1 focus:ring-blue-400/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>
        </div>
      </section>

      {tab === "all" ? (
        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_0.96fr]">
          <div className="space-y-8">
            {companiesSection}
            {postsSection}
          </div>
          <div className="space-y-8">
            {usersSection}
            {projectsSection}
            {requestsSection}
          </div>
        </section>
      ) : (
        <section className="space-y-8">
          {tab === "companies" ? companiesSection : null}
          {tab === "users" ? usersSection : null}
          {tab === "posts" ? postsSection : null}
          {tab === "projects" ? projectsSection : null}
          {tab === "requests" ? requestsSection : null}
        </section>
      )}

      <div className="flex flex-wrap gap-2 border-t border-white/8 pt-5">
        {resultSplit.map((item) => (
          <div key={item.label} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/58">
            {item.label}: <span className="text-white">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
