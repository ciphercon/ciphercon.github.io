/**
 * Minimal app-wide pub/sub, shared by components that live in different
 * subtrees (loader → hero intro, menu → scroll anchors, sections → header
 * theme). Kept dependency-free on purpose.
 */

type Listener = () => void;

function signal<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => value,
    set(next: T) {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(l: Listener) {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
}

/** Flips to true once the loader has started dissolving. */
export const loaderDone = signal(false);

export function whenLoaded(): Promise<void> {
  if (loaderDone.get()) return Promise.resolve();
  return new Promise((resolve) => {
    const off = loaderDone.subscribe(() => {
      if (loaderDone.get()) {
        off();
        resolve();
      }
    });
  });
}

export const menuOpen = signal(false);

export type Theme = "dark" | "lime";

export function setTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  if (document.documentElement.dataset.theme !== theme) {
    document.documentElement.dataset.theme = theme;
  }
}

/**
 * Scroll anchors: each section registers a function returning the scroll
 * position that shows it (pinned scenes can't be reached via offsetTop).
 */
const anchors = new Map<string, () => number>();

export function registerAnchor(id: string, getY: () => number) {
  anchors.set(id, getY);
  return () => {
    if (anchors.get(id) === getY) anchors.delete(id);
  };
}

export function anchorY(id: string): number | null {
  const get = anchors.get(id);
  return get ? get() : null;
}

/** Smooth-scroll implementation, provided by SmoothScroll (Lenis). */
let scrollImpl: (y: number, immediate?: boolean) => void = (y) =>
  window.scrollTo({ top: y, behavior: "smooth" });

export function provideScroll(fn: (y: number, immediate?: boolean) => void) {
  scrollImpl = fn;
}

export function scrollToAnchor(id: string, immediate = false) {
  const y = anchorY(id);
  if (y !== null) scrollImpl(y, immediate);
}

export function scrollToY(y: number, immediate = false) {
  scrollImpl(y, immediate);
}
