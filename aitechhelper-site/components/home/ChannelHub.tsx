"use client";

import { useEffect, useRef } from "react";

/* "Every channel → one hub" section below the hero. Platform boxes (4 left,
   4 right) around the logo, which sits in a glowing ring. On desktop, circuit
   traces fan from the ring to each box; on mobile the logo branches down into
   two columns joined by circuit lines. All connectors are measured/redrawn on
   resize. Classes namespaced `chub-`. */

const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" stroke="none" />
  </svg>
);
const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="#fff">
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.6.7.7-2.5-.2-.3A8 8 0 0 1 12 4zm-3 4.2c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.6.8c-.1.2-.3.2-.5.1-.6-.2-1.3-.5-2-1.3-.5-.5-.9-1.1-1-1.3-.1-.2 0-.3.1-.4l.4-.5c.1-.2.1-.3.2-.5 0-.2 0-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4z" />
  </svg>
);
const SmsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="#fff">
    <path d="M14 8.5h2V6h-2c-1.9 0-3 1.3-3 3v1.5H9V13h2v6h2.5v-6H16l.5-2.5H13.5V9c0-.3.2-.5.5-.5z" />
  </svg>
);
const WebIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
    <path d="M4 5h16v11H8l-4 3z" strokeLinejoin="round" />
    <circle cx="9" cy="10.5" r="1" fill="#fff" stroke="none" />
    <circle cx="12.5" cy="10.5" r="1" fill="#fff" stroke="none" />
    <circle cx="16" cy="10.5" r="1" fill="#fff" stroke="none" />
  </svg>
);
const GoogIcon = () => (
  <svg viewBox="0 0 24 24">
    <path fill="#4285F4" d="M21.6 12.2c0-.6-.1-1.2-.2-1.8H12v3.5h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2z" />
    <path fill="#34A853" d="M12 22c2.7 0 5-1 6.6-2.6l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
    <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8z" />
    <path fill="#EA4335" d="M12 6.3c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.6l3.3 2.6C7.2 8 9.4 6.3 12 6.3z" />
  </svg>
);
const EmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
  </svg>
);
const PhIcon = () => (
  <svg viewBox="0 0 24 24" fill="#fff">
    <path d="M6.6 3H9l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v2.4c0 .9-.7 1.6-1.6 1.6A15 15 0 0 1 5 4.6C5 3.7 5.7 3 6.6 3z" />
  </svg>
);

type Ch = { key: string; name: string; side: "l" | "r"; bg: string; border: string; Icon: () => JSX.Element };
const LEFT: Ch[] = [
  { key: "ig", name: "Instagram", side: "l", bg: "chub-ig-bg", border: "chub-b-ig", Icon: IgIcon },
  { key: "fb", name: "Facebook", side: "l", bg: "chub-fb-bg", border: "chub-b-fb", Icon: FbIcon },
  { key: "goog", name: "Google", side: "l", bg: "chub-goog-bg", border: "chub-b-goog", Icon: GoogIcon },
  { key: "em", name: "Email", side: "l", bg: "chub-em-bg", border: "chub-b-em", Icon: EmIcon },
];
const RIGHT: Ch[] = [
  { key: "wa", name: "WhatsApp", side: "r", bg: "chub-wa-bg", border: "chub-b-wa", Icon: WaIcon },
  { key: "sms", name: "Text / SMS", side: "r", bg: "chub-sms-bg", border: "chub-b-sms", Icon: SmsIcon },
  { key: "web", name: "Website chat", side: "r", bg: "chub-web-bg", border: "chub-b-web", Icon: WebIcon },
  { key: "phone", name: "Phone call", side: "r", bg: "chub-phone-bg", border: "chub-b-phone", Icon: PhIcon },
];

const NS = "http://www.w3.org/2000/svg";

