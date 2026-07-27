import Logo from "@/components/Logo";
import ContactButton from "@/components/ContactButton";
import MobileMenu from "@/components/MobileMenu";

/* Sticky top nav for the homepage. Reuses the site-wide .nav / .nav-links /
   .cta-pill styling; the sticky translucent bar is styled via .home-nav. */
export default function HomeNav() {
  return (
    <header className="home-nav">
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#process">How it works</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
          <a href="/ai-tools">AI Tools</a>
          <a href="/ai-hub">AI Hub</a>
        </div>
        <ContactButton />
        <MobileMenu />
      </nav>
    </header>
  );
}
