"use client";

import { useEffect, useRef } from "react";
import { pointer } from "@/components/chrome/Cursor";
import { mulberry32 } from "@/lib/pixels";

const PITCH = 26;
const RADIUS = 240;
const PALETTE = ["#5b3cff", "#7a3cff", "#3c4bff", "#8b2bd9", "#b03c8c", "#4a5cff"];

/**
 * A fixed lattice of tiny violet squares that only shows up around the
 * cursor ring — a "flashlight" over the dark scenes. Fills its parent.
 */
export default function DotHalo({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !window.matchMedia("(pointer: fine)").matches) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let visible = false;
    let w = 0;
    let h = 0;
    let colors: string[] = [];
    let cols = 0;
    let lastX = NaN;
    let lastY = NaN;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / PITCH) + 1;
      const rows = Math.ceil(h / PITCH) + 1;
      const rand = mulberry32(3);
      colors = Array.from({ length: cols * rows }, () => PALETTE[(rand() * PALETTE.length) | 0]);
      lastX = NaN;
    };

    const frame = () => {
      raf = 0;
      if (!visible) return;
      const r = canvas.getBoundingClientRect();
      const px = pointer.rx - r.left;
      const py = pointer.ry - r.top;
      if (Math.abs(px - lastX) > 0.4 || Math.abs(py - lastY) > 0.4 || !pointer.inside) {
        lastX = px;
        lastY = py;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        if (pointer.inside) {
          const c0 = Math.max(0, Math.floor((px - RADIUS) / PITCH));
          const c1 = Math.min(cols - 1, Math.ceil((px + RADIUS) / PITCH));
          const r0 = Math.max(0, Math.floor((py - RADIUS) / PITCH));
          const r1 = Math.ceil((py + RADIUS) / PITCH);
          for (let rr = r0; rr <= r1; rr++) {
            for (let cc = c0; cc <= c1; cc++) {
              const x = cc * PITCH + PITCH / 2;
              const y = rr * PITCH + PITCH / 2;
              const d = Math.hypot(x - px, y - py);
              if (d > RADIUS) continue;
              const a = Math.pow(1 - d / RADIUS, 1.6) * 0.95;
              ctx.globalAlpha = a;
              ctx.fillStyle = colors[rr * cols + cc] ?? PALETTE[0];
              ctx.fillRect(x - 1.4, y - 1.4, 2.8, 2.8);
            }
          }
          ctx.globalAlpha = 1;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
