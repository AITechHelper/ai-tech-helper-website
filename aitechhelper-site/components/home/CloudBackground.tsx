"use client";

import { useEffect, useRef } from "react";

/* The hero backdrop: a slow, living mesh gradient — white, brand cyan and a
   deeper teal-blue drifting past each other like clouds — that fades into the
   page's black at the bottom. Pure WebGL: one full-screen triangle, all the
   motion in the fragment shader, so the CPU never loops and it stays light on
   phones. Replaces the old particle orb. */
export default function CloudBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!ctx) return; // CSS fallback background stays visible
    const gl: WebGLRenderingContext = ctx;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;

    const frag = `
      precision highp float;
      uniform vec2  u_res;
      uniform float u_time;

      // inverse-distance weight (how a mesh-gradient tool interpolates its points)
      float idw(vec2 uv, vec2 p){
        float d = distance(uv, p);
        return 1.0 / (pow(d, 3.5) + 0.0009);
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;   // 0..1, y up

        float t  = u_time;
        float mw = 0.045;                        // white drift (faster)
        float mc = 0.022;                        // cyan/deep drift (slower)

        vec3 cyan  = vec3(0.204,0.792,0.965);    // #34caf6 soft sky cyan
        vec3 white = vec3(0.027,0.251,0.353);    // #07405a deep navy-teal (was white)
        vec3 deep  = vec3(0.047,0.498,0.690);    // #0c7fb0 deeper teal-blue

        // white points (spread across corners + middle), faster motion
        vec2 W1 = vec2(0.88 + mw*sin(t*0.90),      0.90 + mw*sin(t*1.10+1.0));
        vec2 W2 = vec2(0.21 + mw*sin(t*1.05+2.0),  0.45 + mw*sin(t*0.95+2.0));
        vec2 W3 = vec2(0.88 + mw*sin(t*0.95+3.0),  0.31 + mw*sin(t*1.10+3.0));
        vec2 W4 = vec2(0.09 + mw*sin(t*1.10+4.0),  0.13 + mw*sin(t*0.90+4.0));
        vec2 W5 = vec2(0.21 + mw*sin(t*0.95+5.0),  0.21 + mw*sin(t*1.05+5.0));

        // cyan points tracing the S; last two go deep blue (lower-right)
        vec2 C1 = vec2(0.05 + mc*sin(t*0.55),      0.90 + mc*sin(t*0.65+1.0));
        vec2 C2 = vec2(0.10 + mc*sin(t*0.60+2.0),  0.76 + mc*sin(t*0.50+2.0));
        vec2 C3 = vec2(0.46 + mc*sin(t*0.50+3.0),  0.69 + mc*sin(t*0.60+3.0));
        vec2 C4 = vec2(0.67 + mc*sin(t*0.55+4.0),  0.31 + mc*sin(t*0.50+4.0));
        vec2 C5 = vec2(0.83 + mc*sin(t*0.60+5.0),  0.13 + mc*sin(t*0.55+5.0));

        // white points get reduced weight so blue reads more than white
        float ww = 0.62;
        vec3 num = vec3(0.0); float den = 0.0, w;
        w = idw(uv,W1)*ww; num += w*white; den += w;
        w = idw(uv,W2)*ww; num += w*white; den += w;
        w = idw(uv,W3)*ww; num += w*white; den += w;
        w = idw(uv,W4)*ww; num += w*white; den += w;
        w = idw(uv,W5)*ww; num += w*white; den += w;
        w = idw(uv,C1);    num += w*cyan;  den += w;
        w = idw(uv,C2);    num += w*cyan;  den += w;
        w = idw(uv,C3);    num += w*cyan;  den += w;
        w = idw(uv,C4);    num += w*deep;  den += w;
        w = idw(uv,C5);    num += w*deep;  den += w;

        vec3 col = num / max(den, 0.0001);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap!.clientWidth || window.innerWidth;
      const h = wrap!.clientHeight || window.innerHeight;
      canvas!.width = Math.max(1, Math.round(w * dpr));
      canvas!.height = Math.max(1, Math.round(h * dpr));
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    let raf = 0;
    const start = performance.now();
    function draw() {
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, (performance.now() - start) / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div className="home-cloud" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="home-cloud-fade" />
    </div>
  );
}
