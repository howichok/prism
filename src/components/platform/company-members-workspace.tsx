"use client";

import Link from "next/link";
import { CompanyRole } from "@prisma/client";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, UserSearch } from "lucide-react";

import { MemberRoleEditor } from "@/components/forms/member-role-editor";
import { EmptyState } from "@/components/platform/empty-state";
import { IdentityPanel, ProfileIdentitySurface } from "@/components/platform/profile-identity";
import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { RoleBadge } from "@/components/platform/role-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import type { CompanySummary, UserPreview } from "@/lib/data";
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
        <div className="surface-panel-strong p-5">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
            <div>
              <div className="panel-label">Roster controls</div>
              <h2 className="mt-3 font-display text-[1.9rem] leading-[0.94] text-white">Search the company identity graph</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Search by name, handle, Discord identity, Minecraft nickname, or bio. Filter by role when you need a narrower operational view.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4">
              <div className="panel-label">Visible members</div>
              <div className="mt-3 font-display text-[2rem] leading-none text-white">{filteredMembers.length}</div>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                {roleFilter === "ALL" ? "Across all visible roles" : `Filtered to ${roleFilter.replaceAll("_", " ").toLowerCase()}`}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search members, handles, Minecraft names, or bios"
                className="h-11 w-full rounded-[1rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-blue-400/28"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["ALL", ...roleOrder] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-200",
                    roleFilter === role
                      ? "border-blue-400/22 bg-blue-400/12 text-blue-200"
                      : "border-white/8 bg-white/[0.03] text-white/54 hover:border-white/14 hover:text-white",
                  )}
                >
                  {role === "ALL" ? "All roles" : role.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {groupedMembers.map((group) =>
            group.members.length ? (
              <section key={group.role} className="surface-panel space-y-4 p-4">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div className="flex items-center gap-2">
                    <RoleBadge kind="company" role={group.role} />
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/42">{group.members.length} members</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {group.members.map((member) => {
                    const active = selectedMember?.id === member.id;
                    const manageable = canManageRole(currentRole, member.companyRole);

                    return (
                      <div
                        key={member.id}
                        className={cn(
                          "rounded-lg border p-2.5 transition-colors",
                          active
                            ? "border-blue-400/22 bg-blue-400/[0.08]"
                            : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.05]",
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
                              <span className="rounded-full border border-blue-400/18 bg-blue-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-blue-200">
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

      <aside className="surface-panel-strong overflow-hidden xl:sticky xl:top-28 xl:self-start">
        {selectedMember ? (
          <div className="space-y-4 p-4">
            <ProfileIdentitySurface
              user={selectedMember}
              companyRole={selectedMember.companyRole}
              primaryCompany={company}
              variant="preview"
              headerLabel="Selected member"
              actionRow={
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button variant="outline" size="sm" render={<Link href={`/users/${selectedMember.username ?? ""}`} />}>
                    View profile
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setSelectedMemberId(selectedMember.id)}>
                    Focused
                  </Button>
                </div>
              }
            />

            {canManageRole(currentRole, selectedMember.companyRole) ? (
              <IdentityPanel title="Role management">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="size-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Manage company role</span>
                </div>
                <div className="mt-3">
                  <MemberRoleEditor companyId={company.id} memberId={selectedMember.id} currentRole={selectedMember.companyRole} />
                </div>
              </IdentityPanel>
            ) : null}
          </div>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Select a member from the roster.</div>
        )}
      </aside>
    </div>
  );
}
