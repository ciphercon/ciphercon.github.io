"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@01";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

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
}: {
  text: string;
  className?: string;
  startDelay?: number;
  tickMs?: number;
  lockEvery?: number;
  charsPerTick?: number;
}) {
  const [output, setOutput] = useState("");
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

    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        tick++;
        let result = "";
        for (let i = 0; i < text.length; i++) {
          if (i < revealCount || text[i] === " ") {
            result += text[i];
          } else if (i === revealCount) {
            result += randomGlyph();
          }
        }
        setOutput(result);

        if (tick % lockEvery === 0) {
          revealCount += charsPerTick;
        }
        if (revealCount > text.length) {
          clearInterval(intervalId);
          setOutput(text);
        }
      }, tickMs);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isVisible, text, startDelay, tickMs, lockEvery, charsPerTick]);

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
        {output}
      </span>
    </span>
  );
}
