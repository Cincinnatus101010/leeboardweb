import {
  AppShell,
  Footer,
  Link,
  ThemeProvider,
  Typography,
} from "@iantroisi/ui";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
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
        <Footer brand="Steddy">
          <Typography variant="small" tone="muted">
            <RouterLink to="/docs" className="site-router-link">
              Docs
            </RouterLink>
            {" · "}
            Explainer for{" "}
            <Link href="https://www.npmjs.com/package/steddy">steddy</Link>. UI
            from{" "}
            <Link href="https://www.npmjs.com/package/@iantroisi/ui">
              @iantroisi/ui
            </Link>
            .
          </Typography>
        </Footer>
      </AppShell>
    </ThemeProvider>
  );
}
