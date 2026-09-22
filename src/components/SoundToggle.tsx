"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

/**
 * Toggles ambient background sound. Expects an audio file at
 * public/ambient.mp3 — until you add one, playback silently no-ops.
 *
 * Defaults to on. Browsers block unmuted audio autoplay before any
 * real user interaction with the page — no code can bypass that, it's
 * a hard browser security policy, not a bug. So this: (1) attempts to
 * play immediately on mount, for the (rare) cases that's allowed, and
 * (2) explicitly starts playback on the visitor's very first
 * click/tap/keypress anywhere on the page as a deterministic fallback,
 * rather than relying only on Howler's internal auto-unlock queue
 * (which can race with React remounting this component in dev mode).
 */
export default function SoundToggle() {
  const [isOn, setIsOn] = useState(true);
  const howlRef = useRef<Howl | null>(null);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const howl = new Howl({
      src: ["/ambient.mp3"],
      loop: true,
      volume: 0.4,
      autoplay: true,
      onloaderror: () => {
        // No ambient.mp3 yet — toggle stays a no-op until one is added.
      },
    });
    howlRef.current = howl;

    const tryPlay = () => {
      if (!userPausedRef.current && !howl.playing()) {
        howl.play();
      }
    };

    UNLOCK_EVENTS.forEach((event) =>
      document.addEventListener(event, tryPlay, { passive: true })
    );

    return () => {
      UNLOCK_EVENTS.forEach((event) =>
        document.removeEventListener(event, tryPlay)
      );
      howl.unload();
    };
  }, []);

  const toggle = () => {
    const howl = howlRef.current;
    if (!howl) return;

    if (isOn) {
      howl.pause();
      userPausedRef.current = true;
    } else {
      userPausedRef.current = false;
      howl.play();
    }
    setIsOn(!isOn);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-accent"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isOn ? "bg-accent" : "bg-muted"}`}
      />
      Sound — {isOn ? "On" : "Off"}
    </button>
  );
}
