"use client";

import { useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";

const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;
const GAP_MS = 5000;
const PLAYLIST = ["/ride-or-die.mp3", "/ambient.mp3"];

function resumeAudioContext() {
  if (Howler.ctx && Howler.ctx.state === "suspended") {
    Howler.ctx.resume();
  }
}

/**
 * Plays a two-track playlist on loop, with a 5s silent gap between
 * each track (ride-or-die -> 5s gap -> ambient -> 5s gap -> repeat).
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
  const howlsRef = useRef<Howl[]>([]);
  const currentIndexRef = useRef(0);
  const gapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const playNext = () => {
      gapTimeoutRef.current = null;
      if (userPausedRef.current) return;
      currentIndexRef.current = (currentIndexRef.current + 1) % PLAYLIST.length;
      resumeAudioContext();
      howlsRef.current[currentIndexRef.current]?.play();
    };

    const howls = PLAYLIST.map(
      (src, i) =>
        new Howl({
          src: [src],
          loop: false,
          volume: 0.4,
          autoplay: i === 0,
          onplay: () => setIsOn(true),
          onpause: () => setIsOn(false),
          onstop: () => setIsOn(false),
          onend: () => {
            gapTimeoutRef.current = setTimeout(playNext, GAP_MS);
          },
          onloaderror: () => {
            // Track missing/failed to load — it just won't play.
          },
        })
    );
    howlsRef.current = howls;

    const tryPlay = (e: Event) => {
      // The toggle button handles its own clicks explicitly below.
      if (buttonRef.current?.contains(e.target as Node)) return;
      resumeAudioContext();
      const current = howlsRef.current[currentIndexRef.current];
      if (!userPausedRef.current && current && !current.playing()) {
        current.play();
      }
    };

    UNLOCK_EVENTS.forEach((event) =>
      document.addEventListener(event, tryPlay, { passive: true })
    );

    return () => {
      UNLOCK_EVENTS.forEach((event) =>
        document.removeEventListener(event, tryPlay)
      );
      if (gapTimeoutRef.current) clearTimeout(gapTimeoutRef.current);
      howls.forEach((h) => h.unload());
    };
  }, []);

  const toggle = () => {
    const current = howlsRef.current[currentIndexRef.current];
    if (!current) return;

    if (current.playing()) {
      current.pause();
      userPausedRef.current = true;
      if (gapTimeoutRef.current) {
        clearTimeout(gapTimeoutRef.current);
        gapTimeoutRef.current = null;
      }
    } else {
      userPausedRef.current = false;
      resumeAudioContext();
      current.play();
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
