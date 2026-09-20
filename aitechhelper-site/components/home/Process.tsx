const STEPS = [
  {
    n: "01",
    title: "Reach Out",
    desc: "Book a free assessment or give us a call. We learn your business, your busiest channels, and what a lead is actually worth to you.",
  },
  {
    n: "02",
    title: "Find Your Plan",
    desc: "We point you to the tier that fits, Bronze, Silver or Gold, based on where you're losing time and leads right now.",
  },
  {
    n: "03",
    title: "We Build It",
    desc: "We set the whole thing up on your existing number and channels, trained on your services and pricing. You review it before it goes live.",
  },
  {
    n: "04",
    title: "Grow",
    desc: "Your system runs day and night, capturing leads and following up. We tune it every month as you scale.",
  },
];

/* How it works, a plain four-step path so a first-time visitor knows exactly
   what working with us looks like. The connecting line/arrows are drawn in CSS
   (.home-steps) so the steps read as a sequence, not four identical cards. */
export default function Process() {
  return (
    <section className="home-section home-process" id="process">
      <div className="home-section-head">
        <span className="home-kicker">How it works</span>
        <h2>Live in days, hands-off from there</h2>
        <p>We do the building and the tuning. You get a system that never clocks out.</p>
      </div>

      <ol className="home-steps home-steps--flow">
        {STEPS.map((s) => (
          <li className="home-step" key={s.n}>
            <span className="home-step-n">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </li>
        ))}
      </ol>

      <div className="home-process-cta">
        <a href="/contact" className="btn-primary">
          Book a call
        </a>
      </div>
    </section>
  );
}
