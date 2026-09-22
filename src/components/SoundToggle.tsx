"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

/**
 * Toggles ambient background sound. Expects an audio file at
 * public/ambient.mp3 — until you add one, playback silently no-ops.
 *
 * Defaults to on and attempts to autoplay on mount. Browsers block
 * unmuted audio autoplay before any user interaction with the page —
 * no code can fully bypass that. Howler's built-in autoUnlock (on by
 * default) handles this gracefully: if the browser blocks the initial
 * play() call, Howler automatically starts it on the visitor's very
 * first click/tap/keypress anywhere on the page, so it still starts
 * "on" without them needing to specifically hit this toggle.
 */
export default function SoundToggle() {
  const [isOn, setIsOn] = useState(true);
  const howlRef = useRef<Howl | null>(null);

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

    return () => {
      howl.unload();
    };
  }, []);

  const toggle = () => {
    const howl = howlRef.current;
    if (!howl) return;

    if (isOn) {
      howl.pause();
    } else {
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
