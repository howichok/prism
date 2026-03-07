import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/platform/page-header";
import { dashboardSidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function DashboardSettingsPage() {
  const viewer = await requireUser({ onboarded: true });

  return (
    <AppShell title="Dashboard" description="Manage linked accounts and access settings." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        description="Discord remains primary auth. Email/password and Microsoft linkage are future-ready additions."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">Linked accounts</h2>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            {viewer.linkedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                <span>{account.provider}</span>
                <span className="text-xs text-muted-foreground/60">{account.providerAccountId ? `· ${account.providerAccountId}` : "Connected"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">Launcher readiness</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Microsoft linkage and launcher account handoff are separated from this MVP. The user model and linked account structure are already prepared for future launcher integration.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
