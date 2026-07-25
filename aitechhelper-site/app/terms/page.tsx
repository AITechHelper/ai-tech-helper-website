import type { Metadata } from "next";
import Logo from "@/components/Logo";
import ContactButton from "@/components/ContactButton";
import MobileMenu from "@/components/MobileMenu";
import NavLink from "@/components/NavLink";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — AI Tech Helper",
  description: "The terms that govern use of AI Tech Helper LLC services.",
};

export default function TermsPage() {
  return (
    <div className="page hub">
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="/#services">Services</a>
          <NavLink href="/ai-tools">AI Tools</NavLink>
          <NavLink href="/ai-hub">AI Hub</NavLink>
        </div>
        <ContactButton />
        <MobileMenu />
      </nav>

      <article className="legal">
        <span className="eyebrow">Legal</span>
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: May 14, 2026</p>

        <p>
          By accessing or using services provided by AI Tech Helper LLC (&ldquo;Company&rdquo;), you
          agree to these Terms of Service.
        </p>

        <h2>Services</h2>
        <p>
          AI Tech Helper LLC provides AI implementation services including but not limited to AI chat
          agents, voice agents, and workflow automation for businesses.
        </p>

        <h2>Payment</h2>
        <p>
          Services require a one-time setup fee and a monthly recurring fee as outlined in your
          service agreement. Fees are due upon invoice. Monthly fees are billed on a recurring basis
          until cancellation.
        </p>

        <h2>Cancellation</h2>
        <p>
          Either party may cancel services with 30 days written notice. Setup fees are
          non-refundable. Monthly fees already paid are non-refundable.
        </p>

        <h2>Client Responsibilities</h2>
        <p>
          Clients are responsible for providing accurate information necessary to configure AI
          services, obtaining any required consents from their customers for AI interactions, and
          complying with applicable laws.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          AI Tech Helper LLC is not liable for indirect, incidental, or consequential damages arising
          from use of our services. Our total liability shall not exceed fees paid in the prior 30
          days.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All AI configurations, workflows, and systems built by AI Tech Helper LLC remain the
          intellectual property of AI Tech Helper LLC unless otherwise agreed in writing.
        </p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of the State of Oklahoma.</p>

        <h2>Contact</h2>
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
