/* "Every channel → one hub" section, directly below the hero. Eight platform
   chat examples arranged around a glowing central AI hub, with glowing signal
   lines converging inward. Static (no motion). Replaces the old channel-pill
   TrustBar. Classes are namespaced `chub-` to avoid collisions. */

type Node = {
  area: string;
  ic: string; // css modifier suffix, e.g. "ig"
  glyph: string;
  name: string;
  inMsg: string;
  outMsg: string;
};

const NODES: Node[] = [
  { area: "ig", ic: "ig", glyph: "◎", name: "Instagram", inMsg: "Are you open Sunday?", outMsg: "We are — want a slot?" },
  { area: "wa", ic: "wa", glyph: "✆", name: "WhatsApp", inMsg: "How much for a quote?", outMsg: "Happy to help — what service?" },
  { area: "sms", ic: "sms", glyph: "✉", name: "Text / SMS", inMsg: "Do you do same-day?", outMsg: "Yes! Book you for 2pm today?" },
  { area: "fb", ic: "fb", glyph: "f", name: "Facebook", inMsg: "Can someone call me back?", outMsg: "Booking your callback now." },
  { area: "web", ic: "web", glyph: "◍", name: "Website chat", inMsg: "Need a plumber ASAP", outMsg: "On it — grabbing your details." },
  { area: "goog", ic: "goog", glyph: "G", name: "Google", inMsg: "Are you licensed?", outMsg: "Fully licensed & insured." },
  { area: "em", ic: "em", glyph: "@", name: "Email", inMsg: "Requesting an estimate", outMsg: "Sent — check your inbox!" },
  { area: "phone", ic: "phone", glyph: "☎", name: "Phone call", inMsg: "“Hi, are you available…”", outMsg: "Answered & booked, live." },
];

const LINE_COORDS: Array<[number, number]> = [
  [16.6, 16.6],
  [50, 16.6],
  [83.3, 16.6],
  [16.6, 50],
  [83.3, 50],
  [16.6, 83.3],
  [50, 83.3],
  [83.3, 83.3],
];

export default function ChannelHub() {
  return (
    <section className="chub-section" aria-label="Every channel, one AI inbox">
      <div className="chub-head">
        <span className="chub-kicker">One inbox, every channel</span>
        <h2>However they reach out, one AI answers</h2>
        <p>
          Phone, text, social, chat and email all flow into a single hub — your agent
          replies in seconds, everywhere at once.
        </p>
      </div>

      <div className="chub-grid">
        <svg className="chub-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g>
            {LINE_COORDS.map(([x, y], i) => (
              <line key={`h${i}`} className="chub-halo" x1="50" y1="50" x2={x} y2={y} />
            ))}
          </g>
          <g>
            {LINE_COORDS.map(([x, y], i) => (
              <line key={`c${i}`} className="chub-core" x1="50" y1="50" x2={x} y2={y} />
            ))}
          </g>
        </svg>

        {NODES.slice(0, 4).map((n) => (
          <NodeCard key={n.area} n={n} />
        ))}

        <div className="chub-hub">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="chub-hub-mark" src="/images/hub-mark.png" alt="AI Tech Helper" />
        </div>

        {NODES.slice(4).map((n) => (
          <NodeCard key={n.area} n={n} />
        ))}
      </div>
    </section>
  );
}

function NodeCard({ n }: { n: Node }) {
  return (
    <div className={`chub-node chub-a-${n.area}`}>
      <div className="chub-node-head">
        <span className={`chub-ic chub-ic-${n.ic}`}>{n.glyph}</span>
        {n.name}
      </div>
      <div className="chub-bubble chub-in">{n.inMsg}</div>
      <div className="chub-bubble chub-out">{n.outMsg}</div>
    </div>
  );
}
