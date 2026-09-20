/* A short, done-for-you trust strip. Replaces the longer "Done for you" feature
   band with a compact row: the point is that setup is entirely on us, stated
   plainly without a wall of copy. */
const ITEMS = [
  { t: "Done for you", d: "You don't touch any setup. We build the whole thing." },
  { t: "On your own number", d: "Runs on your existing number and channels." },
  { t: "Trained on your business", d: "Your services, pricing and voice, not a template." },
  { t: "Tuned every month", d: "We watch it work and sharpen it as you grow." },
];

export default function TrustStrip() {
  return (
    <section className="home-section home-trust">
      <div className="home-trust-grid">
        {ITEMS.map((i) => (
          <div className="home-trust-item" key={i.t}>
            <h3>{i.t}</h3>
            <p>{i.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
