"use client";

import Link from "next/link";
import { CompanyRole } from "@prisma/client";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, UserSearch } from "lucide-react";

import { MemberRoleEditor } from "@/components/forms/member-role-editor";
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

      const matchesSearch = !search || searchSpace.includes(search);

      return matchesRole && matchesSearch;
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
      <div className="space-y-6">
        <div className="surface-panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="panel-label">Roster controls</div>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Search by member name, handle, Minecraft nickname, or Discord identity and then focus the roster by role level.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["ALL", ...roleOrder] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition",
                    roleFilter === role
                      ? "border-cyan-400/24 bg-cyan-400/12 text-cyan-100"
                      : "border-white/10 bg-white/6 text-white/58 hover:text-white",
                  )}
                >
                  {role === "ALL" ? "All roles" : role.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>
          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/36" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search members, handles, Minecraft names, or bios"
              className="h-[3.25rem] w-full rounded-[1.2rem] border border-white/10 bg-white/6 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/36"
            />
          </div>
        </div>

        <div className="space-y-4">
          {groupedMembers.map((group) =>
            group.members.length ? (
              <section key={group.role} className="surface-panel p-5">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div className="flex items-center gap-3">
                    <RoleBadge kind="company" role={group.role} />
                    <div className="text-sm text-white/56">{group.members.length} members</div>
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Role group</div>
                </div>
                <div className="mt-4 space-y-3">
                  {group.members.map((member) => {
                    const active = selectedMember?.id === member.id;
                    const manageable = canManageRole(currentRole, member.companyRole);

                    return (
                      <div
                        key={member.id}
                        className={cn(
                          "rounded-[1.4rem] border p-3 transition",
                          active
                            ? "border-cyan-400/24 bg-cyan-400/10 shadow-[inset_0_0_0_1px_rgba(85,212,255,0.12)]"
                            : "border-white/10 bg-white/4 hover:border-white/16 hover:bg-white/6",
                        )}
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <button
                            onClick={() => setSelectedMemberId(member.id)}
                            className="flex min-w-0 flex-1 items-center gap-4 text-left"
                          >
                            <MiniProfileHoverCard user={member} companyRole={member.companyRole} primaryCompany={company}>
                              <div className="flex items-center gap-4">
                                <UserAvatar name={member.displayName} image={member.avatarUrl} accentColor={member.accentColor} />
                                <div className="min-w-0">
                                  <div className="truncate text-base font-semibold text-white">{member.displayName}</div>
                                  <div className="truncate text-sm text-white/56">@{member.username ?? "member"}</div>
                                </div>
                              </div>
                            </MiniProfileHoverCard>
                          </button>
                          <div className="flex flex-wrap items-center gap-2">
                            {member.badges.slice(0, 2).map((badge) => (
                              <span
                                key={badge.id}
                                className="rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white"
                                style={{ borderColor: `${badge.color}50`, backgroundColor: `${badge.color}20` }}
                              >
                                {badge.name}
                              </span>
                            ))}
                            {manageable ? (
                              <span className="rounded-full border border-cyan-400/18 bg-cyan-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-100">
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
            <div className="surface-panel-strong p-8 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-3xl border border-white/10 bg-white/6">
                <UserSearch className="size-5 text-white/72" />
              </div>
              <div className="mt-4 font-display text-2xl font-semibold text-white">No members match this roster filter</div>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Clear the search or widen the role filter to bring more members back into the company roster.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="surface-panel xl:sticky xl:top-24 xl:self-start">
        {selectedMember ? (
          <div className="overflow-hidden">
            <div
              className="h-32 border-b border-white/10"
              style={{
                background: selectedMember.bannerUrl
                  ? `linear-gradient(135deg, rgba(5,10,20,0.2), rgba(5,10,20,0.88)), url(${selectedMember.bannerUrl})`
                  : `linear-gradient(135deg, ${selectedMember.accentColor ?? "#55d4ff"} 0%, rgba(8, 15, 30, 0.96) 100%)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="space-y-5 p-5">
              <div className="-mt-16 flex items-end gap-4">
                <UserAvatar
                  name={selectedMember.displayName}
                  image={selectedMember.avatarUrl}
                  accentColor={selectedMember.accentColor}
                  size="lg"
                  className="size-22 border-4 border-[#07101d]"
                />
                <div className="pb-2">
                  <div className="font-display text-2xl font-semibold text-white">{selectedMember.displayName}</div>
                  <div className="text-sm text-white/58">@{selectedMember.username ?? "member"}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <RoleBadge kind="company" role={selectedMember.companyRole} />
                {selectedMember.siteRole !== "USER" ? <RoleBadge kind="site" role={selectedMember.siteRole} /> : null}
              </div>

              <p className="text-sm leading-7 text-white/64">{selectedMember.bio ?? "No bio added yet."}</p>

              <div className="grid gap-3">
                <div className="surface-panel-soft p-4">
                  <div className="panel-label">Member details</div>
                  <div className="mt-3 space-y-2 text-sm text-white/64">
                    <div>Joined company: {formatDate(selectedMember.joinedAt)}</div>
                    <div>Joined PrismMTR: {formatDate(selectedMember.createdAt)}</div>
                    <div>Minecraft: {selectedMember.minecraftNickname ?? "Not set"}</div>
                  </div>
                </div>

                <div className="surface-panel-soft p-4">
                  <div className="panel-label">Badges</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedMember.badges.length ? (
                      selectedMember.badges.map((badge) => (
                        <span
                          key={badge.id}
                          className="rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white"
                          style={{ borderColor: `${badge.color}50`, backgroundColor: `${badge.color}20` }}
                        >
                          {badge.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-white/48">No badges assigned yet.</span>
                    )}
                  </div>
                </div>

                {canManageRole(currentRole, selectedMember.companyRole) ? (
                  <div className="surface-panel-soft p-4">
                    <div className="flex items-center gap-2 text-cyan-100">
                      <ShieldCheck className="size-4" />
                      <div className="panel-label">Role management</div>
                    </div>
                    <div className="mt-4">
                      <MemberRoleEditor companyId={company.id} memberId={selectedMember.id} currentRole={selectedMember.companyRole} />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button variant="outline" render={<Link href={`/users/${selectedMember.username ?? ""}`} />}>
                  View profile
                </Button>
                <Button variant="secondary" onClick={() => setSelectedMemberId(selectedMember.id)}>
                  Focused member
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-sm text-white/58">Select a member from the roster to inspect their full company presence.</div>
        )}
      </aside>
    </div>
  );
}
