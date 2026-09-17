import {
  Button,
  Link,
  MobileNav,
  Navbar,
  NavbarLink,
  ThemeToggle,
  useDisclosure,
  useMediaQuery,
} from "@iantroisi/ui";

const links = [
  { href: "#abort", label: "Abort" },
  { href: "#bench", label: "Bench" },
  { href: "#api", label: "API" },
] as const;

export function SiteNav() {
  const compact = useMediaQuery("(max-width: 47.99rem)", false);
  const nav = useDisclosure();

  return (
    <Navbar
      className="site-navbar"
      brand={<Link href="#top">Steddy</Link>}
    >
      {compact ? (
        <MobileNav
          open={nav.isOpen}
          onOpen={nav.open}
          onClose={nav.close}
          title="On this page"
          triggerLabel="Menu"
        >
          {links.map((link) => (
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
          {links.map((link) => (
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
