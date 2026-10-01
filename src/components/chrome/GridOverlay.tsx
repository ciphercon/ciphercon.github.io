"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scrollVelocity } from "@/components/SmoothScroll";

const LINES = [0, 1, 2, 3, 4, 5];

/**
 * Fixed page furniture:
 *  - the six vertical grid lines, coloured per surface theme (a blend
 *    mode would cost a full-screen compositing pass every frame),
 *  - small red markers drifting along some lines as you scroll,
 *  - the bottom-centre pill, which stretches with scroll speed.
 */
export default function GridOverlay() {
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // [line index, base offset (0..1 of viewport), speed vs scroll]
    const ticks: Array<[number, number, number]> = [
      [0, 0.24, 0.05],
      [2, 0.52, -0.035],
      [5, 0.31, 0.03],
    ];
    let w = 40;
    let shownW = 40;
    const lastPos: string[] = [];
    const update = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      ticks.forEach(([, base, k], i) => {
        const el = tickRefs.current[i];
        if (!el) return;
        const span = vh - 120;
        let pos = (base * vh + y * k) % span;
        if (pos < 0) pos += span;
        const next = `translate3d(0, ${Math.round(pos + 60)}px, 0)`;
        if (next !== lastPos[i]) {
          el.style.transform = next;
          lastPos[i] = next;
        }
      });
      const target = 40 + Math.min(70, Math.abs(scrollVelocity()) * 3.5);
      w += (target - w) * 0.15;
      const rounded = Math.round(w);
      if (rounded !== shownW && pillRef.current) {
        pillRef.current.style.width = `${rounded}px`;
        shownW = rounded;
      }
    };
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  const lineLeft = (i: number) => `calc(var(--edge) + ${i} * var(--col-w))`;

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
        {LINES.map((i) => (
          <span
            key={i}
            className={`absolute inset-y-0 w-px bg-[var(--grid-line)] transition-colors duration-300 ${i > 2 ? "max-lg:hidden" : ""}`}
            style={{ left: lineLeft(i) }}
          />
        ))}
      </div>

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[41]">
        {[0, 2, 5].map((line, i) => (
          <span
            key={line}
            ref={(el) => {
              tickRefs.current[i] = el;
            }}
            className={`absolute top-0 h-[9px] w-[3px] -translate-x-px bg-red ${line > 2 ? "max-lg:hidden" : ""}`}
            style={{ left: lineLeft(line) }}
          />
        ))}
      </div>

      <span
        ref={pillRef}
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[4.25rem] left-1/2 z-[41] h-[7px] w-10 -translate-x-1/2 rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] transition-colors max-lg:bottom-6"
      />
    </>
  );
}
