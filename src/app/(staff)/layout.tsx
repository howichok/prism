import { SiteHeader } from "@/components/layout/site-header";
import { isDiscordAuthConfigured } from "@/lib/env";
import { requireStaff } from "@/lib/session";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireStaff();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(85,212,255,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,159,90,0.12),transparent_26%),linear-gradient(180deg,#050a14_0%,#04070f_100%)]" />
      <div className="relative z-10">
        <SiteHeader viewer={viewer} discordAuthConfigured={isDiscordAuthConfigured} />
        {children}
      </div>
    </div>
  );
}
