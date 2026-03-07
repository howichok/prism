import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/platform/page-header";
import { dashboardSidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function DashboardSettingsPage() {
  const viewer = await requireUser({ onboarded: true });

  return (
    <AppShell title="Dashboard" description="Manage linked accounts and future-ready access settings." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        description="Discord remains primary auth. Email/password and Microsoft linkage are future-ready additions layered on top."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.8rem] border border-white/10 bg-white/4 p-6">
          <h2 className="font-display text-2xl font-semibold text-white">Linked accounts</h2>
          <div className="mt-4 space-y-3 text-sm text-white/62">
            {viewer.linkedAccounts.map((account) => (
              <div key={account.id} className="rounded-2xl border border-white/8 bg-white/6 p-4">
                {account.provider} {account.providerAccountId ? `· ${account.providerAccountId}` : ""}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.8rem] border border-white/10 bg-white/4 p-6">
          <h2 className="font-display text-2xl font-semibold text-white">Launcher readiness</h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Microsoft linkage and launcher account handoff are intentionally separated from this MVP. The user model and linked account structure are already prepared so the launcher can attach later without breaking existing identities.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
