import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { isDiscordAuthConfigured } from "@/lib/env";
import { getOptionalSessionUser } from "@/lib/session";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getOptionalSessionUser();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(85,212,255,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,159,90,0.12),transparent_26%),linear-gradient(180deg,#050a14_0%,#04070f_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] opacity-25"
        style={{ backgroundSize: "72px 72px" }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader viewer={viewer} discordAuthConfigured={isDiscordAuthConfigured} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
