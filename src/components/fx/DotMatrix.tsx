"use client";

import { useEffect, useRef } from "react";
import type { IconSource } from "@/data/stats";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Renders an icon, glyph or text as a grid of dots (halftone / LED look).
 * The source is rasterised at grid resolution, each cell's coverage decides
 * whether a dot is drawn and how strong it is.
 */

type Props = {
  source: IconSource | { kind: "string"; text: string; weight?: number };
  /** Distance between dot centres, CSS px. */
  pitch?: number;
  /** Dot size relative to the pitch. */
  dot?: number;
  shape?: "circle" | "square";
  color: string;
  /** Faint colour for partially covered cells (anti-aliased edge look). */
  edgeColor?: string;
  /** RGB-split squares with occasional flicker (logo style). */
  chroma?: boolean;
  /** How the source fills the canvas. */
  fit?: "contain" | "stretch";
  align?: "start" | "center";
  className?: string;
  /** Cursor-reactive highlight colour (dots near the pointer). */
  hoverColor?: string;
};

function fontFamily() {
  return (
    getComputedStyle(document.documentElement).getPropertyValue("--font-rajdhani").trim() ||
    "sans-serif"
  );
}

/** Draws a glyph source into ctx within (0,0,w,h), white on transparent. */
function drawGlyph(ctx: CanvasRenderingContext2D, name: string, w: number, h: number) {
  const s = Math.min(w, h);
  const ox = (w - s) / 2;
  const oy = (h - s) / 2;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  if (name === "windows") {
    const g = s * 0.08;
    const q = (s - g) / 2;
    ctx.fillRect(0, 0, q, q);
    ctx.fillRect(q + g, 0, q, q);
    ctx.fillRect(0, q + g, q, q);
    ctx.fillRect(q + g, q + g, q, q);
  } else if (name === "chevron") {
    ctx.lineWidth = s * 0.2;
    ctx.lineJoin = "miter";
    ctx.beginPath();
    ctx.moveTo(s * 0.22, s * 0.12);
    ctx.lineTo(s * 0.78, s * 0.5);
    ctx.lineTo(s * 0.22, s * 0.88);
    ctx.stroke();
  } else if (name === "mark") {
    ctx.lineWidth = s * 0.085;
    ctx.lineJoin = "miter";
    ctx.beginPath();
    ctx.moveTo(s * 0.5, s * 0.05);
    ctx.lineTo(s * 0.88, s * 0.2);
    ctx.lineTo(s * 0.88, s * 0.52);
    ctx.lineTo(s * 0.5, s * 0.95);
    ctx.lineTo(s * 0.12, s * 0.52);
    ctx.lineTo(s * 0.12, s * 0.2);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.3, s * 0.66);
    ctx.lineTo(s * 0.5, s * 0.28);
    ctx.lineTo(s * 0.7, s * 0.66);
    ctx.stroke();
  }
  ctx.restore();
}

