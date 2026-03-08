"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import {
  Building2,
  ClipboardList,
  Compass,
  LayoutGrid,
  Newspaper,
  SearchSlash,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { BuildRequestCard } from "@/components/platform/build-request-card";
import { CompanyCard } from "@/components/platform/company-card";
import { IdentityPanel, ProfileIdentitySurface, resolveProfilePresence } from "@/components/platform/profile-identity";
import { ProfileRosterRow } from "@/components/platform/profile-roster-row";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { RoleBadge } from "@/components/platform/role-badge";
import { SearchBar } from "@/components/platform/search-bar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BuildRequestSummary, CompanySummary, PostSummary, ProjectSummary, UserPreview } from "@/lib/data";
import {
  companyRoleRank,
  discoverySiteRoleOrder,
  getCompanyRoleLabel,
  getCompanyRoleSearchAliases,
  getDiscoveryGroupLabel,
  getSiteRoleLabel,
  getSiteRoleSearchAliases,
  getSiteRoleTheme,
} from "@/lib/role-system";
import { cn } from "@/lib/utils";

type DiscoveryTab = "all" | "companies" | "users" | "posts" | "projects" | "requests";
type DiscoverySort = "activity" | "latest" | "a-z";

const tabDefs: { value: DiscoveryTab; label: string; icon: LucideIcon }[] = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "companies", label: "Companies", icon: Building2 },
  { value: "users", label: "Members", icon: UsersRound },
  { value: "posts", label: "Posts", icon: Newspaper },
  { value: "projects", label: "Projects", icon: Sparkles },
  { value: "requests", label: "Requests", icon: ClipboardList },
];

function sortByName<T extends { title?: string; name?: string; displayName?: string }>(left: T, right: T) {
  const a = left.name ?? left.title ?? left.displayName ?? "";
  const b = right.name ?? right.title ?? right.displayName ?? "";
  return a.localeCompare(b);
}

