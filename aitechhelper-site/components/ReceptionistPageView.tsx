import ReceptionistPhone from "@/components/ReceptionistPhone";

/**
 * The full /ai-receptionist page body.
 *
 * This is the single source of truth for that page's markup: the route at
 * app/ai-receptionist/page.tsx renders it live, and the homepage carousel
 * renders the same component scaled down onto its 3D card. Editing the page
 * therefore updates the carousel preview automatically — they cannot drift.
 *
 * `interactive` is false for the preview, which drops the phone's click
 * handlers and element ids so a scaled-down copy can never hijack a tap or
 * collide with the real page's ids.
 */
export default function ReceptionistPageView({ interactive = true }: { interactive?: boolean }) {
  return (
    <div className="page">
      <nav className="nav">
        <div className="logo">
          <div className="logo-mark">AI</div>TECH <span className="dim">HELPER</span>
        </div>
        <div className="nav-links">
          <a href="/#stage">Agents</a>
          <a href="/#stage">Automations</a>
          <a href="#">AI Hub</a>
        </div>
        <a href="#" className="cta-pill">
          Contact Us
        </a>
      </nav>

      <div className="wrap">
        <div className="content">
          <span className="eyebrow">AI Receptionist</span>
          <h1>The AI Receptionist that never misses a call</h1>
          <p className="subtext-page">
            Call the number below and hear it qualify a lead, answer questions, and book an
            appointment — live.
          </p>

          <div className="features">
            <div className="feature">
              <div className="icon-badge">
                <svg viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h3>Answers every call, 24/7</h3>
              <p>No voicemail, no missed leads — ever.</p>
            </div>
            <div className="feature">
              <div className="icon-badge">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <h3>Qualifies &amp; books automatically</h3>
              <p>Asks the right questions, then puts it straight on your calendar.</p>
            </div>
            <div className="feature">
              <div className="icon-badge">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <h3>Handles FAQs instantly</h3>
              <p>Pricing, hours, service area — whatever they usually ask.</p>
            </div>
            <div className="feature">
              <div className="icon-badge">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <h3>Every call in your dashboard</h3>
              <p>Recorded, transcribed, and logged the moment it ends.</p>
            </div>
          </div>

          <div className="call-cta">
            <div className="arrow">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            <div className="call-cta-text">
              <p className="label">Call our AI Receptionist</p>
              <p className="sub">Talk to it like a real caller.</p>
            </div>
          </div>

          <a
            href="tel:+15722204756"
            className="call-btn"
            {...(interactive ? { "data-start-call": "true" } : {})}
          >
            <svg viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call +1 (572) 220-4756
          </a>
        </div>

        <ReceptionistPhone interactive={interactive} />
      </div>
    </div>
  );
}
