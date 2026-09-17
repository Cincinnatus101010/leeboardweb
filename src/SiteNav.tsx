import {
  Button,
  MobileNav,
  Navbar,
  NavbarLink,
  ThemeToggle,
  useDisclosure,
  useMediaQuery,
} from "@iantroisi/ui";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { API_NAV } from "./apiNav";

const homeLinks = [
  { href: "#try", label: "Try" },
  { href: "#abort", label: "Abort" },
  { href: "#bench", label: "Bench" },
  { href: "#api", label: "API" },
] as const;

const docsLinks = API_NAV.map((item) => ({
  href: `#${item.id}`,
  label: item.label,
}));

export function SiteNav() {
  const compact = useMediaQuery("(max-width: 47.99rem)", false);
  const nav = useDisclosure();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onDocs = pathname.includes("/docs");
  const sectionLinks = onDocs ? docsLinks : homeLinks;

  return (
    <Navbar
      className="site-navbar"
      brand={
        <RouterLink to="/" className="site-router-link site-brand">
          Steddy
        </RouterLink>
      }
    >
      {compact ? (
        <MobileNav
          open={nav.isOpen}
          onOpen={nav.open}
          onClose={nav.close}
          title="On this page"
          triggerLabel="Menu"
        >
          {!onDocs ? (
            <Button
              variant="ghost"
              onClick={() => {
                nav.close();
                navigate("/docs/api");
              }}
            >
              API
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                nav.close();
                navigate("/");
              }}
            >
              Explainer
            </Button>
          )}
          {sectionLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              onClick={() => {
                nav.close();
                document
                  .querySelector(link.href)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {link.label}
            </Button>
          ))}
        </MobileNav>
      ) : (
        <>
          {!onDocs ? (
            <RouterLink to="/docs/api" className="site-router-link site-nav-link">
              API
            </RouterLink>
          ) : (
            <RouterLink to="/" className="site-router-link site-nav-link">
              Explainer
            </RouterLink>
          )}
          {sectionLinks.map((link) => (
            <NavbarLink key={link.href} href={link.href}>
              {link.label}
            </NavbarLink>
          ))}
          <ThemeToggle includeSystem />
        </>
      )}
      {compact ? <ThemeToggle includeSystem /> : null}
    </Navbar>
  );
}
