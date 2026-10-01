"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { MANIFESTO } from "@/data/site";
import Scramble, { type ScrambleRef } from "@/components/ui/Scramble";
import { PixelArrow } from "@/components/ui/Glyphs";
import { cn } from "@/lib/cn";
import type { SceneRef } from "./types";

/**
 * Scene 2: a justified manifesto that types itself in line by line, then a
 * quote climbing up to the right like a staircase, one word at a time.
 */
const ManifestoScene = forwardRef<SceneRef>(function ManifestoScene(_, ref) {
  const rootRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const words = useRef<(ScrambleRef | null)[][]>(MANIFESTO.lines.map(() => []));
  const quote = useRef<(ScrambleRef | null)[]>([]);
  const tokenRef = useRef(0);
  const blockRef = useRef<HTMLDivElement>(null);

  // Shrink the type until the widest line keeps real gaps between words.
  useEffect(() => {
    const root = rootRef.current;
    const block = blockRef.current;
    if (!root || !block) return;
    const fit = () => {
      root.style.removeProperty("--mf-size");
      const base = parseFloat(getComputedStyle(block).fontSize);
      const avail = block.clientWidth;
      let size = base;
      block.querySelectorAll<HTMLElement>("[data-mline]").forEach((line) => {
        const words = [...line.children] as HTMLElement[];
        const sum = words.reduce((a, w) => a + w.getBoundingClientRect().width, 0);
        const indent = parseFloat(getComputedStyle(line).paddingLeft) || 0;
        const perPx = sum / base + (words.length - 1) * 0.3;
        size = Math.min(size, (avail - indent) / perPx);
      });
      if (size < base) root.style.setProperty("--mf-size", `${Math.floor(size * 100) / 100}px`);
    };
    let cancelled = false;
    document.fonts.ready.then(() => !cancelled && fit());
    const ro = new ResizeObserver(fit);
    ro.observe(block);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    show: async () => {
      const token = ++tokenRef.current;
      const root = rootRef.current;
      if (!root) return;
      gsap.set(root, { autoAlpha: 1 });
      gsap.set(arrowRef.current, { opacity: 0 });
      const lines = words.current;
      const body = lines.flatMap((line, i) =>
        line.map((w, j) => w?.play({ delay: i * 95 + j * 40 }))
      );
      // The quote starts once the block is mostly typed.
      const start = lines.length * 95 + 420;
      const quoteRuns = quote.current.map((q, k) =>
        q?.play({ delay: start + k * 560, flicker: k === quote.current.length - 1 })
      );
      gsap.to(arrowRef.current, {
        opacity: 1,
        duration: 0.2,
        delay: prefersReducedMotion() ? 0 : (start + 380) / 1000,
        onStart: () => {
          if (token !== tokenRef.current) gsap.set(arrowRef.current, { opacity: 0 });
        },
      });
      await Promise.all([...body, ...quoteRuns]);
    },
    hide: async () => {
      ++tokenRef.current;
      gsap.killTweensOf(arrowRef.current);
      gsap.to(arrowRef.current, { opacity: 0, duration: 0.15 });
      const lines = words.current;
      const n = lines.length;
      // Bottom lines go first, like the reference.
      const body = lines.flatMap((line, i) =>
        line.map((w) => w?.reverse({ delay: (n - 1 - i) * 55 }))
      );
      const q = quote.current.map((w, k) => w?.reverse({ delay: (quote.current.length - 1 - k) * 60 }));
      await Promise.all([...body, ...q]);
    },
    reset: () => {
      ++tokenRef.current;
      words.current.flat().forEach((w) => w?.hide());
      quote.current.forEach((w) => w?.hide());
      gsap.set(arrowRef.current, { opacity: 0 });
    },
  }));

  return (
    <div
      ref={rootRef}
      id="manifesto"
      className="invisible relative flex flex-col gap-14 px-[var(--edge)] py-24 [--mf-base:min(10.4vw,8.5vh)] [--mf-q:0.78] lg:absolute lg:inset-0 lg:block lg:p-0 lg:[--mf-base:min(4.7vw,8.2vh)] lg:[--mf-q:1]"
    >
      <div
        ref={blockRef}
        className="display w-full max-w-[calc(var(--mf-base)*8.6)] font-normal text-white leading-[0.9] lg:absolute lg:max-w-none lg:bottom-[5.5vh] lg:left-[var(--edge)] lg:w-[calc(2*var(--col-w))] lg:leading-[0.86]"
        style={{ fontSize: "var(--mf-size, var(--mf-base))" }}
      >
        {MANIFESTO.lines.map((line, i) => (
          <p
            key={i}
            data-mline
            className={cn(
              "flex justify-between",
              "indent" in line && line.indent && "pl-[calc(var(--col-w)*0.38)] lg:pl-[calc(var(--col-w)*0.38)]"
            )}
          >
            {line.words.map((word, j) => (
              <Scramble
                key={j}
                ref={(r) => {
                  words.current[i][j] = r;
                }}
                text={word}
                nowrap
              />
            ))}
          </p>
        ))}
      </div>

      <div
        className="display flex items-end self-end pt-[1.6em] font-normal text-white leading-[0.9] lg:absolute lg:pt-0 lg:bottom-[5.5vh] lg:right-[calc(var(--edge)+0.4rem)] lg:leading-[0.86]"
        style={{ fontSize: "calc(var(--mf-size, var(--mf-base)) * var(--mf-q))" }}
      >
        {MANIFESTO.quote.map((word, k) => (
          <span
            key={k}
            className="flex items-center"
            style={{ transform: `translateY(${-k * 0.7}em)`, marginLeft: k ? "0.28em" : 0 }}
          >
            <Scramble
              ref={(r) => {
                quote.current[k] = r;
              }}
              text={word}
              preset="display"
              nowrap
            />
            {k === 0 && (
              <span ref={arrowRef} className="ml-[0.18em] inline-flex opacity-0">
                <PixelArrow className="h-[0.42em] w-[0.6em] text-lime" />
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
});

export default ManifestoScene;
