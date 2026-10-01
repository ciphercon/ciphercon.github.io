"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { buildCells, fromCenter } from "@/lib/pixels";
import { loaderDone } from "@/lib/store";

const MIN_SHOW_MS = 650;
const MAX_WAIT_MS = 4000;

function waitForAssets() {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const portrait = new Image();
  portrait.src = "/hero-cutout.png";
  const photo = portrait.decode().catch(() => undefined);
  const timeout = new Promise((r) => setTimeout(r, MAX_WAIT_MS));
  const minimum = new Promise((r) => setTimeout(r, MIN_SHOW_MS));
  return Promise.all([Promise.race([Promise.all([fonts, photo]), timeout]), minimum]);
}

/**
 * Full-screen lime curtain that dissolves from the centre outwards in
 * blocks. The solid div is server-rendered so it's the very first paint;
 * the canvas takes over for the dissolve.
 */
export default function Loader() {
  const [gone, setGone] = useState(false);
  const solidRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let tween: gsap.core.Tween | null = null;

    waitForAssets().then(() => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      const solid = solidRef.current;
      if (!canvas || !solid) return;

      if (prefersReducedMotion()) {
        loaderDone.set(true);
        tween = gsap.to(solid, { opacity: 0, duration: 0.3, onComplete: () => setGone(true) });
        return;
      }

      const W = window.innerWidth;
      const H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      const lime = getComputedStyle(document.documentElement).getPropertyValue("--lime").trim();
      const size = Math.max(36, Math.round(W / 32));
      const cells = buildCells(W, H, size, fromCenter(0.38), 7);

      const paint = (p: number) => {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = lime;
        for (const c of cells) {
          if (p < c.t) ctx.fillRect(c.x, c.y, c.w + 0.5, c.h + 0.5);
        }
      };
      paint(0);
      solid.style.visibility = "hidden";

      const state = { p: 0 };
      tween = gsap.to(state, {
        p: 1,
        duration: 0.85,
        ease: "power2.inOut",
        onStart: () => {
          // Let the hero start typing while the blocks clear.
          window.setTimeout(() => loaderDone.set(true), 220);
        },
        onUpdate: () => paint(state.p),
        onComplete: () => setGone(true),
      });
    });

    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div id="loader" className="pointer-events-auto fixed inset-0 z-[100]" aria-hidden="true">
      <div ref={solidRef} className="absolute inset-0 bg-lime">
        <span className="absolute bottom-[4.25rem] left-1/2 h-[7px] w-10 -translate-x-1/2 rounded-full bg-lime-deep" />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <noscript>
        <style>{`#loader{display:none}`}</style>
      </noscript>
    </div>
  );
}
