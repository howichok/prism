"use client";

import { TooltipProvider } from "@/components/ui/tooltip";

export function TooltipLayer({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
