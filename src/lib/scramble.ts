import { gsap, prefersReducedMotion } from "./gsap";

/**
 * Scramble-text engine.
 *
 * Every character gets a plan: when it becomes visible, when it disappears,
 * and the time windows during which it shows a random glyph instead of
 * itself. That one model covers typing in (glyphs appear left → right, then
 * resolve), typing out (characters rot into glyphs from the end, then get
 * deleted) and the short "flicker" glitch after a reveal.
 *
 * Runs write straight into an overlay element's innerHTML from a shared
 * GSAP ticker, so a whole page of scrambling text costs no React renders.
 */

export type Segment = { text: string; className?: string };

type Plan = {
  ch: string;
  seg: number;
  from: number;
  until: number;
  glyph: Array<[number, number]>;
};

export type Timing = {
  /** ms between consecutive characters appearing (typing speed). */
  appearStep: number;
  /** ms a character stays scrambled after appearing. */
  resolveDelay: number;
  /** extra ms per character added to the resolve, giving a trailing wave. */
  resolveStep: number;
  /** out: ms between characters starting to rot, from the end backwards. */
  rotStep: number;
  /** out: ms the fully-rotted text holds before deletion starts. */
  vanishDelay: number;
  /** out: ms between consecutive deletions, from the end backwards. */
  deleteStep: number;
};

export const PRESETS = {
  display: { appearStep: 70, resolveDelay: 360, resolveStep: 34, rotStep: 50, vanishDelay: 200, deleteStep: 40 },
  line: { appearStep: 22, resolveDelay: 240, resolveStep: 20, rotStep: 16, vanishDelay: 140, deleteStep: 10 },
  label: { appearStep: 24, resolveDelay: 200, resolveStep: 14, rotStep: 16, vanishDelay: 120, deleteStep: 12 },
  para: { appearStep: 7, resolveDelay: 150, resolveStep: 5, rotStep: 3, vanishDelay: 90, deleteStep: 2 },
} satisfies Record<string, Timing>;

export type Preset = keyof typeof PRESETS;

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&+=/";
const GLYPH_INTERVAL = 55;

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;"
  );
}

function isBlank(ch: string) {
  return ch === " " || ch === "\n" || ch === " ";
}

type Run = {
  el: HTMLElement;
  segments: Segment[];
  plans: Plan[];
  classes: string[];
  t0: number;
  end: number;
  glyphs: string[];
  glyphCls: number[];
  lastGlyphAt: number;
  lastHtml: string;
  done: () => void;
};

const runs = new Map<HTMLElement, Run>();
let ticking = false;

function now() {
  return performance.now();
}

function randomize(run: Run, t: number) {
  run.lastGlyphAt = t;
  for (let i = 0; i < run.plans.length; i++) {
    run.glyphs[i] = GLYPHS[(Math.random() * GLYPHS.length) | 0];
    run.glyphCls[i] = (Math.random() * run.classes.length) | 0;
  }
}

function render(run: Run, t: number) {
  const { plans, segments, classes } = run;
  let html = "";
  let seg = -1;
  let openCls = -1; // index of an open scramble span, -1 when none
  let plain = "";

  const flushPlain = () => {
    if (plain) {
      html += escapeHtml(plain);
      plain = "";
    }
  };
  const closeCls = () => {
    if (openCls !== -1) {
      html += "</span>";
      openCls = -1;
    }
  };

  for (let i = 0; i < plans.length; i++) {
    const p = plans[i];
    if (t < p.from || t >= p.until) continue;
    if (p.seg !== seg) {
      flushPlain();
      closeCls();
      if (seg !== -1) html += "</span>";
      seg = p.seg;
      const cls = segments[seg].className;
      html += cls ? `<span class="${cls}">` : "<span>";
    }
    let scrambled = false;
    if (!isBlank(p.ch)) {
      for (const [a, b] of p.glyph) {
        if (t >= a && t < b) {
          scrambled = true;
          break;
        }
      }
    }
    if (scrambled) {
      const c = run.glyphCls[i];
      if (openCls !== c) {
        flushPlain();
        closeCls();
        html += `<span class="${classes[c]}">`;
        openCls = c;
      }
      html += escapeHtml(run.glyphs[i]);
    } else {
      if (openCls !== -1) closeCls();
      plain += p.ch;
    }
  }
  flushPlain();
  closeCls();
  if (seg !== -1) html += "</span>";

  if (html !== run.lastHtml) {
    run.el.innerHTML = html;
    run.lastHtml = html;
  }
}

function tick() {
  const t = now();
  for (const [el, run] of runs) {
    const local = t - run.t0;
    if (t - run.lastGlyphAt > GLYPH_INTERVAL) randomize(run, t);
    render(run, local);
    if (local >= run.end) {
      runs.delete(el);
      run.done();
    }
  }
  if (runs.size === 0 && ticking) {
    gsap.ticker.remove(tick);
    ticking = false;
  }
}

