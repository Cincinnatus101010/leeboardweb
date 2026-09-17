import { Footer, Link } from "@iantroisi/ui";
import { Link as RouterLink } from "react-router-dom";

const LINKS = [
  { to: "/docs/api", label: "API", external: false },
  {
    href: "https://github.com/Cincinnatus101010/steddy",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://www.npmjs.com/package/steddy",
    label: "npm",
    external: true,
  },
] as const;

export function SiteFooter() {
  return (
    <Footer brand="Steddy" className="site-footer">
      <nav className="site-footer__nav" aria-label="Site links">
        {LINKS.map((item) =>
          item.external ? (
            <Link
              key={item.label}
              href={item.href}
              className="site-footer__link"
            >
              {item.label}
            </Link>
          ) : (
            <RouterLink
              key={item.label}
              to={item.to}
              className="site-footer__link"
            >
              {item.label}
            </RouterLink>
          ),
        )}
      </nav>
    </Footer>
  );
}
