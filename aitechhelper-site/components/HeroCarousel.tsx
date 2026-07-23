"use client";

import { useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

    // Track everything that needs tearing down on unmount (important in
    // React 18 dev Strict Mode, which mounts/unmounts effects twice).
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    /* =========================================================
       PART 1 — HERO: data orb + scroll-pin zoom transition
       ========================================================= */
    const wrap = document.getElementById("orb-canvas-wrap")!;
    // Needed by the hero's scroll handler below as well as the carousel setup.
    const stageEl = document.getElementById("stage")!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(45, 1, 0.05, 100);

    function sizeRenderer() {
      const w = wrap.clientWidth,
        h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      heroCamera.aspect = w / h;
      heroCamera.updateProjectionMatrix();
    }
    sizeRenderer();
    window.addEventListener("resize", sizeRenderer);
    cleanups.push(() => window.removeEventListener("resize", sizeRenderer));

    function makeOrbSprite() {
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
    const orbSprite = makeOrbSprite();

    const stops = [
      { y: 1.0, c: [0.78, 0.9, 1.0] },
      { y: 0.55, c: [0.52, 0.58, 1.0] },
      { y: 0.18, c: [0.55, 0.35, 0.92] },
      { y: -0.15, c: [0.78, 0.24, 0.75] },
      { y: -0.5, c: [0.9, 0.24, 0.43] },
      { y: -0.78, c: [1.0, 0.43, 0.16] },
      { y: -1.0, c: [1.0, 0.75, 0.25] },
    ];
    function colorForY(y: number) {
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i],
          b = stops[i + 1];
        if (y <= a.y && y >= b.y) {
          const t = (a.y - y) / (a.y - b.y);
          return [
            a.c[0] + (b.c[0] - a.c[0]) * t,
            a.c[1] + (b.c[1] - a.c[1]) * t,
            a.c[2] + (b.c[2] - a.c[2]) * t,
          ];
        }
      }
      return stops[stops.length - 1].c;
    }

    const COUNT = 9000;
    const baseDir = new Float32Array(COUNT * 3);
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const radii = new Float32Array(COUNT);

    const golden = Math.PI * (3 - Math.sqrt(5));
    const ORB_R = 1.5;
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const ux = Math.cos(theta) * r;
      const uz = Math.sin(theta) * r;
      const uy = y;

      const edgeFactor = Math.max(0, Math.abs(uy) - 0.55) / 0.45;
      const jitter = 1 + (Math.random() - 0.3) * edgeFactor * 0.9;

      baseDir[i * 3] = ux;
      baseDir[i * 3 + 1] = uy;
      baseDir[i * 3 + 2] = uz;
      radii[i] = ORB_R * jitter;
      phases[i] = Math.random() * Math.PI * 2;

      const colY = Math.max(-1, Math.min(1, uy + (Math.random() - 0.5) * 0.12));
      const col = colorForY(colY);
      colors[i * 3] = col[0];
      colors[i * 3 + 1] = col[1];
      colors[i * 3 + 2] = col[2];

      positions[i * 3] = ux * radii[i];
      positions[i * 3 + 1] = uy * radii[i];
      positions[i * 3 + 2] = uz * radii[i];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.026,
      map: orbSprite,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const orb = new THREE.Points(geo, mat);
    scene.add(orb);

    const FIELD_COUNT = 650;
    const fieldPositions = new Float32Array(FIELD_COUNT * 3);
    const fieldBase = new Float32Array(FIELD_COUNT * 3);
    const fieldColors = new Float32Array(FIELD_COUNT * 3);
    const fieldPhase = new Float32Array(FIELD_COUNT);
    for (let i = 0; i < FIELD_COUNT; i++) {
      const x = (Math.random() * 2 - 1) * 6.8;
      const y = (Math.random() * 2 - 1) * 3.6;
      const z = (Math.random() * 2 - 1) * 3.2 - 0.3;
      fieldBase[i * 3] = x;
      fieldBase[i * 3 + 1] = y;
      fieldBase[i * 3 + 2] = z;
      fieldPositions[i * 3] = x;
      fieldPositions[i * 3 + 1] = y;
      fieldPositions[i * 3 + 2] = z;
      fieldPhase[i] = Math.random() * Math.PI * 2;

      const warm = Math.random() < 0.18;
      if (warm) {
        fieldColors[i * 3] = 1.0;
        fieldColors[i * 3 + 1] = 0.75;
        fieldColors[i * 3 + 2] = 0.55;
      } else {
        fieldColors[i * 3] = 0.75;
        fieldColors[i * 3 + 1] = 0.85;
        fieldColors[i * 3 + 2] = 1.0;
      }
    }
    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute("position", new THREE.BufferAttribute(fieldPositions, 3));
    fieldGeo.setAttribute("color", new THREE.BufferAttribute(fieldColors, 3));
    const fieldMat = new THREE.PointsMaterial({
      size: 0.02,
      map: orbSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const field = new THREE.Points(fieldGeo, fieldMat);
    scene.add(field);

    const clock = new THREE.Clock();
    let scrollProgress = 0;
    let heroRaf = 0;

    /* How far the services stage has faded in over the hero, 0..1. Both render
       loops read it so neither one burns a frame on something the visitor
       can't see: for most of the scroll exactly one of the two scenes is
       actually on screen, and rendering both is what makes the transition
       stutter. */
    let stageIn = 0;

    function animateHero() {
      heroRaf = requestAnimationFrame(animateHero);
      // Fully covered by the stage — nothing here can be seen, so skip the
      // 9,000-point rebuild and the draw entirely.
      if (stageIn >= 1) return;
      const t = clock.getElapsedTime();

      const posAttr = geo.attributes.position;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const amp = 0.05 + 0.05 * Math.min(1, Math.abs(baseDir[i * 3 + 1]) * 1.4);
        const r = radii[i] * (1 + amp * Math.sin(t * 0.6 + phases[i]));
        arr[i * 3] = baseDir[i * 3] * r;
        arr[i * 3 + 1] = baseDir[i * 3 + 1] * r;
        arr[i * 3 + 2] = baseDir[i * 3 + 2] * r;
      }
      posAttr.needsUpdate = true;

      const bob = Math.sin(t * ((Math.PI * 2) / 7)) * 0.12;
      orb.position.y = bob;
      // Slow, patient drift at rest; still winds up as you fly into the core.
      orb.rotation.y = t * (0.06 + scrollProgress * 1.0);
      orb.rotation.x = Math.sin(t * 0.15) * 0.08;

      const fieldAttr = fieldGeo.attributes.position;
      const farr = fieldAttr.array as Float32Array;
      for (let i = 0; i < FIELD_COUNT; i++) {
        farr[i * 3] = fieldBase[i * 3] + Math.sin(t * 0.12 + fieldPhase[i]) * 0.12;
        farr[i * 3 + 1] = fieldBase[i * 3 + 1] + Math.sin(t * 0.18 + fieldPhase[i] * 1.3) * 0.18;
      }
      fieldAttr.needsUpdate = true;
      field.rotation.y = t * 0.015;

      const eased = Math.pow(scrollProgress, 1.6);
      const spiralAngle = scrollProgress * Math.PI * 3;
      const spiralR = 1.3 * (1 - scrollProgress);
      heroCamera.position.x = Math.sin(spiralAngle) * spiralR;
      heroCamera.position.y = 0.1 + Math.cos(spiralAngle) * spiralR * 0.55;
      heroCamera.position.z = 6.4 - eased * 6.28;
      heroCamera.lookAt(0, 0, 0);

      renderer.render(scene, heroCamera);
    }
    animateHero();
    cleanups.push(() => cancelAnimationFrame(heroRaf));
    cleanups.push(() => renderer.dispose());

    const pinTrigger = ScrollTrigger.create({
      trigger: ".pin-wrapper",
      start: "top top",
      end: "bottom bottom",
      pin: ".hero",
      scrub: 1,
      onUpdate: (self: any) => {
        const p = self.progress;
        scrollProgress = p;

        gsap.set("#copy", {
          opacity: 1 - Math.min(1, p / 0.32),
          y: -p * 60,
          scale: 1 - p * 0.08,
        });
        gsap.set("#nav", { opacity: 1 - Math.min(1, p / 0.28) });

        // Services rise out of nothing as the core is reached. No vertical
        // movement — the whole point is that it should feel like arriving,
        // not scrolling. They start resolving as soon as the hero copy has
        // cleared and are fully readable well before the runway ends, so a
        // visitor sees what the site sells without scrolling to the bottom;
        // the remaining scroll just finishes the flight into the core.
        stageIn = clamp01((p - 0.34) / 0.3);
        gsap.set("#stage", { opacity: stageIn });
        // Don't let a half-faded stage swallow clicks meant for the hero.
        stageEl.style.pointerEvents = stageIn > 0.6 ? "auto" : "none";
      },
    });
    cleanups.push(() => pinTrigger.kill());

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
    webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById("webgl-layer")!.appendChild(webglRenderer.domElement);

    const cssScene = new THREE.Scene();
    const cssRenderer = new CSS3DRenderer();
    document.getElementById("css3d-layer")!.appendChild(cssRenderer.domElement);

    function sizeRenderers() {
      const w = stageEl.clientWidth,
        h = stageEl.clientHeight;
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
      if (row) goToIndex(parseInt(row.dataset.index || "0", 10));
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
      if (row) goToIndex(parseInt(row.dataset.index || "0", 10));
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
    }

    function onBackClick() {
      goToIndex(0);
    }
    backBtn.addEventListener("click", onBackClick);
    cleanups.push(() => backBtn.removeEventListener("click", onBackClick));

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

    /* Arriving on /#stage — from a package page's "Back to services" button or
       the nav — should land on the carousel rather than replay the whole
       intro. A normal anchor jump can't do it: #stage is position:fixed, so
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

    if (window.location.hash === "#stage" || returnIdx > 0) {
      requestAnimationFrame(() => {
        if (cancelled) return;
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
          history.replaceState({}, "", "/#stage");

          requestAnimationFrame(() => {
            if (cancelled) return;
            // The stage is now scrolled into place and holding the card the
            // visitor arrived from, so it's safe to reveal — the hero stays
            // covered behind it from here on.
            gsap.set("#stage", { opacity: 1 });
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

  return (
    <>
      <div className="pin-wrapper">
        <section className="hero">
          <div id="orb-canvas-wrap" />

          <nav className="nav" id="nav">
            <div className="logo">
              <div className="logo-mark">AI</div>TECH <span className="dim">HELPER</span>
            </div>
            <div className="nav-links">
              <a href="#">Agents</a>
              <a href="#">Automations</a>
              <a href="/ai-hub">AI Hub</a>
            </div>
            <a href="#" className="cta-pill">
              Contact Us
            </a>
          </nav>

          <div className="copy" id="copy">
            <h1>Implement AI into your Oklahoma business</h1>
            <p className="subtext">
              Every missed call is money walking out the door. We build AI that answers instantly,
              captures every lead, and books the appointment — so you close more deals, keep more
              clients, and get your time back.
            </p>
            <div className="actions">
              <a href="tel:+15722204756" className="btn-primary">
                Call Now
              </a>
              <a href="#" className="btn-ghost">
                See how it works
              </a>
            </div>
          </div>

          <div className="scroll-cue">
            <span>Scroll to enter</span>
            <div className="pill" />
          </div>
        </section>
      </div>

      <div id="stage">
        <div id="webgl-layer" />
        <div id="css3d-layer" />
        <div id="flat-layer" />

        <div className="hud">
          <div className="logo">
            <div className="logo-mark" />
            TECH <span className="dim">HELPER</span>
          </div>
          <div className="nav-links">
            <span>Agents</span>
            <span>Automations</span>
            <a href="/ai-hub">AI Hub</a>
          </div>
          <div className="contact">Contact Us</div>
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