export default function ChannelHub() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const d = diagramRef.current;
    const svg = svgRef.current;
    if (!d || !svg) return;

    const add = (t: string, a: Record<string, string | number>) => {
      const e = document.createElementNS(NS, t);
      for (const k in a) e.setAttribute(k, String(a[k]));
      svg.appendChild(e);
      return e;
    };
    const poly = (pts: number[][]) =>
      add("polyline", { class: "chub-trace", points: pts.map((p) => `${p[0]},${p[1]}`).join(" ") });
    const pad = (x: number, y: number, r = 3.6) => add("circle", { class: "chub-pad", cx: x, cy: y, r });
    const rel = (b: Element, g: DOMRect) => {
      const r = b.getBoundingClientRect();
      return {
        l: r.left - g.left,
        r: r.right - g.left,
        t: r.top - g.top,
        b: r.bottom - g.top,
        cx: (r.left + r.right) / 2 - g.left,
        cy: (r.top + r.bottom) / 2 - g.top,
      };
    };

    const drawDesktop = (g: DOMRect) => {
      const imgEl = d.querySelector(".chub-hub img");
      if (!imgEl) return;
      const lr = imgEl.getBoundingClientRect();
      const C = { x: lr.left + lr.width / 2 - g.left, y: lr.top + lr.height / 2 - g.top };
      const R = lr.width * 0.95;
      add("circle", { class: "chub-disc", cx: C.x, cy: C.y, r: R * 0.98 });
      add("circle", { class: "chub-ringdash", cx: C.x, cy: C.y, r: R * 1.2 });
      add("circle", { class: "chub-ringinner", cx: C.x, cy: C.y, r: R * 0.82 });
      add("circle", { class: "chub-ringmain", cx: C.x, cy: C.y, r: R });
      d.querySelectorAll<HTMLElement>(".chub-box").forEach((box) => {
        const side = box.dataset.side;
        const b = rel(box, g);
        const sign = side === "l" ? -1 : 1;
        const ay = Math.max(C.y - R * 0.8, Math.min(b.cy, C.y + R * 0.8));
        const ax = C.x + sign * Math.sqrt(Math.max(0, R * R - (ay - C.y) * (ay - C.y)));
        const bx = side === "l" ? b.r : b.l;
        const lane = C.x + sign * (R + 26);
        poly([[bx, b.cy], [lane, b.cy], [lane, ay], [ax, ay]]);
        pad(bx, b.cy, 4);
        pad(ax, ay, 3.4);
      });
    };

    const drawMobile = (g: DOMRect) => {
      const imgEl = d.querySelector(".chub-hub img");
      if (!imgEl) return;
      const lr = imgEl.getBoundingClientRect();
      const Cx = lr.left + lr.width / 2 - g.left;
      const hubB = lr.bottom - g.top;
      const cols = [
        Array.from(d.querySelectorAll(".chub-col.chub-left .chub-box")),
        Array.from(d.querySelectorAll(".chub-col.chub-right .chub-box")),
      ].map((a) => a.map((b) => rel(b, g)).sort((x, y) => x.t - y.t));
      const L = cols[0];
      const Rr = cols[1];
      if (!L.length || !Rr.length) return;
      const branchY = (hubB + Math.min(L[0].t, Rr[0].t)) / 2;
      poly([[Cx, hubB], [Cx, branchY]]);
      poly([[L[0].cx, branchY], [Rr[0].cx, branchY]]);
      poly([[L[0].cx, branchY], [L[0].cx, L[0].t]]);
      poly([[Rr[0].cx, branchY], [Rr[0].cx, Rr[0].t]]);
      pad(Cx, hubB, 4);
      pad(L[0].cx, L[0].t);
      pad(Rr[0].cx, Rr[0].t);
      cols.forEach((col) => {
        for (let i = 1; i < col.length; i++) {
          poly([[col[i].cx, col[i].t], [col[i].cx, col[i - 1].b]]);
          pad(col[i].cx, col[i].t);
          pad(col[i].cx, col[i - 1].b);
        }
      });
    };

    const draw = () => {
      const g = d.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${g.width} ${g.height}`);
      svg.innerHTML = "";
      if (window.matchMedia("(max-width:860px)").matches) drawMobile(g);
      else drawDesktop(g);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(d);
    window.addEventListener("resize", draw);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, []);

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

      <div className="chub-diagram" ref={diagramRef}>
        <svg className="chub-wires" ref={svgRef} aria-hidden="true" />
        <div className="chub-col chub-left">
          {LEFT.map((c) => (
            <Box key={c.key} c={c} />
          ))}
        </div>
        <div className="chub-hub">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hub-mark.png" alt="AI Tech Helper" />
        </div>
        <div className="chub-col chub-right">
          {RIGHT.map((c) => (
            <Box key={c.key} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Box({ c }: { c: Ch }) {
  const { Icon } = c;
  return (
    <div className={`chub-box ${c.border}`} data-side={c.side}>
      <span className={`chub-ic ${c.bg}`}>
        <Icon />
      </span>
      <span className="chub-nm">{c.name}</span>
    </div>
  );
}
