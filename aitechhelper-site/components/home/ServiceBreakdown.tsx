import ImgSlot from "@/components/home/ImgSlot";

/* A per-capability breakdown for the Services page: every individual service
   the agent performs, laid out as alternating image/copy bands so each one gets
   room to breathe. Grouped by the tier it belongs to (Bronze / Silver / Gold),
   with a tier chip so a visitor can see where each capability lives.

   Images are referenced by a stable filename in /public/images. Until a file is
   dropped in, ImgSlot shows a clean labelled placeholder naming exactly which
   image to add, so the layout is complete before the art lands. */

type Capability = {
  tier: "bronze" | "silver" | "gold";
  title: string;
  body: string;
  bullets: string[];
  /** File under /public/images, add it to replace the placeholder. */
  img: string;
  alt: string;
};

const CAPABILITIES: Capability[] = [
  {
    tier: "bronze",
    title: "24/7 voice agent",
    body: "A receptionist that answers every call the instant it rings, evenings, weekends, holidays, and while you're already on a job. No voicemail, no hold music, no missed leads slipping to a competitor.",
    bullets: [
      "Answers in your business's voice, day or night",
      "Handles pricing, hours and service-area questions",
      "Every call recorded, transcribed and logged",
    ],
    img: "/images/svc-voice-agent.webp",
    alt: "An AI voice agent answering an incoming call and logging the details",
  },
  {
    tier: "bronze",
    title: "Lead qualification & booking",
    body: "The agent asks the right questions, works out whether a caller is a real job, and books qualified work straight onto your calendar, so you wake up to appointments, not a list of people to call back.",
    bullets: [
      "Qualifies the lead before it reaches you",
      "Books straight onto your live calendar",
      "Captures the job details you need up front",
    ],
    img: "/images/svc-booking.webp",
    alt: "A booking being qualified and placed onto a calendar automatically",
  },
  {
    tier: "silver",
    title: "Messaging on every channel",
    body: "One inbox for SMS, website chat, Instagram, Facebook Messenger, WhatsApp and email. Every message is answered in seconds and every conversation lands in the same place, nothing gets lost across five different apps.",
    bullets: [
      "SMS, chat, Instagram, Facebook, WhatsApp and email",
      "Replies in seconds, not hours",
      "Every thread in one unified inbox",
    ],
    img: "/images/svc-messaging.webp",
    alt: "Messages from every channel flowing into a single unified inbox",
  },
  {
    tier: "silver",
    title: "Appointment reminders",
    body: "Automatic SMS and email reminders go out before every job, so the slot you booked doesn't quietly turn into a no-show. Fewer empty windows, more completed work.",
    bullets: [
      "Automatic SMS and email reminders",
      "Cuts no-shows and last-minute cancellations",
      "Timed around each appointment automatically",
    ],
    img: "/images/svc-reminders.webp",
    alt: "Automatic appointment reminders being sent before a scheduled job",
  },
  {
    tier: "silver",
    title: "Estimate & quote follow-up",
    body: "Every quote that went quiet gets chased on its own, at the right moment, until it's a yes or a clear no. Pending estimates turn into confirmed work instead of sitting in limbo.",
    bullets: [
      "Follows up on every estimate automatically",
      "Nudges at the right time, not just once",
      "Turns quiet quotes into booked jobs",
    ],
    img: "/images/svc-estimates.webp",
    alt: "A quote being followed up through messages until the deal is won",
  },
  {
    tier: "silver",
    title: "Reviews & referrals",
    body: "The moment a job wraps and the client is happiest, the agent asks for a Google review and a referral. Your reputation compounds automatically, and new leads arrive from the ones you already served.",
    bullets: [
      "Asks for a Google review at the perfect moment",
      "Requests referrals from happy customers",
      "Builds your reputation on autopilot",
    ],
    img: "/images/svc-reviews.webp",
    alt: "Review and referral requests boosting a business's Google rating",
  },
  {
    tier: "gold",
    title: "Contracts, e-sign & invoicing",
    body: "Contracts and waivers go out for a legally binding e-signature the moment a job is booked, then the client is invoiced and every unpaid bill is chased with automatic reminders. Signed to paid, entirely hands-off.",
    bullets: [
      "Contracts and waivers sent for e-signature",
      "Invoices raised and delivered automatically",
      "Unpaid bills chased until they're settled",
    ],
    img: "/images/svc-paperwork.webp",
    alt: "A paperwork pipeline moving from contract to signature to paid invoice",
  },
  {
    tier: "gold",
    title: "Onboarding & email pipeline",
    body: "Every new client is welcomed, prepared and reassured automatically the moment their booking confirms, and a custom email pipeline nurtures cold leads, proposals and re-engagement around your business, not a generic template.",
    bullets: [
      "New clients welcomed and prepared automatically",
      "Custom nurture sequences built for your business",
      "Cold leads and old customers re-engaged",
    ],
    img: "/images/svc-onboarding.webp",
    alt: "A new-client onboarding and email nurture pipeline running automatically",
  },
];

const TIER_LABEL: Record<Capability["tier"], string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

export default function ServiceBreakdown() {
  return (
    <section className="svc-breakdown" id="breakdown">
      <div className="home-section-head svc-breakdown-head">
        <span className="home-kicker">Every service, in detail</span>
        <h2>What your AI agent actually does</h2>
        <p>
          Each package is built from these services. Here&apos;s exactly what each one
          handles for you, start with what hurts most and grow into the rest.
        </p>
      </div>

      <div className="svc-breakdown-list">
        {CAPABILITIES.map((cap, i) => (
          <article
            key={cap.title}
            className={`svc-cap side-${i % 2 === 0 ? "right" : "left"} page--${cap.tier}`}
          >
            <div className="svc-cap-copy">
              <span className={`svc-tier-chip chip--${cap.tier}`}>{TIER_LABEL[cap.tier]}</span>
              <h3>{cap.title}</h3>
              <p>{cap.body}</p>
              <ul className="home-feature-bullets">
                {cap.bullets.map((b) => (
                  <li key={b}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="svc-cap-media">
              <ImgSlot src={cap.img} alt={cap.alt} label={`Add ${cap.img}`} ratio="16 / 9" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
