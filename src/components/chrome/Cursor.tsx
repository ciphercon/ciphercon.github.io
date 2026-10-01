"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Shared pointer state: raw position and the lagging ring position. */
export const pointer = { x: -9999, y: -9999, rx: -9999, ry: -9999, inside: false };

const SIZE = 46;
const R = 22;
const CIRC = 2 * Math.PI * R;

/**
 * Lagging ring that follows the pointer, with an arc showing how far down
 * the page you are. Grows over interactive elements. Fine pointers only.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const arc = arcRef.current;
    if (!ring || !arc) return;
    const ease = prefersReducedMotion() ? 1 : 0.2;
    let scale = 1;
    let targetScale = 1;
    let shown = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!pointer.inside) {
        pointer.rx = e.clientX;
        pointer.ry = e.clientY;
      }
      pointer.inside = true;
      const t = e.target as Element | null;
      targetScale = t?.closest?.("a, button, [role='button'], [data-cursor='grow']") ? 1.45 : 1;
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    const tick = () => {
      pointer.rx += (pointer.x - pointer.rx) * ease;
      pointer.ry += (pointer.y - pointer.ry) * ease;
      scale += (targetScale - scale) * 0.18;
      shown += ((pointer.inside ? 1 : 0) - shown) * 0.15;
      ring.style.transform = `translate3d(${pointer.rx - SIZE / 2}px, ${pointer.ry - SIZE / 2}px, 0) scale(${scale.toFixed(3)})`;
      ring.style.opacity = shown.toFixed(3);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      arc.style.strokeDashoffset = String(CIRC * (1 - p));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[96] opacity-0"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90 overflow-visible">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="var(--cursor-ring)"
          strokeWidth="1.25"
          className="transition-[stroke] duration-300"
        />
        <circle
          ref={arcRef}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="var(--cursor-arc)"
          strokeWidth="1.75"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC}
          className="transition-[stroke] duration-300"
        />
      </svg>
    </div>
  );
}
