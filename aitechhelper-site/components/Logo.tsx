/* The wordmark, used by every nav on the site — the hero's full nav, the
   carousel HUD, the package pages and the AI Hub. It is sized by height alone
   so the one file serves all of them; the HUD just asks for a shorter one.

   Intrinsic width/height are declared so the browser reserves the right box
   before the PNG arrives. The hero pins and animates around this nav, and a
   logo that popped in at its real size mid-scroll would shift everything
   beside it. */
export default function Logo() {
  return (
    <div className="logo">
      <img
        src="/assets/logo.png"
        alt="AI Tech Helper"
        className="logo-img"
        width={1757}
        height={517}
      />
    </div>
  );
}
