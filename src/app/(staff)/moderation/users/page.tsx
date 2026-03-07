import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/platform/page-header";
import { UserCard } from "@/components/platform/user-card";
import { getModerationUsersData } from "@/lib/data";
import { moderationSidebarItems } from "@/lib/navigation";

export default async function ModerationUsersPage() {
  const users = await getModerationUsersData();

  return (
    <AppShell title="Moderation" description="Review users and jump into their public profiles." items={moderationSidebarItems}>
      <PageHeader
        eyebrow="Users"
        title="User review"
        description="Staff can inspect rich member cards, current public role context, and overall identity presence before taking platform action."
      />
      <div className="grid gap-4 2xl:grid-cols-2">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </AppShell>
  );
}
