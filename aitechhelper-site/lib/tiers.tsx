import type { IconName } from "@/components/TierIcons";

export const PHONE_NUMBER = "+15722204756";
export const PHONE_DISPLAY = "+1 (572) 220-4756";

export type TierFeature = {
  icon: IconName;
  title: string;
  desc: string;
};

export type TierPrice = {
  setup: number;
  monthly: number;
};

export type Tier = {
  slug: "bronze" | "silver" | "gold";
  name: string;
  /** Short label above the headline. */
  eyebrow: string;
  headline: string;
  subtext: string;
  price: TierPrice;
  /** The headline capabilities this tier adds over the one below it. */
  features: TierFeature[];
  /** Name of the tier this one builds on, if any. */
  builds_on?: string;
  /** Everything carried up from the lower tiers, listed so the value is
   *  explicit rather than implied. */
  inherits: string[];
  /** Dashboard modules this tier unlocks. */
  dashboard: string[];
  /** One-line summary used on the homepage cards. */
  cardDesc: string;
  cardKicker: string;
};

/* Cumulative capability labels, defined once so tiers can't drift apart. */
const INSTANT = "Instant response on every channel (call, text, DM, chat, email)";
const MISSED = "Missed-call text back";
const HUB = "One hub for every conversation, synced to your CRM";
const FOLLOWUP = "Automated follow-up on every quote";
const REVIEWS = "Google review and referral requests";
const REMINDERS = "Appointment reminders and check-ins";

export const TIERS: Tier[] = [
  {
    slug: "bronze",
    name: "Bronze",
    eyebrow: "Bronze, Instant Response",
    headline: "Never let a lead go cold",
    subtext:
      "Every call, text, DM, chat and email gets an instant reply, and anyone you miss gets a text right back. All of it lands in one hub wired to your CRM.",
    price: { setup: 500, monthly: 200 },
    cardKicker: "Instant Response",
    cardDesc:
      "Answers every channel the second someone reaches out, texts back missed calls, and keeps every lead in one place.",
    inherits: [],
    dashboard: ["Unified inbox", "Contacts", "Missed-call log", "Pipeline", "CRM sync"],
    features: [
      {
        icon: "message",
        title: "Instant response, every channel",
        desc: "Call, text, DM, website chat and email all get answered right away, day or night.",
      },
      {
        icon: "phone",
        title: "Missed-call text back",
        desc: "Can't pick up? The caller gets a friendly text in seconds, so the lead stays warm.",
      },
      {
        icon: "dashboard",
        title: "One hub, synced to your CRM",
        desc: "Every conversation lands in one place and syncs straight to your CRM.",
      },
      {
        icon: "clock",
        title: "Nothing slips through",
        desc: "Every lead captured and organized, so none get lost across five different apps.",
      },
    ],
  },
  {
    slug: "silver",
    name: "Silver",
    eyebrow: "Silver, Follow-Up & Reviews",
    headline: "Win back the work that slips away",
    subtext:
      "Everything in Bronze, plus the follow-up that turns quiet quotes into booked jobs and happy clients into reviews and referrals.",
    price: { setup: 750, monthly: 300 },
    cardKicker: "Follow-Up & Reviews",
    cardDesc:
      "Everything in Bronze, plus automatic quote follow-up, review and referral requests, reminders and check-ins.",
    builds_on: "Bronze",
    inherits: [INSTANT, MISSED, HUB],
    dashboard: [
      "Unified inbox",
      "Contacts",
      "Missed-call log",
      "Pipeline",
      "CRM sync",
      "Follow-up sequences",
      "Reviews & reputation",
    ],
    features: [
      {
        icon: "clock",
        title: "Automated quote follow-up",
        desc: "Every estimate that goes quiet gets chased on its own, until it's a yes or a clear no.",
      },
      {
        icon: "star",
        title: "Reviews and referrals",
        desc: "Asks for a Google review and a referral right when the client is happiest.",
      },
      {
        icon: "calendar",
        title: "Appointment reminders",
        desc: "Automatic reminders before every job, so the slot you booked doesn't turn into a no-show.",
      },
      {
        icon: "message",
        title: "Client check-ins",
        desc: "Stays in touch after the job, so customers come back and send you referrals.",
      },
    ],
  },
  {
    slug: "gold",
    name: "Gold",
    eyebrow: "Gold, Voice Agent",
    headline: "The receptionist that never misses a call",
    subtext:
      "Everything in Silver, plus a 24/7 AI voice agent that answers every call, qualifies the lead, and books the job, live on your calendar.",
    price: { setup: 1000, monthly: 400 },
    cardKicker: "Voice + Full Lifecycle",
    cardDesc:
      "Everything in Silver, plus a 24/7 voice agent, contracts and invoicing, onboarding and a custom email pipeline.",
    builds_on: "Silver",
    inherits: [INSTANT, MISSED, HUB, FOLLOWUP, REVIEWS, REMINDERS],
    dashboard: [
      "Unified inbox",
      "Contacts",
      "Missed-call log",
      "Pipeline",
      "CRM sync",
      "Follow-up sequences",
      "Reviews & reputation",
      "Call log",
      "Recordings & transcripts",
      "Calendar & booking",
      "Contracts & e-sign",
      "Invoicing & payments",
    ],
    features: [
      {
        icon: "phone",
        title: "Answers every call, 24/7",
        desc: "Evenings, weekends, while you're on a job. No voicemail, no missed leads.",
      },
      {
        icon: "calendar",
        title: "Qualifies and books by voice",
        desc: "Asks the right questions, then puts the job straight on your calendar.",
      },
      {
        icon: "contract",
        title: "Contracts, e-sign & invoicing",
        desc: "Sends contracts for e-signature, invoices the client, and chases unpaid bills automatically.",
      },
      {
        icon: "onboarding",
        title: "Onboarding & email pipeline",
        desc: "Welcomes every new client and runs a custom email pipeline built around your business.",
      },
    ],
  },
];

