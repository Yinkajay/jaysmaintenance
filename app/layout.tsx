import type { Metadata, Viewport } from "next";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/geist/700.css";
import "./globals.css";
import { SiteProvider } from "@/components/site-provider";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: { default: "Jay’s site log", template: "%s · Jay’s site log" },
  description: "A practical construction site activity log. Keep location tasks and photo updates in one place.",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f7f2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteProvider><AppShell>{children}</AppShell></SiteProvider></body></html>;
}
