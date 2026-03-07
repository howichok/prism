import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { isDiscordAuthConfigured } from "@/lib/env";
import { getOptionalSessionUser } from "@/lib/session";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getOptionalSessionUser();

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,hsl(192_91%_55%/0.04),transparent_60%)]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader viewer={viewer} discordAuthConfigured={isDiscordAuthConfigured} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
