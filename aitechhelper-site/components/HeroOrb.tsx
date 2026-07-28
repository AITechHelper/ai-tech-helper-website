"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

/* The hero's calm spinning particle orb — used purely as a background on both
   desktop and mobile. It's the resting orb from the old scroll experience,
   stripped of the intro burst, the scroll-scrubbed dive, the cursor repulsion
   and the CSS3D carousel that made the page heavy and glitchy. All it does is
   sit there, glow, and slowly rotate. Every bit of motion is in the vertex
   shader, so the CPU never loops the points and it stays light. */
export default function HeroOrb() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const cleanups: Array<() => void> = [];
    const isMobile = window.innerWidth <= 700;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const isTouch = coarse || isMobile;
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const COUNT = isMobile ? 5000 : 10000;
    const ORB_R = isMobile ? 1.45 : 2.0;
    const orbSizeFor = (w: number) => (w <= 700 ? 1.05 : Math.min(w / 1250, 1.3));

    const renderer = new THREE.WebGLRenderer({
      // No MSAA: the scene is drawn into the composer's own render target, so
      // antialias here costs fill-rate for no visible benefit.
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    // The bloom pass is fill-rate bound, so cap the device pixel ratio — the
    // single biggest lever on how heavy the orb is to draw.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
    renderer.setClearColor(0x000000, 1);
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 100);
    camera.position.set(0, 0, 5.8);

    let composer: EffectComposer | null = null;
    let bloom: UnrealBloomPass | null = null;

    // Even shell via the Fibonacci sphere — cyan points with a little
    // per-particle lightness variation so the orb keeps depth, not a flat disc.
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const rnd = new Float32Array(COUNT);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const rr = Math.sqrt(1 - y * y);
      const th = golden * i;
      const jitter = 1 + (Math.random() - 0.5) * 0.025;
      pos[i * 3] = Math.cos(th) * rr * ORB_R * jitter;
      pos[i * 3 + 1] = y * ORB_R * jitter;
      pos[i * 3 + 2] = Math.sin(th) * rr * ORB_R * jitter;
      const shade = 0.8 + Math.random() * 0.2;
      col[i * 3] = 0.03 * shade;
      col[i * 3 + 1] = 0.72 * shade;
      col[i * 3 + 2] = 1.0 * shade;
      rnd[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: orbSizeFor(window.innerWidth) },
      uPixelRatio: { value: renderer.getPixelRatio() },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        uniform float uPixelRatio;
        attribute vec3 aColor;
        attribute float aRand;
        varying vec3 vColor;
        void main() {
          vColor = aColor;
          // spin about Y (manual rotation — avoids swizzle assignment)
          vec3 sph = position;
          float ang = uTime * 0.16;
          float ca = cos(ang);
          float sa = sin(ang);
          sph = vec3(sph.x * ca - sph.z * sa, sph.y, sph.x * sa + sph.z * ca);
          // gentle breathe along the surface normal
          vec3 nrm = normalize(sph + vec3(0.0001));
          sph += nrm * sin(uTime * 0.6 + aRand * 6.2831) * 0.035;
          vec4 mv = modelViewMatrix * vec4(sph, 1.0);
          gl_Position = projectionMatrix * mv;
          float s = uSize * (0.5 + aRand * 0.8);
          gl_PointSize = s * uPixelRatio * (9.0 / -mv.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float edge = smoothstep(0.5, 0.05, d);
          float core = smoothstep(0.35, 0.0, d);
          gl_FragColor = vec4(vColor + vec3(core * 0.3), edge * 0.9);
        }
      `,
    });

    const orb = new THREE.Points(geo, mat);
    orb.frustumCulled = false;
    scene.add(orb);
    cleanups.push(() => {
      geo.dispose();
      mat.dispose();
    });

    // A quiet starfield behind the orb for depth. Static — drifts only by a
    // slow object rotation, so it costs nothing per frame.
    const STAR_COUNT = 260;
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

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.6, 0.18);
    composer.addPass(bloom);
    cleanups.push(() => bloom?.dispose());

    let lastW = -1;
    function size() {
      const w = wrap!.clientWidth || window.innerWidth;
      const h = wrap!.clientHeight || window.innerHeight;
      // On touch, ignore height-only changes (the URL bar sliding in/out on
      // scroll) — resizing for them just makes the orb jump.
      if (isTouch && w === lastW) return;
      lastW = w;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      composer?.setSize(w, h);
      // Bloom is a blur, so run it at half resolution — a quarter of the pixels
      // for a near-identical glow. Must come after composer.setSize, which
      // otherwise resets every pass (including bloom) back to full size.
      bloom?.setSize(Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(h / 2)));
      uniforms.uSize.value = orbSizeFor(w);
      uniforms.uPixelRatio.value = renderer.getPixelRatio();
    }
    size();
    window.addEventListener("resize", size);
    cleanups.push(() => window.removeEventListener("resize", size));

    // Pause when the hero scrolls out of view — no reason to spin an orb the
    // visitor can't see while they read the rest of the page.
    let onScreen = true;
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
            threshold: 0,
          })
        : null;
    io?.observe(wrap);
    cleanups.push(() => io?.disconnect());

    const clock = new THREE.Clock();
    let raf = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      if (!onScreen) return;
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      orb.position.y = Math.sin(t * ((Math.PI * 2) / 7)) * 0.1;
      stars.rotation.y = t * 0.01;
      composer!.render();
    }
    if (reduceMotion) {
      // Respect reduced motion: render one still frame of the formed orb.
      uniforms.uTime.value = 0;
      composer!.render();
    } else {
      frame();
    }
    cleanups.push(() => cancelAnimationFrame(raf));
    cleanups.push(() => renderer.dispose());

    return () => {
      cleanups.forEach((fn) => fn());
      wrap.innerHTML = "";
    };
  }, []);

  return <div ref={wrapRef} className="home-orb" aria-hidden="true" />;
}
