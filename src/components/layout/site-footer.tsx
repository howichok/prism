import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="surface-panel flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="panel-label">PrismMTR</div>
            <div className="font-display text-3xl leading-none text-white">Transit infrastructure for communities.</div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Community identity and company management platform for Minecraft Transit Railway.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <Link href="/" className="rounded-full border border-transparent px-3 py-2 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-foreground">
              Home
            </Link>
            <Link href="/discovery" className="rounded-full border border-transparent px-3 py-2 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-foreground">
              Discovery
            </Link>
            <Link href="/companies" className="rounded-full border border-transparent px-3 py-2 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-foreground">
              Companies
            </Link>
            <Link href="/sign-in" className="rounded-full border border-transparent px-3 py-2 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-foreground">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
