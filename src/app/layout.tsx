import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { TooltipLayer } from "@/components/providers/tooltip-layer";

import "./globals.css";

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
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
      <body className={`${sans.variable} ${display.variable} min-h-screen bg-[#050a14] text-white antialiased`}>
        <TooltipLayer>{children}</TooltipLayer>
      </body>
    </html>
  );
}
