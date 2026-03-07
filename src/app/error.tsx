"use client";

import Link from "next/link";
import { AlertTriangle, Compass, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] Unhandled application error.", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050a14] px-6">
      <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/4 p-10 text-center shadow-[0_34px_120px_-54px_rgba(0,0,0,0.95)]">
        <div className="mx-auto flex size-14 items-center justify-center rounded-3xl border border-white/10 bg-white/6">
          <AlertTriangle className="size-5 text-white/80" />
        </div>
        <div className="mt-6 text-xs uppercase tracking-[0.24em] text-cyan-200/70">Application error</div>
        <h1 className="mt-4 font-display text-4xl font-semibold text-white">The network hit a server problem.</h1>
        <p className="mt-4 text-sm leading-7 text-white/60">
          PrismMTR is online, but this request failed on the server. Retry once, then fall back to discovery while the deployment issue is being checked.
        </p>
        {error.digest ? <div className="mt-4 text-xs text-white/40">Reference: {error.digest}</div> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCcw className="size-4" />
            Try again
          </Button>
          <Button variant="outline" render={<Link href="/" />}>
            Home
          </Button>
          <Button variant="outline" render={<Link href="/discovery" />}>
            <Compass className="size-4" />
            Discovery
          </Button>
        </div>
      </div>
    </div>
  );
}
