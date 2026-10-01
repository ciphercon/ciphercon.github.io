"use client";

import { useEffect, useSyncExternalStore } from "react";
import { acquireSound, isSoundOn, subscribeSound, toggleSound } from "@/lib/sound";
import { cn } from "@/lib/cn";

/** "SOUND - ON" toggle; every instance drives the same ambient track. */
export default function SoundToggle({ className }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => true);

  useEffect(() => acquireSound(), []);

  return (
    <button
      type="button"
      data-sound-toggle
      onClick={toggleSound}
      aria-pressed={on}
      className={cn("hud whitespace-nowrap text-[var(--hd-text)] transition-colors", className)}
    >
      Sound <span aria-hidden="true">-</span>{" "}
      <span className="text-[var(--hd-strong)]">{on ? "On" : "Off"}</span>
    </button>
  );
}
