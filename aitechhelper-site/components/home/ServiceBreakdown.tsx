import ImgSlot from "@/components/home/ImgSlot";

/* A per-capability breakdown for the Services page: every service the system
   performs, laid out as alternating image/copy bands, grouped by the tier it
   belongs to (Bronze / Silver / Gold) with a tier chip.

   Images are referenced by a stable filename in /public/images. Until a file is
   dropped in, ImgSlot shows a labelled placeholder naming exactly which image to
   add, so the layout is complete before the art lands. */

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
    title: "Instant response, every channel",
    body: "Every call, text, DM, website chat and email gets answered the second it comes in, day or night. No one waits, and no lead cools off while you're on a job.",
    bullets: [
      "Call, text, DM, chat and email all covered",
      "Replies in seconds, not hours",
      "Works while you're busy, closed, or asleep",
    ],
    img: "/images/svc-instant.webp",
    alt: "Messages from every channel getting an instant reply",
  },
  {
    tier: "bronze",
    title: "Missed-call text back",
    body: "When you can't pick up, the caller gets a friendly text right away asking how you can help. The lead stays warm instead of calling the next name on the list.",
    bullets: [
      "Automatic text the moment a call is missed",
      "Keeps the conversation going in one thread",
      "Turns missed calls into booked jobs",
    ],
    img: "/images/svc-missed-call.webp",
    alt: "A missed call triggering an automatic text back to the caller",
  },
  {
    tier: "bronze",
    title: "One hub, synced to your CRM",
    body: "Every conversation from every channel lands in one place and syncs straight to your CRM, so nothing gets lost across five different apps and every lead is organized.",
    bullets: [
      "One unified inbox for everything",
      "Syncs contacts and conversations to your CRM",
      "Every lead captured and organized",
    ],
    img: "/images/svc-hub.webp",
    alt: "Every channel flowing into a single hub synced to a CRM",
  },
  {
    tier: "silver",
    title: "Automated quote follow-up",
    body: "Every estimate that goes quiet gets chased on its own, at the right moment, until it's a yes or a clear no. Pending quotes turn into confirmed work instead of sitting in limbo.",
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
    title: "Reviews and referrals",
    body: "The moment a job wraps and the client is happiest, the system asks for a Google review and a referral. Your reputation compounds, and new leads come from the ones you already served.",
    bullets: [
      "Asks for a Google review at the perfect moment",
      "Requests referrals from happy customers",
      "Builds your reputation on autopilot",
    ],
    img: "/images/svc-reviews.webp",
    alt: "Review and referral requests boosting a business's Google rating",
  },
  {
    tier: "silver",
    title: "Reminders and check-ins",
    body: "Automatic reminders go out before every job so booked slots don't turn into no-shows, and check-ins after the job keep customers coming back and sending referrals.",
    bullets: [
      "Automatic reminders before every appointment",
      "Cuts no-shows and last-minute cancellations",
      "Post-job check-ins that bring customers back",
    ],
    img: "/images/svc-reminders.webp",
    alt: "Automatic appointment reminders and follow-up check-ins being sent",
  },
  {
    tier: "gold",
    title: "24/7 AI voice agent",
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
    tier: "gold",
    title: "Voice lead qualification & booking",
    body: "The voice agent asks the right questions, works out whether a caller is a real job, and books qualified work straight onto your calendar, so you wake up to appointments, not a list of people to call back.",
    bullets: [
      "Qualifies the lead before it reaches you",
      "Books straight onto your live calendar",
      "Captures the job details you need up front",
    ],
    img: "/images/svc-booking.webp",
    alt: "A booking being qualified and placed onto a calendar automatically",
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
        <h2>What your AI system actually does</h2>
        <p>
          Each plan is built from these services. Here&apos;s exactly what each one handles
          for you, start with what hurts most and grow into the rest.
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
