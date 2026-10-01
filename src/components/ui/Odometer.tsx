"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export type OdometerRef = { play: (delay?: number) => void; reset: () => void };

const STRIP = "01234567890123456789";

/**
 * Rolling number: each digit is a vertical strip of 0–9 (twice) that spins
 * a full turn before landing on its target, staggered left to right.
 * Non-digit characters (+, M) fade in alongside.
 */
const Odometer = forwardRef<OdometerRef, { value: string; className?: string }>(
  function Odometer({ value, className }, ref) {
    const rootRef = useRef<HTMLSpanElement>(null);

    useImperativeHandle(ref, () => ({
      play: (delay = 0) => {
        const root = rootRef.current;
        if (!root) return;
        const strips = root.querySelectorAll<HTMLElement>("[data-strip]");
        const statics = root.querySelectorAll<HTMLElement>("[data-static]");
        gsap.killTweensOf([...strips, ...statics]);
        if (prefersReducedMotion()) {
          strips.forEach((s) => gsap.set(s, { yPercent: -(Number(s.dataset.strip) + 10) * 5 }));
          gsap.set(statics, { opacity: 1 });
          return;
        }
        strips.forEach((s, i) => {
          const d = Number(s.dataset.strip);
          gsap.fromTo(
            s,
            { yPercent: 0 },
            {
              // Each glyph is 1/20th of the strip.
              yPercent: -((10 + d) / 20) * 100,
              duration: 1.35 + i * 0.12,
              delay: delay / 1000 + i * 0.08,
              ease: "power3.out",
            }
          );
        });
        gsap.fromTo(statics, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: delay / 1000 + 0.35, stagger: 0.08 });
      },
      reset: () => {
        const root = rootRef.current;
        if (!root) return;
        const strips = root.querySelectorAll<HTMLElement>("[data-strip]");
        const statics = root.querySelectorAll<HTMLElement>("[data-static]");
        gsap.killTweensOf([...strips, ...statics]);
        gsap.set(strips, { yPercent: 0 });
        gsap.set(statics, { opacity: 0 });
      },
    }));

    return (
      <span ref={rootRef} className={cn("inline-flex leading-none", className)}>
        <span className="sr-only">{value}</span>
        {[...value].map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} aria-hidden="true" className="relative inline-block h-[1em] overflow-hidden">
              <span className="invisible">0</span>
              <span data-strip={ch} className="absolute left-0 top-0 flex flex-col">
                {[...STRIP].map((g, k) => (
                  <span key={k} className="block h-[1em]">
                    {g}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} aria-hidden="true" data-static className="inline-block opacity-0">
              {ch}
            </span>
          )
        )}
      </span>
    );
  }
);

export default Odometer;
