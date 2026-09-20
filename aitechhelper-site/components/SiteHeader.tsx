import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import NavLink from "@/components/NavLink";

/* The single site-wide header, used on every page with no per-page variation.
   Sticky translucent bar (.home-nav). Links: Logo | Services | About | Contact.
   AI Hub and Top AI Tools live in the footer only. */
export default function SiteHeader() {
  return (
    <header className="home-nav">
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <NavLink href="/services">Services</NavLink>
          <NavLink href="/about">About</NavLink>
        </div>
        <a href="/contact" className="cta-pill">
          Contact Us
        </a>
        <MobileMenu />
      </nav>
    </header>
  );
}
