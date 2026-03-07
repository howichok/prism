import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050a14] px-6">
      <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/4 p-10 text-center">
        <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Not Found</div>
        <h1 className="mt-4 font-display text-4xl font-semibold text-white">This route left the network.</h1>
        <p className="mt-4 text-sm leading-7 text-white/60">
          The page you requested does not exist or is no longer public. Head back to discovery or return home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button render={<Link href="/" />}>Home</Button>
          <Button variant="outline" render={<Link href="/discovery" />} className="border-white/10 bg-white/6 text-white hover:bg-white/10">
            Discovery
          </Button>
        </div>
      </div>
    </div>
  );
}
