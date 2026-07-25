import type { Metadata } from "next";
import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Tech Helper",
  description: "How AI Tech Helper LLC collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="page hub">
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="/#services">Services</a>
          <NavLink href="/ai-tools">AI Tools</NavLink>
          <NavLink href="/ai-hub">AI Hub</NavLink>
        </div>
        <a href="#" className="cta-pill">
          Contact Us
        </a>
      </nav>

      <article className="legal">
        <span className="eyebrow">Legal</span>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: May 14, 2026</p>

        <p>
          AI Tech Helper LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates
          aitechhelper.com and related AI services. This Privacy Policy explains how we collect,
          use, and protect your information.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly — including your name, email address, phone
          number, and business information when you contact us, complete an audit, or use our
          services.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          We use your information to provide and improve our services, respond to inquiries, send
          relevant communications about our AI solutions, and fulfill our contractual obligations to
          you.
        </p>

        <h2>Data Sharing</h2>
        <p>
          We do not sell your personal information. We may share data with trusted third-party
          service providers who assist in operating our platform, subject to confidentiality
          agreements.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your information from
          unauthorized access, disclosure, or misuse.
        </p>

        <h2>Cookies</h2>
        <p>
          Our website may use cookies to improve user experience. You may disable cookies through
          your browser settings.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data at any time by
          contacting us at{" "}
          <a href="mailto:william@aitechhelper.com">william@aitechhelper.com</a>.
        </p>

        <h2>Contact Us</h2>
        <p>
          AI Tech Helper LLC
          <br />
          <a href="mailto:william@aitechhelper.com">william@aitechhelper.com</a>
          <br />
          aitechhelper.com
          <br />
          Tulsa, Oklahoma
        </p>
      </article>

      <Footer />
    </div>
  );
}
