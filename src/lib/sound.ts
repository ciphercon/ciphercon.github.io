import { Howl, Howler } from "howler";
import { whenLoaded } from "@/lib/store";

/**
 * Shared ambient-sound controller (public/ambient.mp3), so several toggles
 * (header, menu) drive one track.
 *
 * Defaults to on. Browsers block unmuted autoplay before any real user
 * interaction, so playback starts on the visitor's first click, tap or
 * keypress anywhere on the page.
 *
 * The track is ~10 MB, so it only starts downloading once the page's own
 * assets have loaded and the loader is gone; on slow connections it would
 * otherwise starve the hero photo, fonts and scripts. It stays on Web Audio
 * (not HTML5 streaming) because iOS ignores volume on HTML5 audio and the
 * loop would no longer be gapless.
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
  // Before the track has loaded, play() would queue one copy per call.
  if (howl?.state() === "loaded" && !userPaused && !howl.playing()) howl.play();
}

function pageLoaded() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
}

export function acquireSound() {
  refs++;
  if (!howl) {
    const h = new Howl({
      src: ["/ambient.mp3"],
      loop: true,
      volume: 0.4,
      preload: false,
      onload: () => {
        // Waits for the audio context to resume if there's been no interaction yet.
        if (!userPaused) h.play();
      },
      onplay: () => emit(true),
      onpause: () => emit(false),
      onstop: () => emit(false),
      onloaderror: () => {
        // No ambient.mp3 — toggles stay no-ops.
      },
    });
    howl = h;
    Promise.all([pageLoaded(), whenLoaded()]).then(() => {
      if (howl === h) h.load();
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
  if (howl.state() !== "loaded") {
    // Still downloading: just record the choice; onload honours it.
    userPaused = !userPaused;
    emit(!userPaused);
    return;
  }
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
