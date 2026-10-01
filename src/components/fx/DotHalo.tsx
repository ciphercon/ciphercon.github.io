"use client";

import { useEffect, useRef } from "react";
import { pointer } from "@/components/chrome/Cursor";
import { cn } from "@/lib/cn";

const PITCH = 26;
const RADIUS = 240;
/** Edge of the small canvas that travels with the cursor, CSS px. */
const SIZE = RADIUS * 2 + PITCH * 2;
const PALETTE = ["#5b3cff", "#7a3cff", "#3c4bff", "#8b2bd9", "#b03c8c", "#4a5cff"];

/** Stable per-cell colour, so dots don't flicker as the canvas moves. */
function colorAt(c: number, r: number) {
  let h = Math.imul(c, 374761393) ^ Math.imul(r, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return PALETTE[((h ^ (h >>> 16)) >>> 0) % PALETTE.length];
}

/**
 * A lattice of tiny violet squares that only shows up around the cursor
 * ring: a "flashlight" over the dark scenes. Fills its parent.
 *
 * Only a small canvas around the ring is drawn (not the whole section),
 * at 1x and upscaled pixelated, and only while the ring or the page is
 * moving. The lattice stays anchored to the parent, so dots don't slide.
 */
export default function DotHalo({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !window.matchMedia("(pointer: fine)").matches) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = SIZE;
    canvas.height = SIZE;
    let raf = 0;
    let visible = false;
    let idleFrames = 0;
    let lastKey = "";

    const draw = (left: number, top: number, px: number, py: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const c0 = Math.floor(left / PITCH);
      const c1 = Math.ceil((left + SIZE) / PITCH);
      const r0 = Math.floor(top / PITCH);
      const r1 = Math.ceil((top + SIZE) / PITCH);
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const x = c * PITCH + PITCH / 2;
          const y = r * PITCH + PITCH / 2;
          const d = Math.hypot(x - px, y - py);
          if (d > RADIUS) continue;
          ctx.globalAlpha = Math.pow(1 - d / RADIUS, 1.6) * 0.95;
          ctx.fillStyle = colorAt(c, r);
          ctx.fillRect(Math.round(x - left) - 1, Math.round(y - top) - 1, 3, 3);
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      raf = 0;
      if (!visible) return;
      const rect = wrap.getBoundingClientRect();
      const px = pointer.rx - rect.left;
      const py = pointer.ry - rect.top;
      const inside =
        pointer.inside &&
        px > -RADIUS &&
        py > -RADIUS &&
        px < rect.width + RADIUS &&
        py < rect.height + RADIUS;
      const left = Math.round(px - SIZE / 2);
      const top = Math.round(py - SIZE / 2);
      const key = inside ? `${left},${top},${Math.round(px * 2)},${Math.round(py * 2)}` : "out";
      if (key !== lastKey) {
        lastKey = key;
        idleFrames = 0;
        if (inside) {
          canvas.style.transform = `translate3d(${left}px, ${top}px, 0)`;
          canvas.style.visibility = "visible";
          draw(left, top, px, py);
        } else {
          canvas.style.visibility = "hidden";
        }
      } else {
        idleFrames++;
      }
      // Keep going while the ring glides or the page scrolls; sleep when idle.
      if (idleFrames < 20) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      idleFrames = 0;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
      else canvas.style.visibility = "hidden";
    });
    io.observe(wrap);
    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    document.documentElement.addEventListener("pointerleave", wake);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("scroll", wake);
      document.documentElement.removeEventListener("pointerleave", wake);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className={cn("overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 [image-rendering:pixelated]"
        style={{ width: SIZE, height: SIZE, visibility: "hidden" }}
      />
    </div>
  );
}
