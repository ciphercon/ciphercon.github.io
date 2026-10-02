"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scrollVelocity } from "@/components/SmoothScroll";

/**
 * Fixed bottom-centre pill that stretches with scroll speed. (The vertical
 * grid lines live in each section, see GridLines.)
 */
export default function ScrollPill() {
  const pillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let w = 40;
    let shownW = 40;
    const update = () => {
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

  return (
    <span
      ref={pillRef}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-[4.25rem] left-1/2 z-[41] h-[7px] w-10 -translate-x-1/2 rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] transition-colors max-lg:bottom-6"
    />
  );
}
