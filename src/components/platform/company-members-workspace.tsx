"use client";

import Link from "next/link";
import { CompanyRole } from "@prisma/client";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, UserSearch } from "lucide-react";

import { MemberRoleEditor } from "@/components/forms/member-role-editor";
import { EmptyState } from "@/components/platform/empty-state";
import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { RoleBadge } from "@/components/platform/role-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import type { CompanySummary, UserPreview } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { canManageRole } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type CompanyMember = UserPreview & {
  companyRole: CompanyRole;
  joinedAt: Date;
};

const roleOrder: CompanyRole[] = [
  CompanyRole.OWNER,
  CompanyRole.CO_OWNER,
  CompanyRole.TRUSTED_MEMBER,
  CompanyRole.MEMBER,
];

export function CompanyMembersWorkspace({
  company,
  currentRole,
  members,
}: {
  company: CompanySummary;
  currentRole: CompanyRole;
  members: CompanyMember[];
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<CompanyRole | "ALL">("ALL");
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id ?? "");

  const filteredMembers = useMemo(() => {
    const search = query.trim().toLowerCase();

    return members.filter((member) => {
      const matchesRole = roleFilter === "ALL" || member.companyRole === roleFilter;
      const searchSpace = [
        member.displayName,
        member.username ?? "",
        member.discordUsername ?? "",
        member.bio ?? "",
        member.minecraftNickname ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesRole && (!search || searchSpace.includes(search));
    });
  }, [members, query, roleFilter]);

  const resolvedSelectedMemberId =
    filteredMembers.some((member) => member.id === selectedMemberId) ? selectedMemberId : (filteredMembers[0]?.id ?? "");

  const groupedMembers = useMemo(
    () =>
      roleOrder.map((role) => ({
        role,
        members: filteredMembers
          .filter((member) => member.companyRole === role)
          .sort((left, right) => left.displayName.localeCompare(right.displayName)),
      })),
    [filteredMembers],
  );

  const selectedMember = filteredMembers.find((member) => member.id === resolvedSelectedMemberId) ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        {/* Controls */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Roster controls</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Search by name, handle, Minecraft nickname, or Discord identity.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["ALL", ...roleOrder] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    roleFilter === role
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {role === "ALL" ? "All roles" : role.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search members, handles, Minecraft names, or bios"
              className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Member groups */}
        <div className="space-y-3">
          {groupedMembers.map((group) =>
            group.members.length ? (
              <section key={group.role} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <RoleBadge kind="company" role={group.role} />
                    <span className="text-xs text-muted-foreground">{group.members.length} members</span>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {group.members.map((member) => {
                    const active = selectedMember?.id === member.id;
                    const manageable = canManageRole(currentRole, member.companyRole);

                    return (
                      <div
                        key={member.id}
                        className={cn(
                          "rounded-lg border p-2.5 transition-colors",
                          active
                            ? "border-primary/30 bg-primary/5"
                            : "border-border/60 bg-muted/20 hover:bg-secondary",
                        )}
                      >
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                          <button
                            onClick={() => setSelectedMemberId(member.id)}
                            className="flex min-w-0 flex-1 items-center gap-3 text-left"
                          >
                            <MiniProfileHoverCard user={member} companyRole={member.companyRole} primaryCompany={company}>
                              <div className="flex items-center gap-3">
                                <UserAvatar name={member.displayName} image={member.avatarUrl} accentColor={member.accentColor} size="sm" />
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-medium text-foreground">{member.displayName}</div>
                                  <div className="truncate text-xs text-muted-foreground">@{member.username ?? "member"}</div>
                                </div>
                              </div>
                            </MiniProfileHoverCard>
                          </button>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {member.badges.slice(0, 2).map((badge) => (
                              <span
                                key={badge.id}
                                className="rounded-md border px-2 py-0.5 text-xs font-medium text-foreground"
                                style={{ borderColor: `${badge.color}40`, backgroundColor: `${badge.color}15` }}
                              >
                                {badge.name}
                              </span>
                            ))}
                            {manageable ? (
                              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                Manageable
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null,
          )}

          {!filteredMembers.length ? (
            <EmptyState
              icon={UserSearch}
              title="No members match"
              description="Clear the search or widen the role filter."
            />
          ) : null}
        </div>
      </div>

      {/* Selected member sidebar */}
      <aside className="rounded-xl border border-border bg-card xl:sticky xl:top-20 xl:self-start">
        {selectedMember ? (
          <div className="overflow-hidden">
            <div
              className="h-28 border-b border-border"
              style={{
                background: selectedMember.bannerUrl
                  ? `linear-gradient(to bottom, transparent 40%, hsl(240 5% 9%)), url(${selectedMember.bannerUrl})`
                  : `linear-gradient(135deg, ${selectedMember.accentColor ?? "hsl(192 91% 55%)"} 0%, hsl(240 5% 10%) 100%)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="space-y-4 p-4">
              <div className="-mt-12 flex items-end gap-3">
                <UserAvatar
                  name={selectedMember.displayName}
                  image={selectedMember.avatarUrl}
                  accentColor={selectedMember.accentColor}
                  size="lg"
                  className="size-16 border-[3px] border-card"
                />
                <div className="pb-1">
                  <div className="text-lg font-semibold text-foreground">{selectedMember.displayName}</div>
                  <div className="text-sm text-muted-foreground">@{selectedMember.username ?? "member"}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <RoleBadge kind="company" role={selectedMember.companyRole} />
                {selectedMember.siteRole !== "USER" ? <RoleBadge kind="site" role={selectedMember.siteRole} /> : null}
              </div>

              <p className="text-sm text-muted-foreground">{selectedMember.bio ?? "No bio added yet."}</p>

              <div className="space-y-2">
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Details</div>
                  <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    <div>Joined company: {formatDate(selectedMember.joinedAt)}</div>
                    <div>Joined PrismMTR: {formatDate(selectedMember.createdAt)}</div>
                    <div>Minecraft: {selectedMember.minecraftNickname ?? "Not set"}</div>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Badges</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedMember.badges.length ? (
                      selectedMember.badges.map((badge) => (
                        <span
                          key={badge.id}
                          className="rounded-md border px-2 py-0.5 text-xs font-medium text-foreground"
                          style={{ borderColor: `${badge.color}40`, backgroundColor: `${badge.color}15` }}
                        >
                          {badge.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground/60">No badges assigned yet.</span>
                    )}
                  </div>
                </div>

                {canManageRole(currentRole, selectedMember.companyRole) ? (
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-primary">
                      <ShieldCheck className="size-3.5" />
                      <span className="text-[11px] font-medium uppercase tracking-wider">Role management</span>
                    </div>
                    <div className="mt-3">
                      <MemberRoleEditor companyId={company.id} memberId={selectedMember.id} currentRole={selectedMember.companyRole} />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button variant="outline" size="sm" render={<Link href={`/users/${selectedMember.username ?? ""}`} />}>
                  View profile
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setSelectedMemberId(selectedMember.id)}>
                  Focused
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Select a member from the roster.</div>
        )}
      </aside>
    </div>
  );
}
