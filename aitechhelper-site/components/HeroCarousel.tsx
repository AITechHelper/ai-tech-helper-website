"use client";

import { useEffect, type MouseEvent as ReactMouseEvent } from "react";
import { createRoot, type Root } from "react-dom/client";
import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "@/components/Logo";
import ContactButton from "@/components/ContactButton";
import MobileMenu from "@/components/MobileMenu";
import ServicesMenu from "@/components/ServicesMenu";
import TierPageView from "@/components/TierPageView";
import { TIERS } from "@/lib/tiers";

/* The ring's service cards, derived from the same tier definitions the pages
   render — so a copy change in lib/tiers.tsx updates the card, the page, and
   the card's live preview together. Icons stay as raw path strings because
   buildServiceCard still assembles its markup with innerHTML. */
const RING_ICONS: Record<string, string> = {
  bronze:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  silver: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  gold: '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
};

const SERVICES = TIERS.map((tier) => ({
  kicker: tier.cardKicker,
  title: tier.name,
  desc: tier.cardDesc,
  href: "/" + tier.slug,
  tier,
  icon: RING_ICONS[tier.slug],
}));

/* The preview renders at a fixed desktop design frame and is then scaled to
   fit the card, so it looks identical regardless of the visitor's viewport.
   A viewport-relative layout inside a 3D-projected plane reflows unusably. */
