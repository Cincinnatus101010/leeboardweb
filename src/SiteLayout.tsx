import { AppShell, Link, ThemeProvider } from "@iantroisi/ui";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="troisi-theme">
      <Link href="#main" className="site-skip">
        Skip to content
      </Link>
      <AppShell navbar={<SiteNav />}>
        <main id="main" className="site-main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </AppShell>
    </ThemeProvider>
  );
}
