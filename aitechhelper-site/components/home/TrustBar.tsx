/* A slim credibility band under the hero. Rather than invent stats, it shows
   something true and reassuring: the agent answers on every channel a customer
   might use to reach the business. */
const CHANNELS = [
  "Phone calls",
  "Text / SMS",
  "Website chat",
  "Instagram",
  "Facebook",
  "WhatsApp",
  "Google",
  "Email",
];

export default function TrustBar() {
  return (
    <section className="home-trustbar" aria-label="Channels we answer on">
      <p className="home-trustbar-label">
        Answers your customers everywhere they already reach out
      </p>
      <ul className="home-trustbar-list">
        {CHANNELS.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  );
}
