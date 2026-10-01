import { Howl, Howler } from "howler";

/**
 * Shared ambient-sound controller (public/ambient.mp3), so several toggles
 * (header, menu) drive one track.
 *
 * Defaults to on. Browsers block unmuted autoplay before any real user
 * interaction, so playback starts on the visitor's first click, tap or
 * keypress anywhere on the page.
 *
 * Toggle buttons carry `data-sound-toggle` and are excluded from that
 * generic listener, and the displayed state follows Howler's own play/pause
 * events — otherwise a first click on a toggle races the auto-start
 * listener and immediately re-pauses.
 */

const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

let howl: Howl | null = null;
let refs = 0;
let playing = true;
let userPaused = false;
const listeners = new Set<() => void>();

function emit(next: boolean) {
  playing = next;
  listeners.forEach((l) => l());
}

function resumeAudioContext() {
  if (Howler.ctx && Howler.ctx.state === "suspended") Howler.ctx.resume();
}

function tryPlay(e: Event) {
  const target = e.target as Element | null;
  if (target?.closest?.("[data-sound-toggle]")) return;
  resumeAudioContext();
  if (howl && !userPaused && !howl.playing()) howl.play();
}

export function acquireSound() {
  refs++;
  if (!howl) {
    howl = new Howl({
      src: ["/ambient.mp3"],
      loop: true,
      volume: 0.4,
      autoplay: true,
      onplay: () => emit(true),
      onpause: () => emit(false),
      onstop: () => emit(false),
      onloaderror: () => {
        // No ambient.mp3 — toggles stay no-ops.
      },
    });
    UNLOCK_EVENTS.forEach((ev) => document.addEventListener(ev, tryPlay, { passive: true }));
  }
  return () => {
    refs--;
    if (refs === 0 && howl) {
      UNLOCK_EVENTS.forEach((ev) => document.removeEventListener(ev, tryPlay));
      howl.unload();
      howl = null;
    }
  };
}

export function toggleSound() {
  if (!howl) return;
  if (howl.playing()) {
    howl.pause();
    userPaused = true;
  } else {
    userPaused = false;
    resumeAudioContext();
    howl.play();
  }
}

export function subscribeSound(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function isSoundOn() {
  return playing;
}
