"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@01";
const SCRAMBLE_COLORS = ["text-white", "text-accent-bg"];

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function randomScrambleColor() {
  return SCRAMBLE_COLORS[Math.floor(Math.random() * SCRAMBLE_COLORS.length)];
}

type Segment = { text: string; colorClass?: string };

/**
 * Scramble-typewriter text reveal. Starts once this element scrolls into
 * view (each instance triggers only once). The final text is rendered
 * invisibly to reserve layout space up front, so the reveal never shifts
 * surrounding elements — the animated text is overlaid on top of it.
 */
export default function GlitchText({
  text,
  className,
  startDelay = 0,
  tickMs = 45,
  lockEvery = 2,
  charsPerTick = 1,
  scrambleTail = false,
  mixColors = false,
}: {
  text: string;
  className?: string;
  startDelay?: number;
  tickMs?: number;
  lockEvery?: number;
  charsPerTick?: number;
  /** Keep re-scrambling every not-yet-revealed character each tick
   * (classic "decrypting" look) instead of leaving the tail blank
   * with just a single scrambling cursor. */
  scrambleTail?: boolean;
  /** While a character is still scrambling, color it white or the
   * site's lime accent at random each tick, instead of the base text
   * color. Only visible when scrambleTail is also true. */
  mixColors?: boolean;
}) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let revealCount = 0;
    let tick = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const buildSegments = (): Segment[] => {
      const next: Segment[] = [];
      let plain = "";
      for (let i = 0; i < text.length; i++) {
        const isPlain = i < revealCount || text[i] === " ";
        if (isPlain) {
          plain += text[i];
        } else if (scrambleTail || i === revealCount) {
          if (plain) {
            next.push({ text: plain });
            plain = "";
          }
          next.push({
            text: randomGlyph(),
            colorClass: mixColors ? randomScrambleColor() : undefined,
          });
        }
      }
      if (plain) next.push({ text: plain });
      return next;
    };

    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        tick++;
        setSegments(buildSegments());

        if (tick % lockEvery === 0) {
          revealCount += charsPerTick;
        }
        if (revealCount > text.length) {
          clearInterval(intervalId);
          setSegments([{ text }]);
        }
      }, tickMs);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    isVisible,
    text,
    startDelay,
    tickMs,
    lockEvery,
    charsPerTick,
    scrambleTail,
    mixColors,
  ]);

  return (
    <span ref={ref} className="relative inline-block align-baseline">
      <span
        className={`invisible whitespace-pre-wrap ${className ?? ""}`}
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className={`absolute inset-0 whitespace-pre-wrap ${className ?? ""}`}
        aria-label={text}
      >
        {segments.map((seg, i) =>
          seg.colorClass ? (
            <span key={i} className={seg.colorClass}>
              {seg.text}
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </span>
    </span>
  );
}
