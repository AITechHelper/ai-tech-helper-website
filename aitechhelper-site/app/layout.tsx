import type { Metadata } from "next";
import ContactModal from "@/components/ContactModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Tech Helper",
  description:
    "Voice agents, messaging, and automation for Oklahoma businesses — so you never miss a call, lose a lead, or chase an invoice again.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Runs before first paint. When arriving from a package page's back
            button, the hero would otherwise sit on screen at full opacity
            through HTML parse, the CDN script loads, and hydration — a visible
            flash before HeroCarousel can scroll to the stage and start the
            spin. Marking the document here lets CSS hide the hero from the
            very first frame. The timeout is a failsafe: if the carousel's
            scripts never arrive, the page must not stay blank forever. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(location.search.indexOf('from=')>-1){var d=document.documentElement;d.setAttribute('data-returning','');setTimeout(function(){d.removeAttribute('data-returning')},4000)}}catch(e){}})()",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ContactModal />
      </body>
    </html>
  );
}
