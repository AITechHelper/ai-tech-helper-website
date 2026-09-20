import type { Tier } from "@/lib/tiers";

/* A phone showing a text/DM thread, used for the Bronze and Silver tier pages
   (which are messaging based, not voice). Reuses the .phone-frame / .phone-screen
   shell from the voice phone and swaps the call UI for a chat thread. Gold keeps
   the live call phone, since voice is the whole point there. */

type Line = { from: "them" | "us"; text: string };

const THREADS: Record<"bronze" | "silver", { channel: string; lines: Line[] }> = {
  bronze: {
    channel: "New message · Instagram DM",
    lines: [
      { from: "them", text: "Hey, do you have any openings this week?" },
      { from: "us", text: "Hi! Yes we do. What service are you after?" },
      { from: "us", text: "Happy to get you on the calendar today." },
      { from: "them", text: "Perfect, that was fast!" },
    ],
  },
  silver: {
    channel: "Follow-up · Text message",
    lines: [
      { from: "us", text: "Hi Jamie, just following up on your estimate. Want to lock it in?" },
      { from: "them", text: "Yeah let's do it." },
      { from: "us", text: "Booked! Quick favor, mind leaving us a Google review?" },
      { from: "them", text: "Already on it. 5 stars." },
    ],
  },
};

export default function MessagePhone({ tier }: { tier: Tier }) {
  const thread = THREADS[tier.slug === "silver" ? "silver" : "bronze"];

  return (
    <div className="phone-stage">
      <div className="phone-frame">
        <div className="phone-screen msg-screen">
          <div className="status-row">
            <span>9:41</span>
            <div className="icons">
              <svg viewBox="0 0 20 12">
                <rect x="0" y="7" width="3" height="5" rx="0.5" />
                <rect x="5" y="5" width="3" height="7" rx="0.5" />
                <rect x="10" y="3" width="3" height="9" rx="0.5" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" />
              </svg>
              <svg viewBox="0 0 25 12">
                <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="#fff" fill="none" />
                <rect x="2" y="2" width="18" height="8" rx="1.5" />
                <rect x="22.5" y="4" width="1.8" height="4" rx="0.8" />
              </svg>
            </div>
          </div>
          <div className="notch" />

          <div className="msg-head">
            <span className="msg-avatar" aria-hidden="true">AI</span>
            <div className="msg-head-text">
              <strong>AI Tech Helper</strong>
              <span>{thread.channel}</span>
            </div>
          </div>

          <div className="msg-thread">
            {thread.lines.map((l, i) => (
              <div key={i} className={`msg-bubble ${l.from === "us" ? "out" : "in"}`}>
                {l.text}
              </div>
            ))}
            <div className="msg-meta">Replied in seconds</div>
          </div>

          <div className="home-indicator" />
        </div>
      </div>
    </div>
  );
}
