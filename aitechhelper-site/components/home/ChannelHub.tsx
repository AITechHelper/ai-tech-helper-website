"use client";

import { useEffect, useRef } from "react";

/* "Every channel → one hub" section, directly below the hero. Eight platform
   chat examples arranged around the logo, with right-angle PCB-style traces
   drawn (and re-drawn on resize) to each card's nearest edge — routed through
   the gaps so nothing rides a card border. Classes namespaced `chub-`. */

type Node = { area: string; ic: string; glyph: string; name: string; inMsg: string; outMsg: string };

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

const NS = "http://www.w3.org/2000/svg";

export default function ChannelHub() {
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const svg = svgRef.current;
    if (!grid || !svg) return;

    const dot = (cls: string, x: number, y: number, r: number) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("class", cls);
      c.setAttribute("cx", String(x));
      c.setAttribute("cy", String(y));
      c.setAttribute("r", String(r));
      svg.appendChild(c);
    };
    const line = (pts: number[][]) => {
      const p = document.createElementNS(NS, "polyline");
      p.setAttribute("class", "chub-trace");
      p.setAttribute("points", pts.map((a) => `${a[0]},${a[1]}`).join(" "));
      svg.appendChild(p);
    };

    const draw = () => {
      if (getComputedStyle(svg).display === "none") {
        svg.innerHTML = "";
        return;
      }
      const g = grid.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${g.width} ${g.height}`);
      svg.innerHTML = "";
      const imgEl = grid.querySelector(".chub-hub img");
      if (!imgEl) return;
      const hb = imgEl.getBoundingClientRect();
      const ins = hb.width * 0.16;
      const H = {
        l: hb.left - g.left + ins,
        r: hb.right - g.left - ins,
        t: hb.top - g.top + ins,
        b: hb.bottom - g.top - ins,
        cx: 0,
        cy: 0,
      };
      H.cx = (H.l + H.r) / 2;
      H.cy = (H.t + H.b) / 2;
      const off = Math.min((H.r - H.l) * 0.34, 26);
      const t = 40;

      type It = { xl: number; xr: number; yt: number; yb: number; cx: number; cy: number; col: string; row: string };
      const items: It[] = [];
      grid.querySelectorAll(".chub-node").forEach((node) => {
        const r = node.getBoundingClientRect();
        const it: It = {
          xl: r.left - g.left,
          xr: r.right - g.left,
          yt: r.top - g.top,
          yb: r.bottom - g.top,
          cx: 0,
          cy: 0,
          col: "",
          row: "",
        };
        it.cx = (it.xl + it.xr) / 2;
        it.cy = (it.yt + it.yb) / 2;
        it.col = it.cx < H.cx - t ? "l" : it.cx > H.cx + t ? "r" : "m";
        it.row = it.cy < H.cy - t ? "t" : it.cy > H.cy + t ? "b" : "m";
        items.push(it);
      });
      if (!items.length) return;
      const topB = Math.max(...items.filter((i) => i.row === "t").map((i) => i.yb));
      const midT = Math.min(...items.filter((i) => i.row === "m").map((i) => i.yt));
      const midB = Math.max(...items.filter((i) => i.row === "m").map((i) => i.yb));
      const botT = Math.min(...items.filter((i) => i.row === "b").map((i) => i.yt));
      const gapTop = (topB + midT) / 2;
      const gapBot = (midB + botT) / 2;

      items.forEach((it) => {
        const { col, row } = it;
        let pts: number[][];
        let pad: number[];
        let via: number[][] = [];
        if (col === "m" && row === "t") {
          pts = [[H.cx, H.t], [H.cx, it.yb]];
          pad = [H.cx, it.yb];
        } else if (col === "m" && row === "b") {
          pts = [[H.cx, H.b], [H.cx, it.yt]];
          pad = [H.cx, it.yt];
        } else if (col === "l" && row === "m") {
          pts = [[H.l, H.cy], [it.xr, H.cy]];
          pad = [it.xr, H.cy];
        } else if (col === "r" && row === "m") {
          pts = [[H.r, H.cy], [it.xl, H.cy]];
          pad = [it.xl, H.cy];
        } else if (row === "t") {
          const sx = col === "l" ? H.cx - off : H.cx + off;
          pts = [[sx, H.t], [sx, gapTop], [it.cx, gapTop], [it.cx, it.yb]];
          pad = [it.cx, it.yb];
          via = [[sx, gapTop], [it.cx, gapTop]];
        } else {
          const sx = col === "l" ? H.cx - off : H.cx + off;
          pts = [[sx, H.b], [sx, gapBot], [it.cx, gapBot], [it.cx, it.yt]];
          pad = [it.cx, it.yt];
          via = [[sx, gapBot], [it.cx, gapBot]];
        }
        line(pts);
        dot("chub-pin", pts[0][0], pts[0][1], 2.2);
        via.forEach((v) => dot("chub-via", v[0], v[1], 2.2));
        dot("chub-pad", pad[0], pad[1], 3.2);
      });
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(grid);
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

      <div className="chub-grid" ref={gridRef}>
        <svg className="chub-wires" ref={svgRef} aria-hidden="true" />

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
