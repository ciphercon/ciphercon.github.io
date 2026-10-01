"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * WebGL "LCD" renderer used for the hero portrait and the Worked At logos.
 *
 * - photo mode: the image's luminance is tinted by slow diagonal bands of
 *   green / violet / pink, then pushed through an RGB sub-pixel mask so it
 *   reads like a photo on an old display.
 * - logo mode: the logo keeps its hue (brightened so dark marks glow on
 *   black) and goes through the same sub-pixel mask.
 *
 * Both get random glitch bursts: RGB split, displaced rows, block
 * pixelation and a green flash.
 */

export type GlitchSource =
  | { kind: "image"; src: string }
  | { kind: "logo"; src: string | null; text: string };

export type GlitchCanvasRef = { glitch: (ms?: number) => void };

type Props = {
  source: GlitchSource;
  mode?: "photo" | "logo";
  /** Image height as a fraction of the canvas height (photo mode). */
  heightFrac?: number;
  /** Where the image sits in the free space, 0..1 per axis. */
  align?: [number, number];
  className?: string;
  /** Pause rendering when false (e.g. scene hidden). */
  active?: boolean;
  /** Random glitch interval, seconds. */
  every?: [number, number];
};

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec4 uRect;
uniform float uTime;
uniform float uGlitch;
uniform float uSeed;
uniform float uDpr;
uniform float uMode;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

vec3 bands(float t) {
  t = fract(t);
  vec3 g = vec3(0.32, 0.95, 0.46);
  vec3 b = vec3(0.46, 0.42, 1.00);
  vec3 p = vec3(1.00, 0.44, 0.64);
  float s = t * 3.0;
  if (s < 1.0) return mix(g, b, smoothstep(0.0, 1.0, s));
  if (s < 2.0) return mix(b, p, smoothstep(0.0, 1.0, s - 1.0));
  return mix(p, g, smoothstep(0.0, 1.0, s - 2.0));
}

vec4 img(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
  return texture2D(uTex, uv);
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 uv = (frag - uRect.xy) / uRect.zw;
  float g = uGlitch;
  float step18 = floor(uTime * 18.0);

  // Displaced rows + occasional block pixelation while glitching.
  float row = floor(uv.y * 26.0);
  float hit = step(0.62, hash(row * 1.7 + step18 * 3.1 + uSeed));
  float shift = (hash(row * 13.1 + step18 * 7.7 + uSeed) - 0.5) * 0.09 * g * hit;
  vec2 guv = uv + vec2(shift, 0.0);
  float px = 0.011 * g * step(0.72, hash(step18 + 1.7 + uSeed));
  if (px > 0.0) guv = (floor(guv / px) + 0.5) * px;

  float split = 0.0035 + 0.03 * g;
  vec4 r = img(guv + vec2(split, 0.0));
  vec4 c = img(guv);
  vec4 b = img(guv - vec2(split, 0.0));

  vec3 col;
  if (uMode < 0.5) {
    // Deeper curve: mids sink, highlights (face) keep their glow.
    float lr = pow(r.r, 1.55) * r.a;
    float lg = pow(c.r, 1.55) * c.a;
    float lb = pow(b.r, 1.55) * b.a;
    vec2 css = frag / uDpr;
    float d = (css.x * 0.6 + css.y * 0.8) / 46.0
            + 0.55 * sin(css.y / 210.0 + uTime * 0.3)
            - uTime * 0.05;
    vec3 band = bands(d);
    band = mix(band, vec3(0.3, 1.0, 0.38), 0.65 * g * step(0.45, hash(step18 + 9.1 + uSeed)));
    col = vec3(lr * band.r, lg * band.g, lb * band.b);
    col = pow(col, vec3(0.92)) * 2.25;
    // Sink the lower body into the dark so the name reads on top.
    col *= mix(0.12, 1.0, smoothstep(0.74, 0.34, uv.y));
  } else {
    float m = max(c.r, max(c.g, c.b));
    vec3 hue = m > 0.02 ? c.rgb / m : vec3(1.0);
    vec3 tint = mix(vec3(0.9), hue, 0.8);
    col = vec3(r.a * tint.r, c.a * tint.g, b.a * tint.b) * 1.15;
    col = mix(col, col * vec3(0.4, 1.3, 0.6), 0.6 * g);
  }

  // RGB sub-pixel mask: vertical R/G/B stripes with a dark seam per cell.
  float sp = max(1.0, floor(uDpr * 0.85 + 0.5));
  float cx = mod(floor(gl_FragCoord.x / sp), 3.0);
  vec3 mask = cx < 0.5 ? vec3(1.0, 0.25, 0.25) : (cx < 1.5 ? vec3(0.25, 1.0, 0.25) : vec3(0.25, 0.25, 1.0));
  float ry = mod(gl_FragCoord.y, sp * 3.0);
  mask *= ry < sp * 0.9 ? 0.32 : 1.0;
  col *= mask * 1.6;

  float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  gl_FragColor = vec4(min(col, vec3(1.0)), a);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
  }
  return s;
}

