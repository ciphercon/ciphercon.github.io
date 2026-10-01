"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Drift of the red tick on each line index: [base offset (0..1 of the
 * viewport), px moved per px scrolled]. Per line, so ticks never move in
 * lockstep.
 */
const DRIFT: Array<[number, number]> = [
  [0.24, 0.05],
  [0.7, 0.04],
  [0.52, -0.035],
  [0.4, 0.03],
  [0.25, -0.03],
  [0.31, 0.03],
  [0.6, -0.04],
  [0.15, 0.035],
];

type Tick = { el: HTMLElement; base: number; k: number; last: string };

/** All live ticks share one ticker. */
const ticks = new Set<Tick>();
let ticking = false;

function updateTicks() {
  const y = window.scrollY;
  const span = Math.max(1, window.innerHeight - 120);
  for (const t of ticks) {
    let pos = (t.base * span + y * t.k) % span;
    if (pos < 0) pos += span;
    const next = `translate3d(0, ${Math.round(pos + 60)}px, 0)`;
    if (next !== t.last) {
      t.el.style.transform = next;
      t.last = next;
    }
  }
}

type Props = {
  tone: "dark" | "lime";
  /** Columns spanned: lines sit on every boundary 0..cols. */
  cols?: number;
  /** Draw only the outer two lines. */
  edgesOnly?: boolean;
  /** Line indices that carry a drifting red tick. */
  tickLines?: number[];
  className?: string;
};

/**
 * Vertical grid lines on the page's column edges, drawn inside the section
 * that owns them (absolute, behind its content). Owning them per section
 * means they take that surface's colour, show through the pixel wipes
 * correctly, and travel with content that moves sideways.
 *
 * On small screens the page grid has two columns, so only lines 0–2 fit.
 */
export default function GridLines({
  tone,
  cols = 5,
  edgesOnly = false,
  tickLines = [],
  className,
}: Props) {
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tickKey = tickLines.join(",");

  useEffect(() => {
    const lines = tickKey ? tickKey.split(",").map(Number) : [];
    const mine: Tick[] = [];
    lines.forEach((line, k) => {
      const el = tickRefs.current[k];
      if (!el) return;
      const [base, drift] = DRIFT[line % DRIFT.length];
      mine.push({ el, base, k: drift, last: "" });
    });
    mine.forEach((t) => ticks.add(t));
    if (!ticking && ticks.size) {
      gsap.ticker.add(updateTicks);
      ticking = true;
    }
    updateTicks();
    return () => {
      mine.forEach((t) => ticks.delete(t));
      if (ticking && !ticks.size) {
        gsap.ticker.remove(updateTicks);
        ticking = false;
      }
    };
  }, [tickKey]);

  const left = (i: number) => `calc(var(--edge) + ${i} * var(--col-w))`;
  const color = tone === "dark" ? "bg-[var(--line-dark)]" : "bg-[var(--line-lime)]";

  // Which lines exist, and at which breakpoints.
  const lines: Array<{ i: number; cls?: string }> = edgesOnly
    ? [
        { i: 0 },
        { i: cols, cls: "max-lg:hidden" },
        { i: 2, cls: "lg:hidden" }, // small-screen right edge
      ]
    : Array.from({ length: cols + 1 }, (_, i) => ({
        i,
        cls: i > 2 ? "max-lg:hidden" : undefined,
      }));

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {lines.map(({ i, cls }) => (
        <span
          key={`l${i}-${cls ?? ""}`}
          className={cn("absolute inset-y-0 w-px", color, cls)}
          style={{ left: left(i) }}
        />
      ))}
      {tickLines.map((line, k) => (
        <span
          key={`t${line}`}
          ref={(el) => {
            tickRefs.current[k] = el;
          }}
          className={cn("absolute top-0 h-[9px] w-[3px] -translate-x-px bg-red", line > 2 && "max-lg:hidden")}
          style={{ left: left(line) }}
        />
      ))}
    </div>
  );
}
