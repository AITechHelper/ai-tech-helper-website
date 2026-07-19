"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    THREE: any;
    gsap: any;
    ScrollTrigger: any;
  }
}

const SERVICES = [
  {
    kicker: "AI Agent",
    title: "Receptionist",
    desc: "Answers every call, qualifies the lead, and books the appointment — 24/7, live on your calendar.",
    href: "/ai-receptionist",
    icon: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  },
  {
    kicker: "AI Agents",
    title: "Receptionist+",
    desc: "Adds instant replies across SMS, website chat, Instagram, Facebook, and WhatsApp — nobody goes cold.",
    href: "/receptionist-plus",
    icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  },
  {
    kicker: "Complete Package",
    title: "Receptionist Max",
    desc: "The full automation layer — contracts, reminders, reviews, and follow-up — running behind the scenes.",
    href: "/receptionist-max",
    icon: '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
  },
];

export default function HeroCarousel() {
  useEffect(() => {
    if (!window.THREE || !window.gsap || !window.ScrollTrigger) return;
    const THREE = window.THREE;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // Track everything that needs tearing down on unmount (important in
    // React 18 dev Strict Mode, which mounts/unmounts effects twice).
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    /* =========================================================
       PART 1 — HERO: data orb + scroll-pin zoom transition
       ========================================================= */
    const wrap = document.getElementById("orb-canvas-wrap")!;
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

    function animateHero() {
      heroRaf = requestAnimationFrame(animateHero);
      const t = clock.getElapsedTime();

      const posAttr = geo.attributes.position;
      const arr = posAttr.array;
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
      orb.rotation.y = t * (0.12 + scrollProgress * 1.6);
      orb.rotation.x = Math.sin(t * 0.15) * 0.08;

      const fieldAttr = fieldGeo.attributes.position;
      const farr = fieldAttr.array;
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
        scrollProgress = self.progress;
        gsap.set("#copy", {
          opacity: 1 - Math.min(1, self.progress / 0.45),
          y: -self.progress * 60,
          scale: 1 - self.progress * 0.08,
        });
        gsap.set("#nav", { opacity: 1 - Math.min(1, self.progress / 0.35) });
        const flash = Math.max(0, (self.progress - 0.72) / 0.26);
        gsap.set("#warp-flash", { opacity: Math.min(1, flash) });

        const appear = Math.max(0, Math.min(1, (self.progress - 0.65) / 0.2));
        const holdFade = self.progress > 0.9 ? Math.max(0, 1 - (self.progress - 0.9) / 0.1) : 1;
        const logoOpacity = appear * holdFade;
        gsap.set("#logo-reveal", {
          opacity: logoOpacity,
          scale: 0.5 + appear * 0.65,
        });
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

    const stage = document.getElementById("stage")!;
    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 1, 8000);

    const webglScene = new THREE.Scene();
    const webglRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById("webgl-layer")!.appendChild(webglRenderer.domElement);

    const cssScene = new THREE.Scene();
    const cssRenderer = new THREE.CSS3DRenderer();
    document.getElementById("css3d-layer")!.appendChild(cssRenderer.domElement);

    function sizeRenderers() {
      const w = stage.clientWidth,
        h = stage.clientHeight;
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
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    webglScene.add(new THREE.Points(dustGeo, dustMat));

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

    function buildMenuCard() {
      const el = document.createElement("div");
      el.className = "card3d menu-card";
      const rows = SERVICES.map(
        (s, i) =>
          '<button class="service-row" data-index="' +
          (i + 1) +
          '">' +
          '<div class="icon-badge">' +
          iconSvg(s.icon) +
          "</div>" +
          '<div class="text"><h3>' +
          s.title +
          "</h3><p>" +
          s.desc +
          "</p></div>" +
          '<div class="arrow"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div>' +
          "</button>"
      ).join("");
      el.innerHTML =
        '<div class="eyebrow">What we build</div>' +
        "<h1>Our services</h1>" +
        '<div class="service-list">' +
        rows +
        "</div>";
      return el;
    }

    function buildServiceCard(service: (typeof SERVICES)[number]) {
      const el = document.createElement("div");
      el.className = "card3d service-card";
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
        '<a class="cta" href="' +
        service.href +
        '">Explore ' +
        service.title +
        ' <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
      return el;
    }

    const cardObjects: any[] = [];
    for (let i = 0; i < N; i++) {
      const a = i * ((Math.PI * 2) / N);
      const el = i === 0 ? buildMenuCard() : buildServiceCard(SERVICES[i - 1]);
      const obj = new THREE.CSS3DObject(el);
      obj.position.set(R * Math.sin(a), 0, R * Math.cos(a));
      obj.rotation.y = a;
      cssScene.add(obj);
      cardObjects.push(obj);
    }

    const css3dLayerEl = document.getElementById("css3d-layer")!;
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
      css3dLayerEl.style.opacity = "1";

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
            css3dLayerEl.style.opacity = "0";
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
    function animateCarousel() {
      carouselRaf = requestAnimationFrame(animateCarousel);
      webglRenderer.render(webglScene, camera);
      cssRenderer.render(cssScene, camera);
    }
    animateCarousel();
    cleanups.push(() => cancelAnimationFrame(carouselRaf));
    cleanups.push(() => webglRenderer.dispose());

    gsap.set("#stage", { opacity: 0.001 });
    const stageTrigger = ScrollTrigger.create({
      trigger: "#stage",
      start: "top 95%",
      end: "top 25%",
      scrub: 1,
      onUpdate: (self: any) => {
        gsap.set("#warp-flash", {
          opacity: Math.max(0, 1 - self.progress) * (scrollProgress >= 0.98 ? 1 : 0),
        });
        gsap.set("#stage", { opacity: self.progress });
      },
    });
    cleanups.push(() => stageTrigger.kill());

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
      <div id="warp-flash" />
      <img id="logo-reveal" src="/assets/logo.png" alt="AI Tech Helper" />

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
              <a href="#">AI Hub</a>
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
            <span>AI Hub</span>
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
