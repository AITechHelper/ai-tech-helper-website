import ImgSlot from "@/components/home/ImgSlot";

/* A two-column image + copy band, used to break up the page with real photos
   and reinforce who we're for and how we work. `side` controls which side the
   image sits on (it stacks image-first on mobile either way). */
export default function Feature({
  kicker,
  title,
  body,
  bullets,
  img,
  alt,
  side = "right",
}: {
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  img: string;
  alt: string;
  side?: "left" | "right";
}) {
  return (
    <section className={`home-section home-feature side-${side}`}>
      <div className="home-feature-copy">
        <span className="home-kicker">{kicker}</span>
        <h2>{title}</h2>
        <p>{body}</p>
        <ul className="home-feature-bullets">
          {bullets.map((b) => (
            <li key={b}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="home-feature-media">
        <ImgSlot src={img} alt={alt} label={`Add ${img}`} ratio="3 / 2" />
      </div>
    </section>
  );
}
