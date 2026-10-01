import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export { gsap, ScrollTrigger };

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Desktop gets the pinned, scroll-driven experience; below this it stacks.
 * Keep in sync with `--breakpoint-lg` in globals.css (75rem).
 */
export const DESKTOP_QUERY = "(min-width: 1200px)";
export const STACKED_QUERY = "(max-width: 1199.98px)";
