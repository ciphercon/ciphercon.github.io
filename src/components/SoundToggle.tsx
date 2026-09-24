"use client";

import { useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";

const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

function resumeAudioContext() {
  if (Howler.ctx && Howler.ctx.state === "suspended") {
    Howler.ctx.resume();
  }
}

/**
 * Toggles ambient background sound. Expects an audio file at
 * public/ambient.mp3 — until you add one, playback silently no-ops.
 *
 * Defaults to on. Browsers block unmuted audio autoplay before any
 * real user interaction with the page — no code can bypass that, it's
 * a hard browser security policy, not a bug. So this starts playback
 * on the visitor's very first click/tap/keypress anywhere on the page.
 *
 * The toggle button is excluded from that generic listener and the
 * displayed on/off state is driven entirely by Howler's own play/pause
 * events (not locally-tracked state) — otherwise a first click on the
 * button itself races against the auto-start listener: the sound
 * starts, then the button's own handler immediately re-pauses it
 * because it still thinks playback hasn't started yet.
 */
export default function SoundToggle() {
  const [isOn, setIsOn] = useState(true);
  const howlRef = useRef<Howl | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const howl = new Howl({
      src: ["/ambient.mp3"],
      loop: true,
      volume: 0.4,
      autoplay: true,
      onplay: () => setIsOn(true),
      onpause: () => setIsOn(false),
      onstop: () => setIsOn(false),
      onloaderror: () => {
        // No ambient.mp3 yet — toggle stays a no-op until one is added.
      },
    });
    howlRef.current = howl;

    const tryPlay = (e: Event) => {
      // The toggle button handles its own clicks explicitly below.
      if (buttonRef.current?.contains(e.target as Node)) return;
      resumeAudioContext();
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

    if (howl.playing()) {
      howl.pause();
      userPausedRef.current = true;
    } else {
      userPausedRef.current = false;
      resumeAudioContext();
      howl.play();
    }
  };

  return (
    <button
      ref={buttonRef}
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
