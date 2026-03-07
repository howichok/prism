"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Building2, ClipboardList, Compass, Newspaper, SearchSlash, Sparkles, UsersRound } from "lucide-react";

import { BuildRequestCard } from "@/components/platform/build-request-card";
import { CompanyCard } from "@/components/platform/company-card";
import { EmptyState } from "@/components/platform/empty-state";
import { FilterPanel } from "@/components/platform/filter-panel";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { SearchBar } from "@/components/platform/search-bar";
import { UserCard } from "@/components/platform/user-card";
import type { BuildRequestSummary, CompanySummary, PostSummary, ProjectSummary, UserPreview } from "@/lib/data";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

type DiscoveryTab = "all" | "companies" | "users" | "posts" | "projects" | "requests";
type DiscoverySort = "activity" | "latest" | "a-z";

const tabs: DiscoveryTab[] = ["all", "companies", "users", "posts", "projects", "requests"];

function sortByName<T extends { title?: string; name?: string; displayName?: string }>(left: T, right: T) {
  const a = left.name ?? left.title ?? left.displayName ?? "";
  const b = right.name ?? right.title ?? right.displayName ?? "";

  return a.localeCompare(b);
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
      if (sort === "a-z") {
        return sortByName(left, right);
      }

      if (sort === "latest") {
        return right.updatedAt.getTime() - left.updatedAt.getTime();
      }

      return right.counts.members + right.counts.posts + right.counts.projects - (left.counts.members + left.counts.posts + left.counts.projects);
    });
  }, [companies, deferredQuery, privacy, recruiting, sort]);

  const filteredUsers = useMemo(() => {
    const results = users.filter((user) => {
      const searchSpace = [user.displayName, user.username ?? "", user.bio ?? "", user.memberships.map((membership) => membership.company.name).join(" ")].join(" ");
      return !deferredQuery || searchSpace.toLowerCase().includes(deferredQuery);
    });

    return [...results].sort((left, right) => {
      if (sort === "a-z") {
        return sortByName(left, right);
      }

      if (sort === "latest") {
        return right.createdAt.getTime() - left.createdAt.getTime();
      }

      return right.memberships.length + right.badges.length - (left.memberships.length + left.badges.length);
    });
  }, [deferredQuery, sort, users]);

  const filteredPosts = useMemo(() => {
    const results = posts.filter((post) =>
      !deferredQuery || [post.title, post.excerpt ?? "", post.tags.join(" ")].join(" ").toLowerCase().includes(deferredQuery),
    );

    return [...results].sort((left, right) => {
      if (sort === "a-z") {
        return sortByName(left, right);
      }

      return right.createdAt.getTime() - left.createdAt.getTime();
    });
  }, [deferredQuery, posts, sort]);

  const filteredProjects = useMemo(() => {
    const results = projects.filter((project) =>
      !deferredQuery || [project.title, project.description, project.tags.join(" ")].join(" ").toLowerCase().includes(deferredQuery),
    );

    return [...results].sort((left, right) => {
      if (sort === "a-z") {
        return sortByName(left, right);
      }

      return right.updatedAt.getTime() - left.updatedAt.getTime();
    });
  }, [deferredQuery, projects, sort]);

  const filteredRequests = useMemo(() => {
    const results = buildRequests.filter((request) =>
      !deferredQuery ||
      [request.title, request.description, request.category, request.company?.name ?? ""].join(" ").toLowerCase().includes(deferredQuery),
    );

    return [...results].sort((left, right) => {
      if (sort === "a-z") {
        return sortByName(left, right);
      }

      return right.updatedAt.getTime() - left.updatedAt.getTime();
    });
  }, [buildRequests, deferredQuery, sort]);

  const totalResults =
    filteredCompanies.length + filteredUsers.length + filteredPosts.length + filteredProjects.length + filteredRequests.length;

  const featuredCompany = filteredCompanies[0];
  const featuredUser = filteredUsers[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <FilterPanel title="Search PrismMTR" description="Explore companies, members, posts, projects, and build requests from one structured surface.">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by company, member, tag, project, or request" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block text-sm text-white/62">
              Sort
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as DiscoverySort)}
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
              >
                <option value="activity">Most active</option>
                <option value="latest">Latest</option>
                <option value="a-z">A-Z</option>
              </select>
            </label>
            <label className="block text-sm text-white/62">
              Recruiting
              <select
                value={recruiting}
                onChange={(event) => setRecruiting(event.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
              >
                <option value="all">All</option>
                <option value="OPEN">Open</option>
                <option value="LIMITED">Limited</option>
                <option value="CLOSED">Closed</option>
              </select>
            </label>
          </div>
          <label className="block text-sm text-white/62">
            Privacy
            <select
              value={privacy}
              onChange={(event) => setPrivacy(event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
            >
              <option value="all">All</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </label>
        </FilterPanel>

        <FilterPanel title="Focus" description="Jump between the major discovery surfaces without losing your current search and filters.">
          <div className="flex flex-wrap gap-2">
            {tabs.map((value) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition",
                  tab === value
                    ? "border-cyan-400/24 bg-cyan-400/12 text-cyan-100"
                    : "border-white/10 bg-white/6 text-white/58 hover:text-white",
                )}
              >
                {titleCase(value)}
              </button>
            ))}
          </div>
        </FilterPanel>

        <div className="surface-panel p-5">
          <div className="panel-label">Result pulse</div>
          <div className="mt-4 grid gap-3 text-sm text-white/62">
            <div className="surface-panel-soft flex items-center justify-between p-3">
              <span>Companies</span>
              <span>{filteredCompanies.length}</span>
            </div>
            <div className="surface-panel-soft flex items-center justify-between p-3">
              <span>Members</span>
              <span>{filteredUsers.length}</span>
            </div>
            <div className="surface-panel-soft flex items-center justify-between p-3">
              <span>Posts + Projects</span>
              <span>{filteredPosts.length + filteredProjects.length}</span>
            </div>
            <div className="surface-panel-soft flex items-center justify-between p-3">
              <span>Build requests</span>
              <span>{filteredRequests.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section className="surface-panel-strong overflow-hidden p-6 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/18 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                <Compass className="size-3.5" />
                Discovery hub
              </div>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white">Find the next company, member, or project thread worth following.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">
                Discovery is tuned for PrismMTR&apos;s social-company model: visible communities, rich member identity, public posts, and work surfaces that still feel useful on a smaller seed dataset.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-white/42">
                <span>{totalResults} visible results</span>
                {deferredQuery ? <span>Query: {deferredQuery}</span> : <span>No search query applied</span>}
              </div>
            </div>
            <div className="grid gap-3">
              <div className="surface-panel-soft p-4">
                <div className="panel-label">Featured company</div>
                <div className="mt-3 text-lg font-semibold text-white">{featuredCompany?.name ?? "No company matches"}</div>
                <p className="mt-2 text-sm leading-6 text-white/58">{featuredCompany?.description ?? "Adjust the current filters to surface a different set of companies."}</p>
              </div>
              <div className="surface-panel-soft p-4">
                <div className="panel-label">Featured member</div>
                <div className="mt-3 text-lg font-semibold text-white">{featuredUser?.displayName ?? "No member matches"}</div>
                <p className="mt-2 text-sm leading-6 text-white/58">{featuredUser?.bio ?? "Discovery cards keep user identity rich even before the dataset grows."}</p>
              </div>
            </div>
          </div>
        </section>

        {(tab === "all" || tab === "companies") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-cyan-200/72" />
                <h2 className="font-display text-2xl font-semibold text-white">Companies</h2>
              </div>
              <span className="text-sm text-white/56">{filteredCompanies.length} results</span>
            </div>
            {filteredCompanies.length ? (
              <div className="grid gap-5 2xl:grid-cols-2">
                {filteredCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} compact />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={SearchSlash}
                title="No companies match the current filters"
                description="Try broadening recruiting or privacy filters, or switch the discovery surface to members or posts."
              />
            )}
          </section>
        )}

        {(tab === "all" || tab === "users") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersRound className="size-4 text-cyan-200/72" />
                <h2 className="font-display text-2xl font-semibold text-white">Members</h2>
              </div>
              <span className="text-sm text-white/56">{filteredUsers.length} results</span>
            </div>
            {filteredUsers.length ? (
              <div className="grid gap-4 2xl:grid-cols-2">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={UsersRound}
                title="No members match this search"
                description="Try searching by display name, handle, company, or a looser term."
              />
            )}
          </section>
        )}

        {(tab === "all" || tab === "posts") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="size-4 text-cyan-200/72" />
                <h2 className="font-display text-2xl font-semibold text-white">Posts</h2>
              </div>
              <span className="text-sm text-white/56">{filteredPosts.length} results</span>
            </div>
            {filteredPosts.length ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Newspaper}
                title="No posts surfaced"
                description="Search broader topics or switch to projects and requests to keep exploring the network."
              />
            )}
          </section>
        )}

        {(tab === "all" || tab === "projects") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-cyan-200/72" />
                <h2 className="font-display text-2xl font-semibold text-white">Projects</h2>
              </div>
              <span className="text-sm text-white/56">{filteredProjects.length} results</span>
            </div>
            {filteredProjects.length ? (
              <div className="grid gap-4 2xl:grid-cols-2">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No projects match right now"
                description="Projects will appear here as public company work becomes visible."
              />
            )}
          </section>
        )}

        {(tab === "all" || tab === "requests") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="size-4 text-cyan-200/72" />
                <h2 className="font-display text-2xl font-semibold text-white">Build Requests</h2>
              </div>
              <span className="text-sm text-white/56">{filteredRequests.length} results</span>
            </div>
            {filteredRequests.length ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <BuildRequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="No build requests are visible"
                description="This surface fills out as companies publish new requests or members submit public work needs."
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
