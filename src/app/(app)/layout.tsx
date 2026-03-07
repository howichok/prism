import { SiteHeader } from "@/components/layout/site-header";
import { isDiscordAuthConfigured } from "@/lib/env";
import { requireUser } from "@/lib/session";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireUser();

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <SiteHeader viewer={viewer} discordAuthConfigured={isDiscordAuthConfigured} />
        {children}
      </div>
    </div>
  );
}