const PREVIEW_W = 1440;
const PREVIEW_H = 900;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export default function HeroCarousel() {
  useEffect(() => {
    // Registered here rather than at module scope: this file is imported
    // during SSR too, and ScrollTrigger needs a real window.
    gsap.registerPlugin(ScrollTrigger);
    // Mobile browsers resize the viewport whenever the URL bar hides/shows on
    // scroll. Left alone that re-fires ScrollTrigger's refresh mid-scroll and
    // makes the pinned hero jump — the site's worst "broken on mobile" symptom.
    // Telling ScrollTrigger to ignore those height-only mobile resizes fixes it.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Track everything that needs tearing down on unmount (important in
    // React 18 dev Strict Mode, which mounts/unmounts effects twice).
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    /* =========================================================
       PART 1 — HERO: data orb + scroll-pin zoom transition
       ========================================================= */
    const wrap = document.getElementById("orb-canvas-wrap")!;
    // Needed by the hero's scroll handler below as well as the carousel setup.
    const stageEl = document.getElementById("services")!;
    // Phones get a smaller, tighter orb with fewer but larger points, so it
    // reads as a defined sphere rather than a faint scatter of specks.
    const isMobile = window.innerWidth <= 700;
    // Touch phones/tablets: no real cursor and a weaker GPU. Used to strip the
    // desktop-only interactions (cursor repulsion, the CSS3D dive) and to cap
    // the pixel ratio so the particle passes don't overdraw on retina phones.
    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const canHover =
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? true;
    const isTouch = coarsePointer || isMobile;
    const maxDpr = isMobile ? 1.5 : 2;

    /* =========================================================
       TOUCH / MOBILE — no 3D at all
       =========================================================
       Phones get none of the WebGL: no hero particle orb, no scroll-scrubbed
       dive, no CSS3D services ring. Building any of that just to run it on a
       phone GPU is what made the site feel glitchy. Instead the hero is plain
       DOM copy, and the services menu is an ordinary section right below it
       that scrolls natively. The `.touch-flow` class drives the matching
       layout in globals.css. We set it all up here and return early, so none
       of the Three.js / GSAP-pin code below ever runs on touch. */
    if (isTouch) {
      document.documentElement.classList.add("touch-flow");

      // Reveal the plain hero immediately — there are no particles to animate
      // the wordmark in, so hide it and just show the nav, copy and cue.
      gsap.set("#hero-wordmark", { opacity: 0 });
      gsap.set(["#nav", "#copy", ".scroll-cue"], { opacity: 1 });

      // The services menu: render the same menu-card React tree into the flat
      // layer, show it, and send a tap on any package straight to its page
      // (no ring flight). This mirrors buildMenuCard/showFlat on desktop.
      const flatLayer = document.getElementById("flat-layer")!;
      const menuEl = document.createElement("div");
      menuEl.className = "card3d menu-card flat visible";
      const menuRoot = createRoot(menuEl);
      menuRoot.render(<ServicesMenu />);
      flatLayer.appendChild(menuEl);

      const onTap = (e: MouseEvent) => {
        const row = (e.target as HTMLElement).closest(".service-row") as HTMLElement | null;
        if (!row) return;
        const idx = parseInt(row.dataset.index || "0", 10);
        if (idx > 0) window.location.href = SERVICES[idx - 1].href;
      };
      flatLayer.addEventListener("click", onTap);

      // Arriving on /#services (nav anchor or a package page's back button):
      // just scroll the plain section into view; clear the pre-paint flag.
      const arriving =
        window.location.hash === "#services" ||
        !!new URLSearchParams(window.location.search).get("from");
      if (arriving) {
        document.documentElement.removeAttribute("data-returning");
        history.replaceState({}, "", "/#services");
        requestAnimationFrame(() =>
          document.getElementById("services")?.scrollIntoView()
        );
      }

      return () => {
        document.documentElement.classList.remove("touch-flow");
        flatLayer.removeEventListener("click", onTap);
        // Unmount on a microtask — React errors if a root is torn down while
        // it is mid-render, which is exactly what a synchronous cleanup hits.
        queueMicrotask(() => menuRoot.unmount());
        flatLayer.innerHTML = "";
      };
    }

    const orbSizeFor = (w: number) => (w <= 700 ? 1.05 : Math.min(w / 1200, 1.3));
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    // Opaque black rather than a transparent canvas: the bloom pass composites
    // on a real background, and the page behind is black anyway.
    renderer.setClearColor(0x000000, 1);
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    heroCamera.position.set(0, 0, 6.4);

    // The glow post-processing and the orb's uniforms are built once the scene
    // exists (below). sizeRenderer runs before that, so it guards against null.
    let composer: EffectComposer | null = null;
    let bloom: UnrealBloomPass | null = null;
    let orbUniforms: Record<string, { value: any }> | null = null;

    // The hero pins (position: fixed) during the scroll transition, so its
    // clientWidth/Height can read stale mid-resize and leave the camera aspect
    // wrong — which stretches the sphere into an ellipse and never corrects.
    // The canvas is a full 100vw×100vh, so size and aspect off the viewport,
    // which is always current, and re-run when ScrollTrigger recomputes the pin.
    let lastHeroW = -1;
    function sizeRenderer() {
      const w = window.innerWidth,
        h = window.innerHeight;
      // On touch, ignore height-only changes: those are just the URL bar
      // sliding in/out during scroll, and re-sizing the canvas for them is what
      // makes the pinned orb stretch and jump. Width changes (real rotation /
      // resize) still go through. First call always runs (lastHeroW = -1).
      if (isTouch && w === lastHeroW) return;
      lastHeroW = w;
      renderer.setSize(w, h, false);
      heroCamera.aspect = w / h;
      heroCamera.updateProjectionMatrix();
      composer?.setSize(w, h);
      bloom?.setSize(w, h);
      if (orbUniforms) {
        orbUniforms.uPixelRatio.value = renderer.getPixelRatio();
        orbUniforms.uSize.value = orbSizeFor(w);
      }
    }
    sizeRenderer();
    window.addEventListener("resize", sizeRenderer);
    ScrollTrigger.addEventListener("refresh", sizeRenderer);
    cleanups.push(() => {
      window.removeEventListener("resize", sizeRenderer);
      ScrollTrigger.removeEventListener("refresh", sizeRenderer);
    });

    /* ---------------------------------------------------------
       The hero particle system — one GPU shader, ~11k points.
       On load the points storm in from a scattered cloud and
       assemble into the wordmark, hold, then flow apart into a
       slowly rotating galaxy sphere that breathes and parts around
       the cursor. Every bit of that motion happens in the vertex
       shader, so unlike the old build the CPU never loops over the
       points each frame — which is why this reads as far heavier
       yet runs lighter.
       --------------------------------------------------------- */
    const COUNT = isMobile ? 7000 : 16000;

    // Rasterise the wordmark to a canvas and keep every lit pixel as a target
    // point. A plain bold sans is used rather than the brand face so the shape
    // is identical whether or not the web font has loaded yet.
    function sampleWordmark(lines: string[]) {
      const W = 1100,
        H = 512;
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const ctx = cv.getContext("2d")!;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "800 150px Arial, Helvetica, sans-serif";
      const lh = 168;
      const y0 = H / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((ln, i) => ctx.fillText(ln, W / 2, y0 + i * lh));
      const data = ctx.getImageData(0, 0, W, H).data;
      const pts: number[] = [];
      // Dense sampling so the letters have enough target points to fill solid.
      const step = 2;
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4] > 130) {
            // Big + bold on screen.
            pts.push((x / W - 0.5) * 6.6, -(y / H - 0.5) * 3.0);
          }
        }
      }
      return pts; // flat [x0,y0, x1,y1, ...]
    }
    const textPts = sampleWordmark(["AI TECH", "HELPER"]);
    // If sampling ever yields nothing (e.g. a locked-down canvas), fall back to
    // a single point so the attribute never carries undefined → NaN.
    if (textPts.length === 0) textPts.push(0, 0);
    const textN = textPts.length / 2;

    const spherePos = new Float32Array(COUNT * 3);
    const textPos = new Float32Array(COUNT * 3);
    const startPos = new Float32Array(COUNT * 3);
    const aColor = new Float32Array(COUNT * 3);
    const aRand = new Float32Array(COUNT);

    const golden = Math.PI * (3 - Math.sqrt(5));
    const ORB_R = isMobile ? 1.15 : 1.55;
    for (let i = 0; i < COUNT; i++) {
      // Even shell via the Fibonacci sphere — the resting orb.
      const y = 1 - (i / (COUNT - 1)) * 2;
      const rr = Math.sqrt(1 - y * y);
      const th = golden * i;
      const jitter = 1 + (Math.random() - 0.5) * 0.025;
      spherePos[i * 3] = Math.cos(th) * rr * ORB_R * jitter;
      spherePos[i * 3 + 1] = y * ORB_R * jitter;
      spherePos[i * 3 + 2] = Math.sin(th) * rr * ORB_R * jitter;

      // Wordmark target: a random lit pixel, with a little depth so the text
      // has body rather than sitting on a dead-flat plane.
      const p = (Math.random() * textN) | 0;
      textPos[i * 3] = textPts[p * 2] + (Math.random() - 0.5) * 0.03;
      textPos[i * 3 + 1] = textPts[p * 2 + 1] + (Math.random() - 0.5) * 0.03;
      textPos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;

      // The "exploded" waypoint: a cloud flung outward around the core. The
      // wordmark bursts out to here, then everything pulls in to the sphere.
      const rad = 4 + Math.random() * 3.5;
      const a1 = Math.random() * Math.PI * 2;
      const a2 = Math.acos(Math.random() * 2 - 1);
      startPos[i * 3] = Math.sin(a2) * Math.cos(a1) * rad;
      startPos[i * 3 + 1] = Math.sin(a2) * Math.sin(a1) * rad;
      startPos[i * 3 + 2] = Math.cos(a2) * rad;

      // Brand cyan (#00c6ff) for every particle, with a little per-particle
      // lightness variation so the orb keeps depth instead of reading flat.
      const shade = 0.8 + Math.random() * 0.2;
      aColor[i * 3] = 0.03 * shade;
      aColor[i * 3 + 1] = 0.72 * shade;
      aColor[i * 3 + 2] = 1.0 * shade;
      aRand[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    // 'position' carries the sphere target; the shader derives the drawn point
    // from the attributes, so this bound attribute isn't used for layout — but
    // three needs one, and the sphere is the safe bounding volume.
    geo.setAttribute("position", new THREE.BufferAttribute(spherePos, 3));
    geo.setAttribute("aText", new THREE.BufferAttribute(textPos, 3));
    geo.setAttribute("aStart", new THREE.BufferAttribute(startPos, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(aColor, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));

    orbUniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uMouseR: { value: 1.15 },
      uMousePush: { value: 0.55 },
      uSize: { value: orbSizeFor(window.innerWidth) },
      uSwell: { value: 1 },
      uOpacity: { value: 1 },
      uPixelRatio: { value: renderer.getPixelRatio() },
    };

    const orbMat = new THREE.ShaderMaterial({
      uniforms: orbUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime;
        uniform float uMorph;
        uniform float uSize;
        uniform float uPixelRatio;
        uniform float uSwell;
        uniform float uMouseR;
        uniform float uMousePush;
        uniform vec3 uMouse;
        attribute vec3 aText;
        attribute vec3 aStart;
        attribute vec3 aColor;
        attribute float aRand;
        varying vec3 vColor;

        void main() {
          vColor = aColor;

          // Spin the resting sphere on its axis (manual rotation about Y —
          // avoids swizzle-assignment, which some GLSL compilers reject).
          vec3 sph = position;
          float ang = uTime * 0.16;
          float ca = cos(ang);
          float sa = sin(ang);
          sph = vec3(sph.x * ca - sph.z * sa, sph.y, sph.x * sa + sph.z * ca);

          // Orderly flow straight from the wordmark into the orb — no scattered
          // explosion in between (that read as messy). A gentle per-particle
          // stagger keeps it from looking mechanical without going chaotic.
          float form = smoothstep(0.0, 1.0, clamp((uMorph - aRand * 0.14) / 0.86, 0.0, 1.0));
          vec3 p = mix(aText, sph, form);

          // life once formed: a subtle breathe along the surface normal
          vec3 nrm = normalize(sph + vec3(0.0001));
          p += nrm * sin(uTime * 0.6 + aRand * 6.2831) * 0.035 * form;

          // cursor repulsion in the view plane; brightens what it touches
          vec2 toM = p.xy - uMouse.xy;
          float dm = length(toM);
          float infl = smoothstep(uMouseR, 0.0, dm) * form;
          p.xy += normalize(toM + vec2(0.0001)) * infl * uMousePush;
          vColor += vec3(infl * 0.5);

          p *= uSwell;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float s = uSize * (0.5 + aRand * 0.8);
          gl_PointSize = s * uPixelRatio * (9.0 / -mv.z);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float edge = smoothstep(0.5, 0.05, d);
          float core = smoothstep(0.35, 0.0, d);
          gl_FragColor = vec4(vColor + vec3(core * 0.3), edge * uOpacity);
        }
      `,
    });

    const orb = new THREE.Points(geo, orbMat);
    orb.frustumCulled = false; // during the intro the points sit outside the sphere bound
    scene.add(orb);
    cleanups.push(() => {
      geo.dispose();
      orbMat.dispose();
    });

    // A quiet starfield behind the orb for parallax depth. Static — drifts only
    // by a slow object rotation, so it costs nothing per frame.
    const STAR_COUNT = 320;
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3] = (Math.random() * 2 - 1) * 14;
      starPos[i * 3 + 1] = (Math.random() * 2 - 1) * 8;
      starPos[i * 3 + 2] = -6 - Math.random() * 10;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x8fb4ff,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    cleanups.push(() => {
      starGeo.dispose();
      starMat.dispose();
    });

    // Bloom. Threshold at zero so the whole orb glows; strength/radius tuned to
    // read as light rather than a blown-out white wash.
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, heroCamera));
    bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.55,
      0.6,
      0.18
    );
    composer.addPass(bloom);
    sizeRenderer();
    cleanups.push(() => bloom?.dispose());

    const clock = new THREE.Clock();
    let scrollProgress = 0;
    let heroRaf = 0;

    /* How far the services stage has faded in over the hero, 0..1. Both render
       loops read it so neither one burns a frame on something the visitor
       can't see: for most of the scroll exactly one of the two scenes is
       actually on screen, and rendering both is what makes the transition
       stutter. */
    let stageIn = 0;

    /* --- intro choreography --------------------------------------------
       The real, pixel-crisp "AI TECH HELPER" (a DOM element) reads for ~1s,
       then dissolves as the particles — invisible until now — burst out of it
       (morph: text -> exploded cloud) and rush inward to form the orb.
         reveal: particle opacity, 0 while the crisp text is up, 1 once it bursts
         morph:  0 text -> exploded -> 1 orb
       Skipped (jump straight to the formed orb) when arriving on the services
       stage or with reduced motion. */
    const intro = { morph: 0, reveal: 0 };
    let introReady = false;

    const arrivingServices =
      window.location.hash === "#services" ||
      !!new URLSearchParams(window.location.search).get("from");
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (arrivingServices) {
      intro.morph = 1;
      intro.reveal = 1;
      introReady = true;
      gsap.set("#hero-wordmark", { opacity: 0 });
    } else if (reduceMotion) {
      intro.morph = 1;
      intro.reveal = 1;
      introReady = true;
      gsap.set("#hero-wordmark", { opacity: 0 });
      gsap.set(["#copy", ".scroll-cue"], { opacity: 1 });
      gsap.set("#nav", { opacity: 1 });
    } else {
      const tl = gsap.timeline();
      // Hold the crisp text ~1s. Then the particles start flowing inward
      // ('power2.out' — quick off the letters, gentle settle) while the text
      // fades and the particles fade in, so you see a clean convergence into
      // the orb rather than a readable particle-text or a scattered burst.
      tl.to("#nav", { opacity: 1, duration: 0.7 }, 0.1)
        .to(
          intro,
          {
            morph: 1,
            duration: 2.2,
            ease: "power2.out",
            onComplete: () => {
              introReady = true;
            },
          },
          1.0
        )
        .to("#hero-wordmark", { opacity: 0, duration: 0.4, ease: "power2.in" }, 1.0)
        .to(intro, { reveal: 1, duration: 0.5, ease: "power1.out" }, 1.05)
        .to(["#copy", ".scroll-cue"], { opacity: 1, duration: 0.7, ease: "power2.out" }, 1.9);
      cleanups.push(() => tl.kill());
    }

    function animateHero() {
      heroRaf = requestAnimationFrame(animateHero);
      // Fully covered by the stage — nothing here can be seen, so skip the draw.
      if (stageIn >= 1) return;
      // Whenever the hero is even partly visible, the services stage (fixed,
      // z-index 40, on top) must not swallow clicks meant for the hero's nav and
      // buttons. Dropping .stage-live here every frame guarantees it can never
      // get stuck "on" after you scroll back up from the services stage.
      if (stageEl.classList.contains("stage-live")) stageEl.classList.remove("stage-live");
      const t = clock.getElapsedTime();
      const u = orbUniforms!;

      u.uTime.value = t;
      u.uMorph.value = intro.morph;

      // Swell into the core and burn out as the stage takes over — the same
      // dive the old orb did, now driven entirely through uniforms.
      u.uSwell.value = 1 + Math.pow(scrollProgress, 1.15) * 4.6;
      // Hidden while the crisp DOM text is up (reveal 0); fades away again on
      // the scroll dive as the stage covers the orb.
      u.uOpacity.value = intro.reveal * (1 - clamp01((scrollProgress - 0.54) / 0.22));

      orb.position.y = Math.sin(t * ((Math.PI * 2) / 7)) * 0.1;
      stars.rotation.y = t * 0.01;

      // Camera spirals in as you fall toward the orb's core.
      const eased = Math.pow(scrollProgress, 1.35);
      const spiralAngle = scrollProgress * Math.PI * 3;
      const spiralR = 1.3 * (1 - scrollProgress);
      heroCamera.position.x = Math.sin(spiralAngle) * spiralR;
      heroCamera.position.y = 0.1 + Math.cos(spiralAngle) * spiralR * 0.55;
      heroCamera.position.z = 6.4 - eased * 6.28;
      heroCamera.lookAt(0, 0, 0);

      // Bloom grows as you dive, so the burnout reads as blowing out into light.
      // Low glow while it's still crisp solid text; ramps up as it breaks into
      // the orb, and again as you dive into the core.
      if (bloom) bloom.strength = 0.28 + intro.morph * 0.32 + scrollProgress * 0.45;
      composer!.render();
    }
    animateHero();
    cleanups.push(() => cancelAnimationFrame(heroRaf));
    cleanups.push(() => renderer.dispose());

    // Cursor → a point on the z=0 plane in world space, handed to the shader so
    // the particles part around it. The orb has no object transform (spin and
    // swell both live in the shader), so world xy maps straight to particle xy.
    const mouseNdc = new THREE.Vector3();
    function onPointerMove(e: PointerEvent) {
      if (!orbUniforms) return;
      mouseNdc.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      mouseNdc.unproject(heroCamera);
      const dir = mouseNdc.sub(heroCamera.position).normalize();
      const dist = -heroCamera.position.z / dir.z;
      const world = heroCamera.position.clone().add(dir.multiplyScalar(dist));
      orbUniforms.uMouse.value.set(world.x, world.y, 0);
    }
    function onPointerLeave() {
      orbUniforms?.uMouse.value.set(999, 999, 0);
    }
    // Cursor repulsion is a desktop-only affordance. On touch there is no
    // hovering cursor — pointermove only fires mid-drag, so it just fought the
    // scroll and burned GPU. Only wire it up where a real hover pointer exists.
    if (canHover) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerleave", onPointerLeave);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
      });
    }

    // Desktop only. On touch there is no pin/scrub dive — the hero is a normal
    // section and the services stage sits statically below it (see .touch-flow
    // in globals.css), so this whole scroll-scrubbed choreography is skipped.
    if (!isTouch) {
    const pinTrigger = ScrollTrigger.create({
      trigger: ".pin-wrapper",
      start: "top top",
      end: "bottom bottom",
      pin: ".hero",
      scrub: 1,
      onUpdate: (self: any) => {
        const p = self.progress;
        scrollProgress = p;

        // The intro owns nav + centre copy until it has finished handing them
        // over (introReady); after that, scroll drives their exit.
        if (introReady) {
          gsap.set("#copy", {
            opacity: 1 - Math.min(1, p / 0.32),
            y: -p * 60,
            scale: 1 - p * 0.08,
          });
          gsap.set(".scroll-cue", { opacity: 1 - Math.min(1, p / 0.2) });
          gsap.set("#nav", { opacity: 1 - Math.min(1, p / 0.28) });
        }

        // Services rise out of nothing as the core is reached. No vertical
        // movement — the whole point is that it should feel like arriving,
        // not scrolling. They start resolving as soon as the hero copy has
        // cleared and are fully readable well before the runway ends, so a
        // visitor sees what the site sells without scrolling to the bottom;
        // the remaining scroll just finishes the flight into the core.
        /* The hero copy has cleared by 0.32, the services begin resolving at
           0.36 while the orb is still swelling, and the orb dissolves out from
           behind them by 0.76. */
        stageIn = clamp01((p - 0.36) / 0.26);
        gsap.set("#services", { opacity: stageIn });
        // Only capture clicks once the stage fully covers the hero (its resting
        // state); any less and the hero underneath must stay clickable. The
        // render loop also forces this off whenever the hero is drawing.
        stageEl.classList.toggle("stage-live", stageIn >= 1);
      },
    });
    cleanups.push(() => pinTrigger.kill());
    }

    /* =========================================================
       PART 2 — services carousel (CSS3D ring, click-driven)
       ========================================================= */
    const N = SERVICES.length + 1;
    const R = 900;
    let activeIndex = 0;
    let angle = 0;
    let isAnimating = false;

    const camera = new THREE.PerspectiveCamera(
      50,
      stageEl.clientWidth / stageEl.clientHeight,
      1,
      8000
    );

    const webglScene = new THREE.Scene();
    const webglRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    document.getElementById("webgl-layer")!.appendChild(webglRenderer.domElement);

    const cssScene = new THREE.Scene();
    const cssRenderer = new CSS3DRenderer();
    document.getElementById("css3d-layer")!.appendChild(cssRenderer.domElement);

    let lastStageW = -1;
    function sizeRenderers() {
      const w = stageEl.clientWidth,
        h = stageEl.clientHeight;
      // Same URL-bar-thrash guard as the hero: on touch, only re-lay-out the
      // stage when its width actually changes, not when the address bar toggles.
      if (isTouch && w === lastStageW) return;
      lastStageW = w;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      webglRenderer.setSize(w, h);
      cssRenderer.setSize(w, h);
    }
    sizeRenderers();
    window.addEventListener("resize", sizeRenderers);
    cleanups.push(() => window.removeEventListener("resize", sizeRenderers));

    function makeSprite() {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.9)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    const sprite = makeSprite();
    const DUST = 450;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() * 2 - 1) * 3200;
      dustPos[i * 3 + 1] = (Math.random() * 2 - 1) * 1500;
      dustPos[i * 3 + 2] = (Math.random() * 2 - 1) * 3200;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 6,
      map: sprite,
      color: 0x66b8ff,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    webglScene.add(new THREE.Points(dustGeo, dustMat));

    /* A smaller echo of the hero's orb, parked at the centre of the ring so
       the middle of the stage reads as the thing the cards are orbiting
       rather than as empty space. It lives in the WebGL layer, which paints
       under the CSS3D cards, so it always sits behind them. */
    const RING_ORB_COUNT = 2600;
    const RING_ORB_R = 250;
    const ringOrbPos = new Float32Array(RING_ORB_COUNT * 3);
    const ringOrbDir = new Float32Array(RING_ORB_COUNT * 3);
    const ringOrbPhase = new Float32Array(RING_ORB_COUNT);
    const ringGolden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < RING_ORB_COUNT; i++) {
      const y = 1 - (i / (RING_ORB_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = ringGolden * i;
      const ux = Math.cos(th) * r;
      const uz = Math.sin(th) * r;
      ringOrbDir[i * 3] = ux;
      ringOrbDir[i * 3 + 1] = y;
      ringOrbDir[i * 3 + 2] = uz;
      ringOrbPhase[i] = Math.random() * Math.PI * 2;
      ringOrbPos[i * 3] = ux * RING_ORB_R;
      ringOrbPos[i * 3 + 1] = y * RING_ORB_R;
      ringOrbPos[i * 3 + 2] = uz * RING_ORB_R;
    }
    const ringOrbGeo = new THREE.BufferGeometry();
    ringOrbGeo.setAttribute("position", new THREE.BufferAttribute(ringOrbPos, 3));
    const ringOrbMat = new THREE.PointsMaterial({
      size: 8,
      map: sprite,
      color: 0x7fd4ff,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const ringOrb = new THREE.Points(ringOrbGeo, ringOrbMat);
    webglScene.add(ringOrb);
    cleanups.push(() => {
      ringOrbGeo.dispose();
      ringOrbMat.dispose();
    });

    const carouselClock = new THREE.Clock();

    const anchorGeo = new THREE.SphereGeometry(7, 16, 16);
    const anchorMat = new THREE.MeshBasicMaterial({ color: 0x00c6ff });
    for (let i = 0; i < N; i++) {
      const a = i * ((Math.PI * 2) / N);
      const m = new THREE.Mesh(anchorGeo, anchorMat);
      m.position.set(R * Math.sin(a), -420, R * Math.cos(a));
      webglScene.add(m);
    }

    function iconSvg(icon: string) {
      return '<svg viewBox="0 0 24 24">' + icon + "</svg>";
    }

    /* Rendered through React so the menu and the comparison matrix read from
       lib/tiers.tsx directly. Clicks are still handled by delegation on the
       layer, so the rows keep working exactly as when this was innerHTML. */
    function buildMenuCard() {
      const el = document.createElement("div");
      el.className = "card3d menu-card";
      const root = createRoot(el);
      root.render(<ServicesMenu />);
      previewRoots.push(root);
      return el;
    }

    function buildServiceCard(service: (typeof SERVICES)[number]) {
      const el = document.createElement("div");
      el.className = "card3d service-card";
      const action =
        '<a class="cta" href="' +
        service.href +
        '">Explore ' +
        service.title +
        ' <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';

      el.innerHTML =
        '<div class="icon-badge">' +
        iconSvg(service.icon) +
        "</div>" +
        '<div class="kicker">' +
        service.kicker +
        "</div>" +
        "<h2>" +
        service.title +
        "</h2>" +
        "<p>" +
        service.desc +
        "</p>" +
        action;
      return el;
    }

    /* A ring card showing a live, scaled-down render of the service's real
       page. Mounted through its own React root: the card element belongs to
       CSS3DRenderer's DOM tree, not React's, so it can't be a child of this
       component's returned JSX. */
    const previewRoots: Root[] = [];
    const previewFrames: HTMLElement[] = [];

    function buildPreviewCard(service: (typeof SERVICES)[number]) {
      const el = document.createElement("div");
      el.className = "card3d preview-card";

      const frame = document.createElement("div");
      frame.className = "page-preview";
      frame.style.width = PREVIEW_W + "px";
      frame.style.height = PREVIEW_H + "px";
      el.appendChild(frame);

      const root = createRoot(frame);
      root.render(<TierPageView tier={service.tier} interactive={false} />);
      previewRoots.push(root);
      previewFrames.push(frame);
      return el;
    }

    function layoutPreviews() {
      previewFrames.forEach((frame) => {
        const card = frame.parentElement;
        if (!card || !card.clientWidth) return;
        const s = Math.min(card.clientWidth / PREVIEW_W, card.clientHeight / PREVIEW_H);
        frame.style.transform = "translate(-50%, -50%) scale(" + s + ")";
      });
    }
    window.addEventListener("resize", layoutPreviews);
    cleanups.push(() => window.removeEventListener("resize", layoutPreviews));

    // React complains if a root is unmounted while it is already rendering,
    // which is exactly what happens when this effect's cleanup runs.
    cleanups.push(() => previewRoots.forEach((r) => queueMicrotask(() => r.unmount())));

    const cardObjects: any[] = [];
    for (let i = 0; i < N; i++) {
      const a = i * ((Math.PI * 2) / N);
      const el = i === 0 ? buildMenuCard() : buildPreviewCard(SERVICES[i - 1]);
      const obj = new CSS3DObject(el);
      obj.position.set(R * Math.sin(a), 0, R * Math.cos(a));
      obj.rotation.y = a;
      cssScene.add(obj);
      cardObjects.push(obj);
    }

    const css3dLayerEl = document.getElementById("css3d-layer")!;

    /* The ring is only on screen during a transition; the resting menu is the
       flat DOM panel. Mirroring that visibility in a flag lets the render loop
       skip the CSS3D pass, which is what keeps scrolling smooth. */
    let css3dVisible = false;
    // ...but the cards need one pass to land in the DOM before their size can
    // be measured, or the first transition shows unscaled previews.
    let cssWarmupFrames = 5;
    function setCss3dVisible(v: boolean) {
      css3dVisible = v;
      css3dLayerEl.style.opacity = v ? "1" : "0";
    }

    function onCss3dClick(e: MouseEvent) {
      const row = (e.target as HTMLElement).closest(".service-row") as HTMLElement | null;
      if (!row) return;
      const idx = parseInt(row.dataset.index || "0", 10);
      if (isTouch && idx > 0) {
        window.location.href = SERVICES[idx - 1].href;
        return;
      }
      goToIndex(idx);
    }
    css3dLayerEl.addEventListener("click", onCss3dClick);
    cleanups.push(() => css3dLayerEl.removeEventListener("click", onCss3dClick));

    const flatLayer = document.getElementById("flat-layer")!;
    const flatMenuEl = buildMenuCard();
    flatMenuEl.classList.add("flat");
    flatLayer.appendChild(flatMenuEl);

    const flatServiceEls = SERVICES.map((s) => {
      const el = buildServiceCard(s);
      el.classList.add("flat");
      flatLayer.appendChild(el);
      return el;
    });

    function showFlat(idx: number) {
      flatMenuEl.classList.toggle("visible", idx === 0);
      flatServiceEls.forEach((el, i) => el.classList.toggle("visible", idx === i + 1));
    }
    showFlat(0);

    function onFlatClick(e: MouseEvent) {
      const row = (e.target as HTMLElement).closest(".service-row") as HTMLElement | null;
      if (!row) return;
      const idx = parseInt(row.dataset.index || "0", 10);
      // On touch, skip the CSS3D ring flight (three live page previews projected
      // in 3D — the heaviest, jankiest thing on the page) and just go to the
      // service page. The desktop dive stays exactly as it was.
      if (isTouch && idx > 0) {
        window.location.href = SERVICES[idx - 1].href;
        return;
      }
      goToIndex(idx);
    }
    flatLayer.addEventListener("click", onFlatClick);
    cleanups.push(() => flatLayer.removeEventListener("click", onFlatClick));

    const HOME_ZOOM = 0.42;
    const camState = { zoom: HOME_ZOOM };

    function updateCamera() {
      const closeR = R + 900,
        closeY = 30;
      const wideR = R + 1900,
        wideY = 700;
      const radius = closeR + (wideR - closeR) * camState.zoom;
      const y = closeY + (wideY - closeY) * camState.zoom;

      camera.position.set(radius * Math.sin(angle), y, radius * Math.cos(angle));

      const focusTarget = new THREE.Vector3(R * Math.sin(angle), 0, R * Math.cos(angle));
      const wideTarget = new THREE.Vector3(0, -320, 0);
      const lookTarget = focusTarget.clone().lerp(wideTarget, camState.zoom);
      camera.lookAt(lookTarget);
    }
    updateCamera();

    const backBtn = document.getElementById("backBtn")!;
    const hint = document.getElementById("hint")!;

    function angleFor(idx: number) {
      return idx * ((Math.PI * 2) / N);
    }

    /* Held so a bfcache restore can kill a transition that was still in flight
       when the visitor navigated away — see the pageshow handler below. */
    let activeTl: gsap.core.Timeline | null = null;

    function goToIndex(targetIdx: number) {
      if (isAnimating || targetIdx === activeIndex) return;
      isAnimating = true;
      showFlat(-1);
      setCss3dVisible(true);

      const targetAngle = angleFor(targetIdx);
      let diff = (targetAngle - angle) % (Math.PI * 2);
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;
      const finalAngle = angle + diff;
      const restZoom = targetIdx === 0 ? HOME_ZOOM : 0;

      const tl = gsap.timeline({
        onComplete: () => {
          activeTl = null;
          isAnimating = false;
          activeIndex = targetIdx;
          if (targetIdx === 0) {
            backBtn.classList.remove("visible");
            hint.style.opacity = "1";
            setCss3dVisible(false);
            showFlat(0);
          } else {
            window.location.href = SERVICES[targetIdx - 1].href;
          }
        },
      });

      tl.to(camState, { zoom: 1, duration: 0.9, ease: "power2.inOut", onUpdate: updateCamera })
        .to(
          { a: angle },
          {
            a: finalAngle,
            duration: 1.15,
            ease: "power2.inOut",
            onUpdate: function (this: any) {
              angle = this.targets()[0].a;
              updateCamera();
            },
          }
        )
        .to(camState, {
          zoom: restZoom,
          duration: 0.9,
          ease: "power2.inOut",
          onUpdate: updateCamera,
          onComplete: () => {
            angle = finalAngle;
            updateCamera();
          },
        });

      activeTl = tl;
    }

    function onBackClick() {
      goToIndex(0);
    }
    backBtn.addEventListener("click", onBackClick);
    cleanups.push(() => backBtn.removeEventListener("click", onBackClick));

    /* Browser Back from a package page restores this document from the
       bfcache: no script re-runs, so the carousel comes back exactly as it was
       left — parked on the card we navigated away from, ring showing, flat
       menu hidden, and nothing to click. Worse, a transition still in flight
       would resume on restore and fire the onComplete that navigates, bouncing
       the visitor straight back to the page they just left.
       So kill anything running and play the same return trip the in-stage
       back button uses, landing them on the menu. */
    function onPageShow(e: PageTransitionEvent) {
      if (!e.persisted) return;

      activeTl?.kill();
      activeTl = null;
      isAnimating = false;

      if (activeIndex === 0) {
        // Already resting on the menu — just make sure it's the panel showing.
        setCss3dVisible(false);
        showFlat(0);
        return;
      }
      // The hint belongs to the menu; goToIndex puts it back on arrival.
      hint.style.opacity = "0";
      goToIndex(0);
    }
    window.addEventListener("pageshow", onPageShow);
    cleanups.push(() => window.removeEventListener("pageshow", onPageShow));

    let carouselRaf = 0;
    let previewsLaidOut = false;
    function animateCarousel() {
      carouselRaf = requestAnimationFrame(animateCarousel);

      // Still behind an opaque hero: the stage is invisible, so don't draw it.
      if (stageIn <= 0) return;

      // Slow drift and a gentle breathe, matching the hero orb's character.
      // Held still while the stage is mid-fade — during those frames the hero
      // is drawing too, and a breathe nobody can make out isn't worth the
      // second CPU pass over the buffer.
      const ct = carouselClock.getElapsedTime();
      ringOrb.rotation.y = ct * 0.06;
      if (stageIn >= 1) {
        const rp = ringOrbGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < RING_ORB_COUNT; i++) {
          const rr = RING_ORB_R * (1 + 0.06 * Math.sin(ct * 0.5 + ringOrbPhase[i]));
          rp[i * 3] = ringOrbDir[i * 3] * rr;
          rp[i * 3 + 1] = ringOrbDir[i * 3 + 1] * rr;
          rp[i * 3 + 2] = ringOrbDir[i * 3 + 2] * rr;
        }
        ringOrbGeo.attributes.position.needsUpdate = true;
      }

      webglRenderer.render(webglScene, camera);
      // The ring holds three full page previews. Re-projecting that much DOM
      // every frame is the single most expensive thing on the page, and it's
      // hidden at rest — only pay for it while the ring is actually showing.
      if (css3dVisible || cssWarmupFrames > 0) {
        cssRenderer.render(cssScene, camera);
        if (!css3dVisible) cssWarmupFrames--;
      }

      // Cards only get their size once CSS3DRenderer has put them in the DOM,
      // so the preview scale can't be computed until after the first render.
      if (!previewsLaidOut && previewFrames.some((f) => f.parentElement?.clientWidth)) {
        previewsLaidOut = true;
        layoutPreviews();
      }
    }
    animateCarousel();
    cleanups.push(() => cancelAnimationFrame(carouselRaf));
    cleanups.push(() => webglRenderer.dispose());

    /* Arriving on /#services — from a package page's "Back to services" button
       or the nav — should land on the carousel rather than replay the whole
       intro. A normal anchor jump can't do it: #services is position:fixed, so
       it's always at the top of the viewport and scrolling "to" it is a no-op,
       leaving the visitor at the hero with the stage still at opacity 0.
       Jumping to the end of the pin runway drives the pin progress to 1, which
       is what actually reveals the stage. */
    /* A package page's back button also passes ?from=<slug>. That card is
       where the visitor "is", so rather than dropping them on the menu we park
       the ring on it — zoomed in, exactly as they left it — and then play the
       same zoom-out-and-spin that the in-stage back button uses. The animation
       can't run across the page load itself (following a link is a real
       navigation), so it plays on arrival instead. */
    const returnSlug = new URLSearchParams(window.location.search).get("from");
    const returnIdx = SERVICES.findIndex((s) => s.tier.slug === returnSlug) + 1;

    if (window.location.hash === "#services" || returnIdx > 0) {
      requestAnimationFrame(() => {
        if (cancelled) return;
        // Touch has no pin/ring: just scroll the plain services section into
        // view. (Clear the return flag the pre-paint script may have set.)
        if (isTouch) {
          document.documentElement.removeAttribute("data-returning");
          history.replaceState({}, "", "/#services");
          stageEl.scrollIntoView({ behavior: "auto" });
          return;
        }
        // Pinning inserts spacers, so the document isn't its final height
        // until ScrollTrigger has measured.
        ScrollTrigger.refresh();
        window.scrollTo(0, document.documentElement.scrollHeight);

        if (returnIdx > 0) {
          // The scrub means the pin's onUpdate hasn't caught up to the jump
          // yet, and the stage is about to be revealed by hand below — so tell
          // the render loops it's on screen rather than waiting for them.
          stageIn = 1;
          activeIndex = returnIdx;
          angle = angleFor(returnIdx);
          camState.zoom = 0;
          updateCamera();
          showFlat(-1);
          setCss3dVisible(true);
          hint.style.opacity = "0";

          // Drop the query so a refresh doesn't replay the return trip.
          history.replaceState({}, "", "/#services");

          requestAnimationFrame(() => {
            if (cancelled) return;
            // The stage is now scrolled into place and holding the card the
            // visitor arrived from, so it's safe to reveal — the hero stays
            // covered behind it from here on.
            gsap.set("#services", { opacity: 1 });
            document.documentElement.removeAttribute("data-returning");
            goToIndex(0);
          });
        }
      });
    }

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      wrap.innerHTML = "";
      document.getElementById("webgl-layer")!.innerHTML = "";
      document.getElementById("css3d-layer")!.innerHTML = "";
      flatLayer.innerHTML = "";
    };
  }, []);

  // "Services" nav/CTA target. On desktop, scrolling to the bottom drives the
  // pin runway to its end (which reveals the stage); on touch there's no pin, so
  // scroll the plain services section into view instead.
  const goToServices = (e: ReactMouseEvent) => {
    e.preventDefault();
    const svc = document.getElementById("services");
    if (document.documentElement.classList.contains("touch-flow") && svc) {
      svc.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="pin-wrapper">
        <section className="hero">
          <div id="orb-canvas-wrap" />

          {/* Pixel-crisp real text that reads for ~1s, then dissolves as the
              particles burst out of it. aria-hidden — the SEO/a11y H1 lives in
              the copy block below. */}
          <div id="hero-wordmark" className="hero-wordmark" aria-hidden="true">
            AI TECH<br />HELPER
          </div>

          <nav className="nav" id="nav" style={{ opacity: 0 }}>
            <Logo />
            <div className="nav-links">
              <a href="#services" onClick={goToServices}>
                Services
              </a>
              <a href="/ai-tools">AI Tools</a>
              <a href="/ai-hub">AI Hub</a>
            </div>
            <ContactButton />
            <MobileMenu />
          </nav>

          <div className="copy" id="copy" style={{ opacity: 0 }}>
            {/* The particle intro delivers the wordmark; this stays for SEO and
                screen readers without muddying the orb behind the copy. */}
            <h1 className="sr-only">AI Tech Helper</h1>
            <p className="hero-lede">AI that saves you time and makes you money</p>
            <div className="actions">
              <a href="tel:+15722204756" className="btn-primary">
                Call Now
              </a>
              <a href="#services" className="btn-ghost" onClick={goToServices}>
                Get Started
              </a>
            </div>
          </div>

          <div className="scroll-cue" style={{ opacity: 0 }}>
            <span>Scroll to enter</span>
            <div className="pill" />
          </div>
        </section>
      </div>

      <div id="services">
        <div id="webgl-layer" />
        <div id="css3d-layer" />
        <div id="flat-layer" />

        <div className="hud">
          <Logo />
          <div className="nav-links">
            <span>Services</span>
            <a href="/ai-tools">AI Tools</a>
            <a href="/ai-hub">AI Hub</a>
          </div>
          <div className="contact">Contact Us</div>
          <MobileMenu />
        </div>

        <button className="back-btn" id="backBtn">
          <svg viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to services
        </button>

        <div className="hint" id="hint">
          Click a service to explore
        </div>
      </div>
    </>
  );
}