function buildUserSearchSpace(user: UserPreview) {
  return [
    user.displayName,
    user.username ?? "",
    user.bio ?? "",
    user.minecraftNickname ?? "",
    user.discordUsername ?? "",
    getSiteRoleLabel(user.siteRole),
    getDiscoveryGroupLabel(user.siteRole),
    getSiteRoleSearchAliases(user.siteRole).join(" "),
    user.memberships.map((membership) => membership.company.name).join(" "),
    user.memberships.map((membership) => getCompanyRoleLabel(membership.companyRole)).join(" "),
    user.memberships.map((membership) => getCompanyRoleSearchAliases(membership.companyRole).join(" ")).join(" "),
    user.badges.map((badge) => badge.name).join(" "),
  ]
    .join(" ")
    .toLowerCase();
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
  const searchTerm = query.trim();

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
    const results = users.filter((user) => !deferredQuery || buildUserSearchSpace(user).includes(deferredQuery));

    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      if (sort === "latest") return right.createdAt.getTime() - left.createdAt.getTime();

      const siteRankDelta = discoverySiteRoleOrder.indexOf(left.siteRole) - discoverySiteRoleOrder.indexOf(right.siteRole);
      if (siteRankDelta !== 0) return siteRankDelta;

      const leftPrimaryRole = left.memberships[0]?.companyRole;
      const rightPrimaryRole = right.memberships[0]?.companyRole;
      const leftCompanyRank = leftPrimaryRole ? companyRoleRank[leftPrimaryRole] : -1;
      const rightCompanyRank = rightPrimaryRole ? companyRoleRank[rightPrimaryRole] : -1;
      if (leftCompanyRank !== rightCompanyRank) return rightCompanyRank - leftCompanyRank;

      if (left.badges.length !== right.badges.length) return right.badges.length - left.badges.length;
      if (left.memberships.length !== right.memberships.length) return right.memberships.length - left.memberships.length;

      return left.displayName.localeCompare(right.displayName);
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

  const tabCounts: Record<DiscoveryTab, number> = {
    all: filteredCompanies.length + filteredUsers.length + filteredPosts.length + filteredProjects.length + filteredRequests.length,
    companies: filteredCompanies.length,
    users: filteredUsers.length,
    posts: filteredPosts.length,
    projects: filteredProjects.length,
    requests: filteredRequests.length,
  };

  const allSections = [
    {
      key: "members",
      title: "Members",
      count: filteredUsers.length,
      viewAll: filteredUsers.length > 6 ? () => setTab("users") : undefined,
      content: <DiscoveryMembersRoster users={filteredUsers.slice(0, 6)} searchTerm={searchTerm} />,
    },
    {
      key: "companies",
      title: "Companies",
      count: filteredCompanies.length,
      viewAll: filteredCompanies.length > 3 ? () => setTab("companies") : undefined,
      content: (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredCompanies.slice(0, 3).map((company) => (
            <CompanyCard key={company.id} company={company} compact />
          ))}
        </div>
      ),
    },
    {
      key: "posts",
      title: "Posts",
      count: filteredPosts.length,
      viewAll: filteredPosts.length > 3 ? () => setTab("posts") : undefined,
      content: (
        <div className="space-y-2">
          {filteredPosts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ),
    },
    {
      key: "projects",
      title: "Projects",
      count: filteredProjects.length,
      viewAll: filteredProjects.length > 3 ? () => setTab("projects") : undefined,
      content: (
        <div className="grid gap-3 md:grid-cols-2">
          {filteredProjects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ),
    },
    {
      key: "requests",
      title: "Requests",
      count: filteredRequests.length,
      viewAll: filteredRequests.length > 3 ? () => setTab("requests") : undefined,
      content: (
        <div className="space-y-2">
          {filteredRequests.slice(0, 3).map((request) => (
            <BuildRequestCard key={request.id} request={request} />
          ))}
        </div>
      ),
    },
  ].filter((section) => section.count > 0);

  const showCompanyFilters = tab === "all" || tab === "companies";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 border-b border-white/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="size-5 text-blue-400" />
            <h1 className="font-display text-2xl text-white">Discovery</h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/66">
            Browse companies, members, posts, projects, and requests across the PrismMTR network.
          </p>
        </div>
        <div className="text-sm text-white/46">
          {tabCounts[tab]} {tab === "all" ? "results" : tab}
        </div>
      </div>

      <div className="space-y-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={
            tab === "users"
              ? "Search members by display name, handle, company, nickname, or role..."
              : "Search companies, members, tags, or descriptions..."
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={sort} onValueChange={(value) => setSort(value as DiscoverySort)}>
            <SelectTrigger className="h-8 w-auto min-w-[7rem] gap-1.5 rounded-lg border-white/8 bg-white/[0.03] px-3 text-xs text-white/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activity">Most active</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="a-z">A - Z</SelectItem>
            </SelectContent>
          </Select>

          {showCompanyFilters ? (
            <>
              <Select value={recruiting} onValueChange={(value) => setRecruiting(value ?? "all")}>
                <SelectTrigger className="h-8 w-auto min-w-[6.5rem] gap-1.5 rounded-lg border-white/8 bg-white/[0.03] px-3 text-xs text-white/60">
                  <SelectValue placeholder="Recruiting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All recruiting</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="LIMITED">Limited</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={privacy} onValueChange={(value) => setPrivacy(value ?? "all")}>
                <SelectTrigger className="h-8 w-auto min-w-[5.5rem] gap-1.5 rounded-lg border-white/8 bg-white/[0.03] px-3 text-xs text-white/60">
                  <SelectValue placeholder="Privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All privacy</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : null}

          {tab === "users" ? (
            <div className="text-xs text-white/42">
              Search matches name, handle, nickname, company, and role.
            </div>
          ) : null}

          {deferredQuery ? (
            <button onClick={() => setQuery("")} className="ml-auto text-xs text-white/36 transition-colors hover:text-white/66">
              Clear search
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-white/8 pb-px">
        {tabDefs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 px-3 py-2 text-[13px] font-medium transition-colors",
                active ? "text-white" : "text-white/38 hover:text-white/64",
              )}
            >
              <Icon className={cn("size-3.5", active ? "text-blue-400" : "")} />
              {t.label}
              <span className={cn("ml-0.5 text-[10px] tabular-nums", active ? "text-white/50" : "text-white/24")}>{tabCounts[t.value]}</span>
              {active ? <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-blue-400" /> : null}
            </button>
          );
        })}
      </div>

      {tab === "all" ? (
        allSections.length ? (
          <div className="space-y-10">
            {allSections.map((section) => (
              <ResultSection key={section.key} title={section.title} count={section.count} onViewAll={section.viewAll}>
                {section.content}
              </ResultSection>
            ))}
          </div>
        ) : (
          <CompactInlineEmpty
            icon={SearchSlash}
            title="No discovery results"
            description="Try searching by company, member, project, or role."
          />
        )
      ) : (
        <div key={tab} className="animate-fade-in">
          {tab === "companies" ? (
            filteredCompanies.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            ) : (
              <CompactInlineEmpty
                icon={SearchSlash}
                title="No companies match"
                description="Try broadening the search or switching back to all results."
              />
            )
          ) : null}

          {tab === "users" ? (
            filteredUsers.length ? (
              <DiscoveryMembersRoster users={filteredUsers} searchTerm={searchTerm} showPreview />
            ) : (
              <CompactInlineEmpty
                icon={UsersRound}
                title="No members match"
                description="Search by display name, handle, company, nickname, or role."
              />
            )
          ) : null}

          {tab === "posts" ? (
            filteredPosts.length ? (
              <div className="space-y-2">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <CompactInlineEmpty icon={Newspaper} title="No posts match" description="Try broadening your search." />
            )
          ) : null}

          {tab === "projects" ? (
            filteredProjects.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <CompactInlineEmpty icon={Sparkles} title="No projects match" description="No visible projects match this search." />
            )
          ) : null}

          {tab === "requests" ? (
            filteredRequests.length ? (
              <div className="space-y-2">
                {filteredRequests.map((request) => (
                  <BuildRequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <CompactInlineEmpty
                icon={ClipboardList}
                title="No requests match"
                description="No build requests match the current search."
              />
            )
          ) : null}
        </div>
      )}
    </div>
  );
}

function ResultSection({
  title,
  count,
  onViewAll,
  children,
}: {
  title: string;
  count: number;
  onViewAll?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-3">
        <h2 className="text-sm font-medium text-white/68">{title}</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/28">{count}</span>
          {onViewAll ? (
            <button onClick={onViewAll} className="text-xs text-white/36 transition-colors hover:text-white/66">
              View all
            </button>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function CompactInlineEmpty({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-white/8 py-5">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[0.9rem] border border-white/10 bg-white/[0.03]">
        <Icon className="size-4 text-white/42" />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium text-white/82">{title}</div>
        <p className="text-sm leading-6 text-white/52">{description}</p>
      </div>
    </div>
  );
}

function DiscoveryMembersRoster({
  users,
  searchTerm,
  showPreview = false,
}: {
  users: UserPreview[];
  searchTerm: string;
  showPreview?: boolean;
}) {
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id ?? "");
  const resolvedSelectedUserId = users.some((user) => user.id === selectedUserId) ? selectedUserId : (users[0]?.id ?? "");
  const selectedUser = users.find((user) => user.id === resolvedSelectedUserId) ?? null;

  const groupedUsers = useMemo(
    () =>
      discoverySiteRoleOrder
        .map((role) => ({
          role,
          label: getDiscoveryGroupLabel(role),
          theme: getSiteRoleTheme(role),
          members: users.filter((user) => user.siteRole === role),
        }))
        .filter((group) => group.members.length > 0),
    [users],
  );

  const roster = (
    <div className="space-y-6">
      {groupedUsers.map((group) => (
        <section key={group.role} className="space-y-2.5">
          <div className={cn("flex items-center justify-between border-b px-0 pb-2.5", group.theme.dividerClass)}>
            <div className="inline-flex items-center gap-2.5">
              <span className={cn("h-5 w-[3px] rounded-full", group.theme.rosterRowEdgeClass)} />
              <RoleBadge kind="site" role={group.role} />
              <span className={cn("rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]", group.theme.rosterGroupClass)}>
                {group.label}
              </span>
            </div>
            <span className={cn("text-[11px]", group.theme.rosterGroupCountClass)}>{group.members.length}</span>
          </div>

          <div className="space-y-1">
            {group.members.map((user) => (
              <ProfileRosterRow
                key={user.id}
                user={user}
                searchTerm={searchTerm}
                active={showPreview && selectedUser?.id === user.id}
                onSelect={() => setSelectedUserId(user.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  if (!showPreview) {
    return roster;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div>{roster}</div>
      <aside className="xl:sticky xl:top-24 xl:self-start">
        {selectedUser ? <DiscoveryMemberPreview user={selectedUser} /> : null}
      </aside>
    </div>
  );
}

function DiscoveryMemberPreview({ user }: { user: UserPreview }) {
  const { membership, company } = resolveProfilePresence(user);

  return (
    <div className="space-y-4">
      <ProfileIdentitySurface
        user={user}
        companyRole={membership?.companyRole}
        primaryCompany={company}
        variant="preview"
        headerLabel="Member preview"
        actionRow={
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" size="sm" render={<Link href={`/users/${user.username ?? ""}`} />}>
              View profile
            </Button>
            <Button variant="secondary" size="sm" render={<Link href={company ? `/companies/${company.slug}` : "/companies"} />}>
              {company ? "View company" : "Browse companies"}
            </Button>
          </div>
        }
      />

      <IdentityPanel title="Directory context">
        <div className="space-y-3 text-sm text-white/68">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <span className="text-white/50">Primary workspace</span>
            <span className="text-white">{company ? company.name : "Independent"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <span className="text-white/50">Memberships</span>
            <span className="text-white">{user.memberships.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Decorative badges</span>
            <span className="text-white">{user.badges.length}</span>
          </div>
        </div>
      </IdentityPanel>
    </div>
  );
}
