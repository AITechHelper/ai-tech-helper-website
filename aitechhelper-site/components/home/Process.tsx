const STEPS = [
  {
    n: "01",
    title: "Quick discovery call",
    desc: "We learn your business — the calls you get, the questions you're asked, how you book, and what a lead is worth. 20 minutes, no pressure.",
  },
  {
    n: "02",
    title: "We build & train your agent",
    desc: "We set up your voice and messaging agent on your number and channels, trained on your services, pricing, hours and service area. You review it before it goes live.",
  },
  {
    n: "03",
    title: "Go live in days, not months",
    desc: "Your agent starts answering every call and message 24/7, qualifying leads and booking straight onto your calendar. Nothing for you to install.",
  },
  {
    n: "04",
    title: "We tune it as you grow",
    desc: "We watch the transcripts, sharpen the answers, and add reminders, follow-up, reviews and invoicing as you move up the packages. You just get the results.",
  },
];

/* How it works — a plain four-step path so a first-time visitor knows exactly
   what working with us looks like. */
export default function Process() {
  return (
    <section className="home-section home-process" id="process">
      <div className="home-section-head">
        <span className="home-kicker">How it works</span>
        <h2>Live in days, hands-off from there</h2>
        <p>We do the building and the tuning. You get an assistant that never clocks out.</p>
      </div>

      <ol className="home-steps">
        {STEPS.map((s) => (
          <li className="home-step" key={s.n}>
            <span className="home-step-n">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </li>
        ))}
      </ol>

      <div className="home-process-cta">
        <a href="#final-cta" className="btn-primary">
          Book your discovery call
        </a>
      </div>
    </section>
  );
}
