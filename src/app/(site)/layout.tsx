import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { isDiscordAuthConfigured } from "@/lib/env";
import { getOptionalViewer, isGuestViewer } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getOptionalViewer();
  const headerViewer = viewer
    ? {
        displayName: viewer.displayName,
        username: viewer.username,
        avatarUrl: viewer.avatarUrl,
        accentColor: viewer.accentColor,
        siteRole: viewer.siteRole,
        isGuest: isGuestViewer(viewer),
      }
    : null;

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader viewer={headerViewer} discordAuthConfigured={isDiscordAuthConfigured} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
