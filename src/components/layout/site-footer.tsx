import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.04] px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-base text-white">PrismMTR</div>
          <p className="mt-1 text-xs text-white/30">
            Community identity and company management for Minecraft Transit Railway.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-white/30">
          <Link href="/" className="transition-colors hover:text-white/60">Home</Link>
          <Link href="/discovery" className="transition-colors hover:text-white/60">Discovery</Link>
          <Link href="/companies" className="transition-colors hover:text-white/60">Companies</Link>
          <Link href="/sign-in" className="transition-colors hover:text-white/60">Sign In</Link>
        </nav>
      </div>
    </footer>
  );
}
