"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { buildCells, sweepFromLeft, type Cell } from "@/lib/pixels";

type Props = {
  /** Colour the image hides behind (the surface colour). */
  cover?: string;
  /** Frontier colour. */
  edge?: string;
  /** Approximate number of block columns. */
  cols?: number;
  className?: string;
};

/**
 * Covers its parent with blocks of the surface colour, then sweeps them
 * away left → right behind a ragged purple frontier, with a band of
 * tinted blocks trailing it. Replays each time it re-enters the viewport.
 */
export default function PixelReveal({
  cover = "#9df133",
  edge = "#7a12ff",
  cols = 9,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    // Big flat blocks: 1x upscaled pixelated looks identical and is 4x lighter.
    const dpr = 1;
    let cells: Cell[] = [];
    let w = 0;
    let h = 0;
    const state = { p: 0 };
    let tween: gsap.core.Tween | null = null;
    let revealed = false;

    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // Map p∈[0,1] so the trailing bands fully clear by the end.
      const p = state.p * 1.32 - 0.12;
      for (const c of cells) {
        const d = p - c.t;
        if (d >= 0.07) continue;
        if (d < -0.2) ctx.fillStyle = cover;
        else if (d < -0.06) ctx.fillStyle = c.r < 0.22 ? cover : edge;
        else ctx.fillStyle = c.r < 0.5 ? "rgba(157,241,51,0.45)" : "rgba(122,18,255,0.3)";
        ctx.fillRect(c.x, c.y, c.w + 0.5, c.h + 0.5);
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      if (w < 2 || h < 2) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cells = buildCells(w, h, w / cols, sweepFromLeft(0.38), Math.round(w * 13 + h));
      paint();
    };

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      tween?.kill();
      // Once fully revealed the canvas is blank: hide it so the browser
      // stops compositing it.
      const done = () => {
        canvas.style.visibility = "hidden";
      };
      if (prefersReducedMotion()) {
        state.p = 1;
        paint();
        done();
        return;
      }
      tween = gsap.to(state, { p: 1, duration: 1.05, ease: "power1.inOut", onUpdate: paint, onComplete: done });
    };

    const reset = () => {
      revealed = false;
      tween?.kill();
      state.p = 0;
      canvas.style.visibility = "visible";
      paint();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.25) reveal();
        else if (!e.isIntersecting) reset();
      },
      { threshold: [0, 0.25, 0.5] }
    );
    io.observe(canvas);

    return () => {
      tween?.kill();
      ro.disconnect();
      io.disconnect();
    };
  }, [cover, edge, cols]);

  return (
    <canvas ref={ref} aria-hidden="true" className={className} style={{ imageRendering: "pixelated" }} />
  );
}
