import Link from "next/link";
import Logo from "@/components/Logo";
import EmailSignup from "@/components/EmailSignup";
import { PHONE_NUMBER } from "@/lib/tiers";

/* Site-wide footer, used on every normal scrolling page (the AI Tools and AI
   Hub sections, the package pages, and the legal pages). The homepage's resting
   state is the fixed services stage, so it has no natural bottom for this. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo />

          <div className="footer-social">
            <a
              href="https://www.instagram.com/aitechnologyhelper/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/people/AI-Technology-Helper/61587795237256/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.5 8.5h2V5.6h-2.4c-2 0-3.1 1.2-3.1 3.2v1.9H9v2.9h2v6.9h3v-6.9h2.2l.4-2.9H14v-1.4c0-.6.2-.8.9-.8Z" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/ai-tech-helper/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
                <path d="M7 10v7M7 7v.02M11 17v-4c0-1.2.9-2 2-2s2 .8 2 2v4M11 17v-7" />
              </svg>
            </a>
            <a
              href="https://x.com/AITechHelper"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4l16 16M20 4L4 20" />
              </svg>
            </a>
          </div>

          <a className="footer-call" href={`tel:${PHONE_NUMBER}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.5 3.5 8.8 4l.9 3.3-1.8 1.4a11 11 0 0 0 4 4l1.4-1.8 3.3.9.5 2.3a1.6 1.6 0 0 1-1.7 1.9A13.5 13.5 0 0 1 4.6 5.2 1.6 1.6 0 0 1 6.5 3.5Z" fill="currentColor" stroke="none" />
            </svg>
            Call Now
          </a>

          <p className="footer-loc">Tulsa, OK</p>
        </div>

        <nav className="footer-col" aria-label="Services">
          <h3>Services</h3>
          <Link href="/bronze">Bronze</Link>
          <Link href="/silver">Silver</Link>
          <Link href="/gold">Gold</Link>
        </nav>

        <nav className="footer-col" aria-label="Resources">
          <h3>Resources</h3>
          <Link href="/ai-tools">AI Tools</Link>
          <Link href="/ai-hub">AI Hub</Link>
        </nav>

        <EmailSignup />
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} AI Tech Helper LLC</span>
        <div className="footer-legal">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms and Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
