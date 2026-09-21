"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

/**
 * Toggles ambient background sound. Expects an audio file at
 * public/ambient.mp3 — until you add one, playback silently no-ops.
 */
export default function SoundToggle() {
  const [isOn, setIsOn] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    howlRef.current = new Howl({
      src: ["/ambient.mp3"],
      loop: true,
      volume: 0.4,
      onloaderror: () => {
        // No ambient.mp3 yet — toggle stays a no-op until one is added.
      },
    });

    return () => {
      howlRef.current?.unload();
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