async function rasterSource(
  source: Props["source"],
  w: number,
  h: number,
  fit: Props["fit"],
  align: Props["align"]
): Promise<HTMLCanvasElement> {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  if (source.kind === "image") {
    const im = new Image();
    im.src = source.src;
    await im.decode().catch(() => undefined);
    const iw = im.naturalWidth || 1;
    const ih = im.naturalHeight || 1;
    const s = Math.min(w / iw, h / ih);
    const x = align === "start" ? 0 : (w - iw * s) / 2;
    ctx.drawImage(im, x, (h - ih * s) / 2, iw * s, ih * s);
  } else if (source.kind === "glyph") {
    drawGlyph(ctx, source.name, w, h);
  } else if (source.kind === "text") {
    // Rounded tile with the letters knocked out (app-icon style).
    const s = Math.min(w, h);
    const x = align === "start" ? 0 : (w - s) / 2;
    const y = (h - s) / 2;
    const r = s * 0.18;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(x, y, s, s, r);
    ctx.fill();
    await document.fonts?.ready;
    ctx.globalCompositeOperation = "destination-out";
    ctx.font = `700 ${s * 0.42}px ${fontFamily()}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(source.text, x + s / 2, y + s * 0.54);
    ctx.globalCompositeOperation = "source-over";
  } else {
    await document.fonts?.ready;
    const weight = source.weight ?? 600;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "alphabetic";
    ctx.font = `${weight} 100px ${fontFamily()}`;
    const m = ctx.measureText(source.text);
    const left = m.actualBoundingBoxLeft || 0;
    const right = m.actualBoundingBoxRight || m.width;
    const asc = m.actualBoundingBoxAscent || 70;
    const desc = m.actualBoundingBoxDescent || 0;
    const tw = left + right;
    const th = asc + desc;
    ctx.save();
    if (fit === "stretch") {
      // Fill the box exactly; tall boxes give the condensed LED look.
      ctx.scale(w / tw, h / th);
    } else {
      const s = Math.min(w / tw, h / th);
      ctx.translate(align === "start" ? 0 : (w - tw * s) / 2, (h - th * s) / 2);
      ctx.scale(s, s);
    }
    ctx.fillText(source.text, left, asc);
    ctx.restore();
  }
  return cv;
}

export default function DotMatrix({
  source,
  pitch = 6,
  dot = 0.62,
  shape = "circle",
  color,
  edgeColor,
  chroma = false,
  fit = "contain",
  align = "center",
  className,
  hoverColor,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef({ color, edgeColor, hoverColor });
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    colorsRef.current = { color, edgeColor, hoverColor };
    redrawRef.current();
  }, [color, edgeColor, hoverColor]);

  const key = JSON.stringify(source);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = prefersReducedMotion();
    let cover: Float32Array = new Float32Array(0);
    let cols = 0;
    let rows = 0;
    let cssW = 0;
    let cssH = 0;
    let disposed = false;
    let raf = 0;
    let visible = false;
    let pointer: { x: number; y: number } | null = null;
    let flicker: Set<number> = new Set();
    let lastFlicker = 0;

    const draw = () => {
      if (!cols) return;
      const { color: c, edgeColor: ec, hoverColor: hc } = colorsRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      const ox = (cssW - cols * pitch) / 2;
      const oy = (cssH - rows * pitch) / 2;
      const size = pitch * dot;
      for (let r = 0; r < rows; r++) {
        for (let q = 0; q < cols; q++) {
          const i = r * cols + q;
          const v = cover[i];
          if (v < 0.18) continue;
          const cx = ox + q * pitch + pitch / 2;
          const cy = oy + r * pitch + pitch / 2;
          let fill = v > 0.55 ? c : (ec ?? c);
          if (hc && pointer) {
            const d = Math.hypot(pointer.x - cx, pointer.y - cy);
            if (d < 90) fill = hc;
          }
          if (chroma) {
            const big = flicker.has(i);
            const sz = big ? size * 1.35 : size;
            const h = sz / 2;
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = "#c8ff3d";
            ctx.fillRect(cx - h - 1.2, cy - h, sz, sz);
            ctx.fillStyle = "#ff4fd8";
            ctx.fillRect(cx - h + 1.2, cy - h + 0.6, sz, sz);
            ctx.globalAlpha = 1;
            ctx.fillStyle = big ? "#f5f0ff" : fill;
            ctx.fillRect(cx - h, cy - h, sz, sz);
            continue;
          }
          ctx.fillStyle = fill;
          ctx.globalAlpha = v > 0.55 ? 1 : 0.55;
          if (shape === "square") {
            ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
          } else {
            ctx.beginPath();
            ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      }
    };
    redrawRef.current = draw;

    const loop = (t: number) => {
      raf = 0;
      if (disposed || !visible) return;
      if (t - lastFlicker > 140) {
        lastFlicker = t;
        flicker = new Set();
        for (let k = 0; k < 3; k++) {
          const i = (Math.random() * cover.length) | 0;
          if (cover[i] > 0.5) flicker.add(i);
        }
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const build = async () => {
      const r = canvas.getBoundingClientRect();
      cssW = r.width;
      cssH = r.height;
      if (cssW < 2 || cssH < 2) return;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      cols = Math.max(1, Math.floor(cssW / pitch));
      rows = Math.max(1, Math.floor(cssH / pitch));
      const SS = 4;
      const src = await rasterSource(JSON.parse(key), cols * SS, rows * SS, fit, align);
      if (disposed) return;
      const data = src.getContext("2d")!.getImageData(0, 0, cols * SS, rows * SS).data;
      cover = new Float32Array(cols * rows);
      for (let rr = 0; rr < rows; rr++) {
        for (let qq = 0; qq < cols; qq++) {
          let sum = 0;
          for (let y = 0; y < SS; y++) {
            for (let x = 0; x < SS; x++) {
              sum += data[((rr * SS + y) * cols * SS + (qq * SS + x)) * 4 + 3];
            }
          }
          cover[rr * cols + qq] = sum / (SS * SS * 255);
        }
      }
      draw();
    };

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && chroma && !reduce && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      if (!colorsRef.current.hoverColor) return;
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      draw();
    };
    const onLeave = () => {
      pointer = null;
      draw();
    };
    if (hoverColor) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, pitch, dot, shape, chroma, fit, align]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
