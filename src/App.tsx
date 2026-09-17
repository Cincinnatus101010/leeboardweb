import {
  AppShell,
  Footer,
  Link,
  ThemeProvider,
  Typography,
} from "@iantroisi/ui";
import { HomePage } from "./HomePage";
import { SiteNav } from "./SiteNav";

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="troisi-theme">
      <Link href="#main" className="site-skip">
        Skip to content
      </Link>
      <AppShell navbar={<SiteNav />}>
        <main id="main" className="site-main" tabIndex={-1}>
          <HomePage />
        </main>
        <Footer brand="Leeboard">
          <Typography variant="small" tone="muted">
            Explainer for the Leeboard fetch library. UI from{" "}
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
