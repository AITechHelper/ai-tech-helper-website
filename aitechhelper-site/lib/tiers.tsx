import type { IconName } from "@/components/TierIcons";

export const PHONE_NUMBER = "+15722204756";
export const PHONE_DISPLAY = "+1 (572) 220-4756";

export type TierFeature = {
  icon: IconName;
  title: string;
  desc: string;
};

export type Tier = {
  slug: "bronze" | "silver" | "gold";
  name: string;
  /** Short label above the headline. */
  eyebrow: string;
  headline: string;
  subtext: string;
  /** The four headline capabilities this tier adds over the one below it. */
  features: TierFeature[];
  /** Name of the tier this one builds on, if any. */
  builds_on?: string;
  /** Everything carried up from the lower tiers, listed so the value is
   *  explicit rather than implied. */
  inherits: string[];
  /** Dashboard modules this tier unlocks. Every tier gets a dashboard — it's
   *  the platform, not a differentiator — so this list grows rather than
   *  appearing only at the top tier. */
  dashboard: string[];
  /** One-line summary used on the homepage carousel card. */
  cardDesc: string;
  cardKicker: string;
};

const VOICE = "Voice agent answering every call 24/7";
const MESSAGING = "Messaging agent across SMS, chat, Instagram, Facebook, WhatsApp and email";
const REMINDERS = "Appointment reminders";
const ESTIMATES = "Estimate follow-up";
const REVIEWS = "Review & referral requests";

export const TIERS: Tier[] = [
  {
    slug: "bronze",
    name: "Bronze",
    eyebrow: "Bronze — Voice Agent",
    headline: "The receptionist that never misses a call",
    subtext:
      "Call the number below and hear it qualify a lead, answer questions, and book an appointment — live.",
    cardKicker: "Voice Agent",
    cardDesc:
      "Answers every call, qualifies the lead, and books the appointment — 24/7, live on your calendar.",
    inherits: [],
    dashboard: ["Call log", "Recordings & transcripts", "Contacts", "Calendar & booking", "Pipeline"],
    features: [
      {
        icon: "phone",
        title: "Answers every call, 24/7",
        desc: "Evenings, weekends, while you're on a job — no voicemail, no missed leads.",
      },
      {
        icon: "calendar",
        title: "Qualifies & books automatically",
        desc: "Asks the right questions, then puts it straight on your calendar.",
      },
      {
        icon: "clock",
        title: "Handles FAQs instantly",
        desc: "Pricing, hours, service area — whatever they usually ask.",
      },
      {
        icon: "dashboard",
        title: "Every call in your dashboard",
        desc: "Recorded, transcribed, and logged the moment it ends.",
      },
    ],
  },
  {
    slug: "silver",
    name: "Silver",
    eyebrow: "Silver — Voice + Messaging",
    headline: "Every call and every message, answered in seconds",
    subtext:
      "Bronze answers the phone. Silver answers everywhere else too — and stops the work you've already won from quietly slipping away.",
    cardKicker: "Voice + Messaging",
    cardDesc:
      "Everything in Bronze, plus instant replies on every text channel and the follow-up that protects each booking.",
    builds_on: "Bronze",
    inherits: [VOICE],
    dashboard: [
      "Call log",
      "Recordings & transcripts",
      "Contacts",
      "Calendar & booking",
      "Pipeline",
      "Unified inbox",
      "Reviews & reputation",
    ],
    features: [
      {
        icon: "message",
        title: "Replies on every channel",
        desc: "SMS, website chat, Instagram, Facebook Messenger, WhatsApp, and email — answered in seconds, not hours.",
      },
      {
        icon: "calendar",
        title: "Appointment reminders",
        desc: "Automatic SMS and email reminders before every job, so the slot you booked doesn't turn into a no-show.",
      },
      {
        icon: "clock",
        title: "Estimate follow-up",
        desc: "Chases every quote that went quiet, so pending estimates turn into confirmed work.",
      },
      {
        icon: "star",
        title: "Review & referral requests",
        desc: "Asks for a Google review and a referral the moment a job is finished and the client is happiest.",
      },
    ],
  },
  {
    slug: "gold",
    name: "Gold",
    eyebrow: "Gold — Complete Package",
    headline: "Your entire job lifecycle, running itself",
    subtext:
      "Everything in Silver, plus the paperwork, the payments, and the follow-through — from booked, to signed, to paid, to reviewed, without you touching any of it.",
    cardKicker: "Complete Package",
    cardDesc:
      "Everything in Silver, plus contracts, invoicing, onboarding, and custom email — the whole business behind the booking.",
    builds_on: "Silver",
    inherits: [VOICE, MESSAGING, REMINDERS, ESTIMATES, REVIEWS],
    dashboard: [
      "Call log",
      "Recordings & transcripts",
      "Contacts",
      "Calendar & booking",
      "Pipeline",
      "Unified inbox",
      "Reviews & reputation",
      "Contracts & e-sign",
      "Invoicing & payments",
    ],
    features: [
      {
        icon: "contract",
        title: "Contract & waiver signing",
        desc: "Sends the right document the moment a job is booked and collects a legally binding e-signature before work starts.",
      },
      {
        icon: "invoice",
        title: "Invoice follow-up",
        desc: "Professional, persistent payment reminders on every unpaid invoice — so you get paid without the awkward call.",
      },
      {
        icon: "onboarding",
        title: "New client onboarding",
        desc: "Every new client gets welcomed, prepared, and reassured automatically the moment their booking confirms.",
      },
      {
        icon: "mail",
        title: "Custom email pipeline",
        desc: "A nurture sequence built around your business — cold leads, proposals, re-engagement — not a generic template.",
      },
    ],
  },
];

export const getTier = (slug: Tier["slug"]) => TIERS.find((t) => t.slug === slug)!;

/**
 * The at-a-glance comparison shown on the homepage services menu.
 *
 * Written out explicitly rather than derived from each tier's `features` and
 * `inherits`: those are marketing copy shaped for their own page, whereas this
 * needs short, parallel labels that read cleanly down a column. Keeping it
 * separate means editing a headline can't silently reshape the matrix.
 */
export type ComparisonRow = {
  label: string;
  tiers: Tier["slug"][];
};

const ALL: Tier["slug"][] = ["bronze", "silver", "gold"];
const FROM_SILVER: Tier["slug"][] = ["silver", "gold"];
const GOLD_ONLY: Tier["slug"][] = ["gold"];

export const COMPARISON: ComparisonRow[] = [
  { label: "Voice agent, answering 24/7", tiers: ALL },
  { label: "Qualifies leads & books jobs", tiers: ALL },
  { label: "Recordings & transcripts", tiers: ALL },
  { label: "Your dashboard", tiers: ALL },
  { label: "Messaging on every channel", tiers: FROM_SILVER },
  { label: "Appointment reminders", tiers: FROM_SILVER },
  { label: "Estimate follow-up", tiers: FROM_SILVER },
  { label: "Review & referral requests", tiers: FROM_SILVER },
  { label: "Contract & waiver signing", tiers: GOLD_ONLY },
  { label: "Invoice follow-up", tiers: GOLD_ONLY },
  { label: "New client onboarding", tiers: GOLD_ONLY },
  { label: "Custom email pipeline", tiers: GOLD_ONLY },
];
