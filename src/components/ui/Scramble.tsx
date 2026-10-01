"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ElementType,
} from "react";
import {
  PRESETS,
  cancel,
  scrambleGlitch,
  scrambleIn,
  scrambleOut,
  setStatic,
  type Preset,
  type Segment,
} from "@/lib/scramble";
import { whenLoaded } from "@/lib/store";
import { cn } from "@/lib/cn";

export type ScrambleRef = {
  /** Type the text in. Resolves when fully revealed. */
  play: (o?: { delay?: number; flicker?: boolean }) => Promise<void>;
  /** Rot and delete the text. Resolves when empty. */
  reverse: (o?: { delay?: number }) => Promise<void>;
  show: () => void;
  hide: () => void;
  glitch: () => void;
};

type Props = {
  text?: string;
  segments?: Segment[];
  as?: ElementType;
  className?: string;
  preset?: Preset;
  /** "inview" plays once on scroll-in; "manual" waits for the ref API. */
  trigger?: "inview" | "manual";
  delay?: number;
  flicker?: boolean;
  initiallyVisible?: boolean;
  block?: boolean;
  nowrap?: boolean;
  threshold?: number;
};

function toHtml(segments: Segment[]) {
  const esc = (s: string) =>
    s.replace(/[&<>"]/g, (c) =>
      c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;"
    );
  return segments
    .map((s) => `<span${s.className ? ` class="${s.className}"` : ""}>${esc(s.text)}</span>`)
    .join("");
}

/**
 * Text that reveals itself with the scramble-typing effect. An invisible
 * copy of the final text reserves the layout so nothing shifts while the
 * animated overlay types, and screen readers get the plain text.
 */
const Scramble = forwardRef<ScrambleRef, Props>(function Scramble(
  {
    text,
    segments: segmentsProp,
    as: Tag = "span",
    className,
    preset = "line",
    trigger = "manual",
    delay = 0,
    flicker = false,
    initiallyVisible = false,
    block = false,
    nowrap = false,
    threshold = 0.25,
  },
  ref
) {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);

  const key = segmentsProp ? JSON.stringify(segmentsProp) : (text ?? "");
  const segments = useMemo<Segment[]>(
    () => segmentsProp ?? [{ text: text ?? "" }],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );
  const plain = useMemo(() => segments.map((s) => s.text).join(""), [segments]);
  const timing = PRESETS[preset];

  const api = useMemo<ScrambleRef>(
    () => ({
      play: (o) => {
        const el = overlayRef.current;
        if (!el) return Promise.resolve();
        return scrambleIn(el, segments, {
          timing,
          delay: o?.delay ?? 0,
          flicker: o?.flicker ?? flicker,
        }).finished;
      },
      reverse: (o) => {
        const el = overlayRef.current;
        if (!el) return Promise.resolve();
        return scrambleOut(el, segments, { timing, delay: o?.delay ?? 0 }).finished;
      },
      show: () => overlayRef.current && setStatic(overlayRef.current, segments, true),
      hide: () => overlayRef.current && setStatic(overlayRef.current, segments, false),
      glitch: () => {
        if (overlayRef.current) scrambleGlitch(overlayRef.current, segments);
      },
    }),
    [segments, timing, flicker]
  );

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (trigger !== "inview") return;
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        whenLoaded().then(() => {
          if (!cancelled) api.play({ delay });
        });
      },
      { threshold }
    );
    io.observe(root);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [trigger, api, delay, threshold]);

  useEffect(() => {
    const el = overlayRef.current;
    return () => {
      if (el) cancel(el);
    };
  }, []);

  const initialHtml = initiallyVisible ? toHtml(segments) : "";

  return (
    <Tag
      ref={rootRef}
      className={cn(block ? "block" : "inline-block", "relative", className)}
    >
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true" className={cn("invisible", nowrap && "whitespace-nowrap")}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
          </span>
        ))}
      </span>
      <span
        aria-hidden="true"
        ref={overlayRef}
        className={cn("absolute inset-0", nowrap && "whitespace-nowrap")}
        dangerouslySetInnerHTML={{ __html: initialHtml }}
      />
    </Tag>
  );
});

export default Scramble;