/** The Custom option shown after the three tiers. Not a full tier page, it
 *  routes straight to booking a call for an individual quote. */
export const CUSTOM = {
  name: "Custom",
  kicker: "Built around you",
  desc: "Something bigger or more specific? We'll scope it and quote it for your business.",
  points: ["Tailored to your workflow", "Priced to what you need", "Book a call to scope it"],
};

export const getTier = (slug: Tier["slug"]) => TIERS.find((t) => t.slug === slug)!;

/**
 * The at-a-glance comparison. Written out explicitly rather than derived, so a
 * marketing headline edit can't silently reshape the matrix.
 */
export type ComparisonRow = {
  label: string;
  tiers: Tier["slug"][];
};

const ALL: Tier["slug"][] = ["bronze", "silver", "gold"];
const FROM_SILVER: Tier["slug"][] = ["silver", "gold"];
const GOLD_ONLY: Tier["slug"][] = ["gold"];

export const COMPARISON: ComparisonRow[] = [
  { label: "Instant response on every channel", tiers: ALL },
  { label: "Missed-call text back", tiers: ALL },
  { label: "One hub synced to your CRM", tiers: ALL },
  { label: "Automated quote follow-up", tiers: FROM_SILVER },
  { label: "Review & referral requests", tiers: FROM_SILVER },
  { label: "Appointment reminders & check-ins", tiers: FROM_SILVER },
  { label: "24/7 AI voice agent", tiers: GOLD_ONLY },
  { label: "Voice lead qualification & booking", tiers: GOLD_ONLY },
  { label: "Call recordings & transcripts", tiers: GOLD_ONLY },
  { label: "Contracts, e-sign & invoicing", tiers: GOLD_ONLY },
  { label: "Onboarding & email pipeline", tiers: GOLD_ONLY },
];
