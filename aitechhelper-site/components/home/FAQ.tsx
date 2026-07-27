import { PHONE_DISPLAY } from "@/lib/tiers";

const FAQS = [
  {
    q: "What exactly does the AI agent do?",
    a: "It answers your phone and messages like a trained receptionist — greets the caller, answers common questions about pricing, hours and service area, qualifies the lead, and books the job straight onto your calendar. Every conversation is recorded, transcribed and logged.",
  },
  {
    q: "Will callers know it's an AI?",
    a: "It sounds natural and handles real conversations. It's honest about being an assistant when asked, and it hands off or takes a message for anything it shouldn't handle. The goal is that no call goes unanswered — not to trick anyone.",
  },
  {
    q: "Who is this for?",
    a: "Local service businesses across Oklahoma and surrounding areas — home services, trades, clinics, salons, and any owner who loses money when the phone goes unanswered or a lead waits hours for a reply.",
  },
  {
    q: "Do I have to change my phone number or software?",
    a: "No. We set it up on your existing number and the channels you already use. There's nothing for you to install — we do the building and the setup for you.",
  },
  {
    q: "How fast can I go live?",
    a: "Most setups are live within a few days of the discovery call. We build and train it, you review it, and then it starts answering.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on the package that fits you — Bronze, Silver or Gold. The fastest way to get a straight answer is a quick call; we'll show you the demo and quote you on the spot.",
  },
];

/* FAQ — native <details> so it's accessible and needs no client JS. */
export default function FAQ() {
  return (
    <section className="home-section home-faq" id="faq">
      <div className="home-section-head">
        <span className="home-kicker">FAQ</span>
        <h2>Questions, answered</h2>
        <p>
          Still unsure? Call <a href={`tel:${PHONE_DISPLAY.replace(/[^+\d]/g, "")}`}>{PHONE_DISPLAY}</a>{" "}
          and ask the agent yourself.
        </p>
      </div>

      <div className="home-faq-list">
        {FAQS.map((f) => (
          <details className="home-faq-item" key={f.q}>
            <summary>
              {f.q}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
