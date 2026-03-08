import { SiteHeader } from "@/components/layout/site-header";
import { isDiscordAuthConfigured } from "@/lib/env";
import { isGuestViewer, requireAppViewer } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireAppViewer();
  const headerViewer = {
    displayName: viewer.displayName,
    username: viewer.username,
    avatarUrl: viewer.avatarUrl,
    accentColor: viewer.accentColor,
    siteRole: viewer.siteRole,
    isGuest: isGuestViewer(viewer),
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <SiteHeader viewer={headerViewer} discordAuthConfigured={isDiscordAuthConfigured} />
        {children}
      </div>
    </div>
  );
}
