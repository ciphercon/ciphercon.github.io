"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { buildCells, sweepFromBottom, type Cell } from "@/lib/pixels";
import { cn } from "@/lib/cn";

/**
 * A ragged band of blocks at the top of a section, filling in as it scrolls
 * through the viewport — a lightweight stand-in for the pinned pixel wipes
 * between normal-flow sections. Place it at the top of the incoming
 * section; `color` is that section's surface colour.
 */
export default function PixelEdge({
  color,
  rows = 3,
  className,
}: {
  color: string;
  rows?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cells: Cell[] = [];
    let w = 0;
    let h = 0;
    let p = 0;

    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const c of cells) if (p >= c.t) ctx.fillRect(c.x, c.y, c.w + 0.5, c.h + 0.5);
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cells = buildCells(w, h, h / rows, sweepFromBottom(0.55), Math.round(w));
      paint();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const st = ScrollTrigger.create({
      trigger: canvas,
      start: "top bottom",
      end: "bottom 35%",
      onUpdate: (self) => {
        p = self.progress;
        paint();
      },
    });
    return () => {
      ro.disconnect();
      st.kill();
    };
  }, [color, rows]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 bottom-full h-[clamp(5rem,14vh,9rem)] w-full", className)}
    />
  );
}
