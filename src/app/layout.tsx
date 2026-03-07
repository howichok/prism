import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";

import { TooltipLayer } from "@/components/providers/tooltip-layer";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "PrismMTR",
    template: "%s | PrismMTR",
  },
  description:
    "PrismMTR is the community and company management platform for Minecraft Transit Railway.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} min-h-screen bg-background text-foreground antialiased font-sans`}
      >
        <TooltipLayer>{children}</TooltipLayer>
      </body>
    </html>
  );
}
