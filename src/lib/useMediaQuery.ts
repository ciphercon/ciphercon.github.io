"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query. `serverValue` is used for the static
 * HTML and the first client render, so hydration always matches.
 */
export function useMediaQuery(query: string, serverValue = true) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}
