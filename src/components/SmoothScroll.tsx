"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { loaderDone, provideScroll, scheduleThemeSync } from "@/lib/store";

let lenisInstance: Lenis | null = null;

/** Current scroll velocity (px/frame), for small "alive" UI details. */
export function scrollVelocity() {
  return lenisInstance?.velocity ?? 0;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // The intro is a scripted sequence; always start it from the top.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: !prefersReducedMotion(),
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // Header colours follow the surface under it (see scheduleThemeSync).
    window.addEventListener("scroll", scheduleThemeSync, { passive: true });
    window.addEventListener("resize", scheduleThemeSync);
    ScrollTrigger.addEventListener("refresh", scheduleThemeSync);
    scheduleThemeSync();

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    provideScroll((y, immediate) =>
      lenis.scrollTo(y, { immediate, duration: 1.8, force: true })
    );

    // Hold the page still while the loader is up.
    if (!loaderDone.get()) lenis.stop();
    const off = loaderDone.subscribe(() => {
      if (loaderDone.get()) lenis.start();
    });

    return () => {
      off();
      window.removeEventListener("scroll", scheduleThemeSync);
      window.removeEventListener("resize", scheduleThemeSync);
      ScrollTrigger.removeEventListener("refresh", scheduleThemeSync);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