/** Rasterise a logo (or a wordmark when there's no file) to a canvas. */
async function rasterLogo(src: string | null, text: string): Promise<HTMLCanvasElement> {
  const W = 1024;
  const H = 512;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;
  if (src) {
    const im = new Image();
    im.decoding = "async";
    im.src = src;
    await im.decode().catch(() => undefined);
    const iw = im.naturalWidth || 300;
    const ih = im.naturalHeight || 100;
    const s = Math.min((W * 0.86) / iw, (H * 0.7) / ih);
    ctx.drawImage(im, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s);
  } else {
    await document.fonts?.ready;
    const family = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-rajdhani")
      .trim();
    let size = 190;
    ctx.fillStyle = "#e8f0ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = text.toUpperCase();
    do {
      ctx.font = `700 ${size}px ${family || "sans-serif"}`;
      size -= 6;
    } while (ctx.measureText(label).width > W * 0.88 && size > 40);
    ctx.fillText(label, W / 2, H / 2 + size * 0.06);
  }
  return cv;
}

async function loadSource(source: GlitchSource): Promise<TexImageSource> {
  if (source.kind === "image") {
    const im = new Image();
    im.decoding = "async";
    im.src = source.src;
    await im.decode();
    return im;
  }
  return rasterLogo(source.src, source.text);
}

const GlitchCanvas = forwardRef<GlitchCanvasRef, Props>(function GlitchCanvas(
  {
    source,
    mode = "photo",
    heightFrac = 1,
    align = [0.5, 1],
    className,
    active = true,
    every = [2.8, 6.5],
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    glitchUntil: 0,
    glitchStart: 0,
    nextAuto: 0,
    visible: true,
    active,
    texSize: [1, 1] as [number, number],
    requestFrame: () => {},
  });
  useImperativeHandle(ref, () => ({
    glitch: (ms = 260) => {
      const s = stateRef.current;
      const t = performance.now();
      s.glitchStart = t;
      s.glitchUntil = t + ms;
      s.requestFrame();
    },
  }));

  // Track `active`, and wake the loop when it flips back on.
  useEffect(() => {
    stateRef.current.active = active;
    if (active) stateRef.current.requestFrame();
  }, [active]);

  const sourceKey = JSON.stringify(source);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;

    const reduce = prefersReducedMotion();
    let disposed = false;
    let raf = 0;
    const st = stateRef.current;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes");
    const uRect = u("uRect");
    const uTime = u("uTime");
    const uGlitch = u("uGlitch");
    const uSeed = u("uSeed");
    const uDpr = u("uDpr");
    const uMode = u("uMode");

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

    let ready = false;
    const seed = Math.random() * 100;
    const t0 = performance.now();
    // Rendered at 1x and upscaled pixelated: the LCD mask is one CSS pixel
    // per stripe either way, so it looks the same at a quarter of the cost.
    const dpr = 1;
    // ~30fps is plenty for the slow band drift and the glitch bursts.
    const FRAME_MS = 31;
    let lastDraw = -Infinity;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(performance.now());
    };

    const rect = () => {
      const W = canvas.width;
      const H = canvas.height;
      const [tw, th] = st.texSize;
      let w: number;
      let h: number;
      if (mode === "photo") {
        h = H * heightFrac;
        w = (tw / th) * h;
      } else {
        const s = Math.min(W / tw, H / th);
        w = tw * s;
        h = th * s;
      }
      return [(W - w) * align[0], (H - h) * align[1], w, h];
    };

    function glitchAmount(t: number) {
      if (t < st.glitchUntil) {
        // Two quick sub-flickers inside a burst.
        const k = (t - st.glitchStart) / Math.max(1, st.glitchUntil - st.glitchStart);
        return k < 0.35 || k > 0.6 ? 1 : 0.25;
      }
      return 0;
    }

    function draw(t: number) {
      if (!ready) return;
      const [x, y, w, h] = rect();
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform4f(uRect, x, y, w, h);
      gl!.uniform1f(uTime, reduce ? 0 : (t - t0) / 1000);
      gl!.uniform1f(uGlitch, reduce ? 0 : glitchAmount(t));
      gl!.uniform1f(uSeed, seed);
      gl!.uniform1f(uDpr, dpr);
      gl!.uniform1f(uMode, mode === "photo" ? 0 : 1);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    const loop = (t: number) => {
      raf = 0;
      if (disposed) return;
      if (!reduce && t > st.nextAuto) {
        const [a, b] = every;
        if (st.nextAuto !== 0) {
          st.glitchStart = t;
          st.glitchUntil = t + 120 + Math.random() * 180;
        }
        st.nextAuto = t + (a + Math.random() * (b - a)) * 1000;
      }
      if (t - lastDraw >= FRAME_MS) {
        draw(t);
        lastDraw = t;
      }
      if (!reduce && st.visible && st.active) raf = requestAnimationFrame(loop);
    };

    st.requestFrame = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(loop);
    };

    loadSource(JSON.parse(sourceKey) as GlitchSource)
      .then((im) => {
        if (disposed) return;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        const w = "naturalWidth" in im ? im.naturalWidth : (im as HTMLCanvasElement).width;
        const h = "naturalHeight" in im ? im.naturalHeight : (im as HTMLCanvasElement).height;
        st.texSize = [w, h];
        ready = true;
        resize();
        st.requestFrame();
      })
      .catch(() => undefined);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      st.visible = e.isIntersecting;
      if (st.visible) st.requestFrame();
    });
    io.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, mode, heightFrac, align[0], align[1]]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    />
  );
});

export default GlitchCanvas;