function start(
  el: HTMLElement,
  segments: Segment[],
  plans: Plan[],
  classes: string[]
): ScrambleHandle {
  cancel(el);
  let resolveFinished!: () => void;
  const finished = new Promise<void>((r) => (resolveFinished = r));

  let end = 0;
  for (const p of plans) {
    if (Number.isFinite(p.until)) end = Math.max(end, p.until);
    for (const [, b] of p.glyph) if (Number.isFinite(b)) end = Math.max(end, b);
  }

  const run: Run = {
    el,
    segments,
    plans,
    classes: classes.length ? classes : ["scr"],
    t0: now(),
    end,
    glyphs: new Array(plans.length).fill(""),
    glyphCls: new Array(plans.length).fill(0),
    lastGlyphAt: 0,
    lastHtml: el.innerHTML,
    done: resolveFinished,
  };
  randomize(run, run.t0);
  runs.set(el, run);
  render(run, 0);
  if (!ticking) {
    gsap.ticker.add(tick);
    ticking = true;
  }
  return {
    finished,
    cancel: () => {
      if (runs.get(el) === run) {
        runs.delete(el);
        resolveFinished();
      }
    },
  };
}

export type ScrambleHandle = { finished: Promise<void>; cancel: () => void };

function flatten(segments: Segment[]) {
  const out: Array<{ ch: string; seg: number }> = [];
  segments.forEach((s, seg) => {
    for (const ch of s.text) out.push({ ch, seg });
  });
  return out;
}

export function cancel(el: HTMLElement) {
  const run = runs.get(el);
  if (run) {
    runs.delete(el);
    run.done();
  }
}

/** Instantly show the final text (or nothing). */
export function setStatic(el: HTMLElement, segments: Segment[], visible: boolean) {
  cancel(el);
  if (!visible) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = segments
    .map((s) =>
      s.className
        ? `<span class="${s.className}">${escapeHtml(s.text)}</span>`
        : `<span>${escapeHtml(s.text)}</span>`
    )
    .join("");
}

export type InOptions = {
  timing?: Partial<Timing>;
  delay?: number;
  /** Briefly re-scramble a few trailing characters after resolving. */
  flicker?: boolean;
  classes?: string[];
};

export function scrambleIn(
  el: HTMLElement,
  segments: Segment[],
  { timing, delay = 0, flicker = false, classes = ["scr", "scr-dim"] }: InOptions = {}
): ScrambleHandle {
  if (prefersReducedMotion()) {
    setStatic(el, segments, true);
    return { finished: Promise.resolve(), cancel: () => {} };
  }
  const tm = { ...PRESETS.line, ...timing };
  const chars = flatten(segments);
  const n = chars.length;
  let lastResolve = 0;
  const plans: Plan[] = chars.map(({ ch, seg }, i) => {
    const from = delay + i * tm.appearStep;
    const resolve = from + tm.resolveDelay + i * tm.resolveStep;
    lastResolve = Math.max(lastResolve, resolve);
    return { ch, seg, from, until: Infinity, glyph: [[from, resolve]] };
  });
  if (flicker && n > 2) {
    const count = Math.max(2, Math.round(n * 0.3));
    const f0 = lastResolve + 180;
    for (let k = 0; k < count; k++) {
      const i = n - 1 - k;
      const a = f0 + k * 18;
      plans[i].glyph.push([a, a + 110 + Math.random() * 60]);
    }
  }
  return start(el, segments, plans, classes);
}

export type OutOptions = {
  timing?: Partial<Timing>;
  delay?: number;
  classes?: string[];
};

export function scrambleOut(
  el: HTMLElement,
  segments: Segment[],
  { timing, delay = 0, classes = ["scr", "scr-dim"] }: OutOptions = {}
): ScrambleHandle {
  if (prefersReducedMotion()) {
    setStatic(el, segments, false);
    return { finished: Promise.resolve(), cancel: () => {} };
  }
  const tm = { ...PRESETS.line, ...timing };
  const chars = flatten(segments);
  const n = chars.length;
  // Rot right → left, hold the fully scrambled text, then delete right → left.
  const deleteFrom = delay + (n - 1) * tm.rotStep + tm.vanishDelay;
  const plans: Plan[] = chars.map(({ ch, seg }, i) => {
    const back = n - 1 - i;
    const rot = delay + back * tm.rotStep;
    const until = deleteFrom + back * tm.deleteStep;
    return { ch, seg, from: -Infinity, until: Math.max(until, rot + 40), glyph: [[rot, Infinity]] };
  });
  return start(el, segments, plans, classes);
}

/** A short glitch: scramble a random handful of characters, then settle. */
export function scrambleGlitch(
  el: HTMLElement,
  segments: Segment[],
  { amount = 0.35, duration = 160, classes = ["scr", "scr-dim"] } = {}
): ScrambleHandle {
  if (prefersReducedMotion()) return { finished: Promise.resolve(), cancel: () => {} };
  const chars = flatten(segments);
  const plans: Plan[] = chars.map(({ ch, seg }) => {
    const hit = Math.random() < amount;
    const a = Math.random() * 60;
    return { ch, seg, from: -Infinity, until: Infinity, glyph: hit ? [[a, a + duration]] : [] };
  });
  return start(el, segments, plans, classes);
}
