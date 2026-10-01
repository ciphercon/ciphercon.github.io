"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { HERO, SITE } from "@/data/site";
import Scramble, { type ScrambleRef } from "@/components/ui/Scramble";
import { PixelArrowDown } from "@/components/ui/Glyphs";
import type { SceneRef } from "./types";

if (typeof window !== "undefined") gsap.registerPlugin(SplitText);

const BIO_CLASS = {
  accent: "font-medium italic text-red",
  code: "text-lime",
} as const;

/**
 * Scene 1: name, role tag, bio, contact lines and the "FROM IN" marker,
 * over the glitching portrait (rendered by the stage). Text types in with
 * the scramble effect; on exit it rots away and lines slide up under masks.
 */
const HeroScene = forwardRef<SceneRef>(function HeroScene(_, ref) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const linesRef = useRef<HTMLElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const visibleRef = useRef(false);

  const first = useRef<ScrambleRef>(null);
  const last = useRef<ScrambleRef>(null);
  const country = useRef<ScrambleRef>(null);
  const tagText = useRef<ScrambleRef>(null);
  const contact = useRef<(ScrambleRef | null)[]>([]);
  const captions = useRef<(ScrambleRef | null)[]>([]);

  const bioSegments = HERO.bio.map((s) => ({
    text: s.text,
    className: "tone" in s ? BIO_CLASS[s.tone] : undefined,
  }));

  useEffect(() => {
    const bio = bioRef.current;
    if (!bio) return;
    let split: SplitText | null = null;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      split = SplitText.create(bio, {
        type: "lines",
        mask: "lines",
        linesClass: "bio-line",
        autoSplit: true,
        aria: "none",
        onSplit(self) {
          // Each line becomes its own block: keep it justified, and carry
          // the paragraph's first-line indent over as padding.
          const indent = getComputedStyle(bio).textIndent;
          (self.lines as HTMLElement[]).forEach((line, i, all) => {
            line.style.textIndent = "0";
            line.style.textAlignLast = i === all.length - 1 ? "start" : "justify";
            if (i === 0) line.style.paddingLeft = indent;
          });
          gsap.set(self.lines, { yPercent: visibleRef.current ? 0 : 110 });
        },
      });
    });
    return () => {
      cancelled = true;
      split?.revert();
    };
  }, []);

  useImperativeHandle(ref, () => {
    const slides = () => [
      ...(rootRef.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? []),
    ];
    const bioLines = () => [
      ...(bioRef.current?.querySelectorAll<HTMLElement>(".bio-line") ?? []),
    ];
    linesRef.current = bioLines();

    return {
      show: async () => {
        visibleRef.current = true;
        tlRef.current?.kill();
        const root = rootRef.current;
        if (!root) return;
        gsap.set(root, { autoAlpha: 1 });
        const reduce = prefersReducedMotion();
        const tl = gsap.timeline();
        tlRef.current = tl;
        tl.fromTo(slides(), { yPercent: 110 }, { yPercent: 0, duration: reduce ? 0 : 0.9, ease: "expo.out", stagger: 0.05 }, 0);
        const lines = bioLines();
        if (lines.length) tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: reduce ? 0 : 0.9, ease: "expo.out", stagger: 0.07 }, 0.08);
        tl.fromTo(
          tagRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: reduce ? 0 : 0.55, ease: "power3.out" },
          0.12
        );
        await Promise.all([
          first.current?.play({ flicker: true }),
          last.current?.play({ delay: 140, flicker: true }),
          country.current?.play({ delay: 260 }),
          tagText.current?.play({ delay: 180 }),
          ...contact.current.map((c, i) => c?.play({ delay: 60 + i * 70 })),
          ...captions.current.map((c, i) => c?.play({ delay: 380 + i * 120 })),
          tl.then(),
        ]);
      },
      hide: async () => {
        visibleRef.current = false;
        tlRef.current?.kill();
        const reduce = prefersReducedMotion();
        const tl = gsap.timeline();
        tlRef.current = tl;
        tl.to(slides(), { yPercent: -110, duration: reduce ? 0 : 0.55, ease: "power3.in", stagger: 0.035 }, 0);
        const lines = bioLines();
        if (lines.length) tl.to(lines, { yPercent: -110, duration: reduce ? 0 : 0.5, ease: "power3.in", stagger: 0.06 }, 0);
        tl.to(tagRef.current, { clipPath: "inset(0 100% 0 0)", duration: reduce ? 0 : 0.75, ease: "power2.inOut" }, 0);
        await Promise.all([
          first.current?.reverse(),
          last.current?.reverse({ delay: 80 }),
          country.current?.reverse(),
          tagText.current?.reverse(),
          ...contact.current.map((c) => c?.reverse()),
          ...captions.current.map((c) => c?.reverse()),
          tl.then(),
        ]);
      },
      reset: () => {
        visibleRef.current = false;
        tlRef.current?.kill();
        gsap.set(slides(), { yPercent: 110 });
        const lines = bioLines();
        if (lines.length) gsap.set(lines, { yPercent: 110 });
        gsap.set(tagRef.current, { clipPath: "inset(0 100% 0 0)" });
        [first, last, country, tagText].forEach((r) => r.current?.hide());
        contact.current.forEach((c) => c?.hide());
        captions.current.forEach((c) => c?.hide());
      },
    };
  });

  return (
    <div
      ref={rootRef}
      id="hero"
      className="invisible relative flex min-h-svh flex-col px-[var(--edge)] pb-8 pt-[calc(var(--header-h)+1.5rem)] lg:absolute lg:inset-0 lg:block lg:min-h-0 lg:p-0"
    >
      {/* Contact lines */}
      <div className="hud relative z-10 w-full max-w-[22rem] border-l-2 border-lime pl-3.5 text-grey-1 lg:absolute lg:left-[var(--edge)] lg:top-[calc(var(--header-h)+2.3rem)] lg:w-[max(var(--col-w),19rem)] lg:max-w-none">
        {HERO.contact.map((c, i) => (
          <a
            key={c.left}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex justify-between gap-4 transition-colors hover:text-lime"
          >
            <Scramble ref={(r) => { contact.current[i * 2] = r; }} text={c.left} preset="label" nowrap />
            <Scramble ref={(r) => { contact.current[i * 2 + 1] = r; }} text={c.right} preset="label" nowrap />
          </a>
        ))}
      </div>

      {/* FROM / IN */}
      <div className="pointer-events-none relative mt-5 flex items-end gap-3 self-end lg:absolute lg:right-[var(--edge)] lg:top-[calc(var(--header-h)+2.3rem)] lg:mt-0 lg:items-start lg:gap-0">
        <span className="block overflow-hidden lg:absolute lg:right-[calc(var(--col-w)+0.2rem)] lg:top-0">
          <span data-slide className="hud block text-grey-1">From</span>
        </span>
        <span className="display font-light leading-[0.8] text-white text-[clamp(2.6rem,7.4vw,8.5rem)]">
          <Scramble ref={country} text={SITE.location.country} preset="display" nowrap />
        </span>
      </div>

      {/* Bio */}
      <p
        ref={bioRef}
        className="relative z-10 mt-6 max-w-[34rem] text-justify [text-shadow:0_1px_14px_#000,0_0_4px_#000] lg:[text-shadow:none] text-[1.05rem] leading-[1.45] text-grey-2/75 [text-indent:4.5rem] [&_*]:[text-indent:0] lg:absolute lg:left-[var(--edge)] lg:top-[29.5vh] lg:mt-0 lg:w-[calc(2*var(--col-w))] lg:max-w-none lg:text-[clamp(1rem,1.32vw,1.5rem)] lg:[text-indent:calc(var(--col-w)+0.8rem)]"
      >
        {bioSegments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
          </span>
        ))}
      </p>

      {/* Name block */}
      <div className="relative z-10 mt-auto pt-16 lg:absolute lg:inset-x-0 lg:bottom-[5.5vh] lg:mt-0 lg:pt-0">
        <span
          ref={tagRef}
          className="tag mb-4 bg-lime text-ink [clip-path:inset(0_100%_0_0)] lg:absolute lg:left-[var(--edge)] lg:top-[1.4vh] lg:mb-0"
          style={{ fontSize: "0.8rem" }}
        >
          <Scramble ref={tagText} text={SITE.role} preset="label" nowrap />
        </span>

        <h1 className="display font-light text-white text-[clamp(4.4rem,19vw,9rem)] lg:text-[min(10.6vw,19vh)] lg:leading-[0.8]">
          <span className="block lg:ml-[var(--col-w)]">
            <Scramble ref={first} text={SITE.firstName} preset="display" nowrap />
          </span>
          <span className="block lg:mt-[0.06em] lg:flex lg:items-end">
            <Scramble ref={last} text={SITE.lastName} preset="display" nowrap />
            <span className="hud mb-[0.35em] ml-[1.6vw] hidden text-[0.8rem] font-medium text-grey-1 lg:block">
              <Scramble ref={(r) => { captions.current[1] = r; }} text={HERO.captionRight} preset="label" nowrap />
            </span>
          </span>
        </h1>

        <span className="hud mt-3 block text-[0.8rem] text-grey-1 lg:absolute lg:left-[var(--edge)] lg:top-[38%] lg:mt-0">
          <Scramble ref={(r) => { captions.current[0] = r; }} text={HERO.captionLeft} preset="label" nowrap />
          <span className="lg:hidden"> {HERO.captionRight}</span>
        </span>

        <span className="absolute bottom-0 right-0 hidden overflow-hidden lg:left-[calc(var(--edge)+3*var(--col-w))] lg:right-auto lg:block">
          <span data-slide className="flex items-end gap-2 font-heading text-[clamp(1.8rem,2.8vw,3.2rem)] font-medium leading-none text-white">
            <span className="hud pb-1.5 text-[0.7rem] text-grey-1">{HERO.badgeLabel}</span>
            {HERO.badge}
          </span>
        </span>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-[5.5vh] right-[calc(var(--edge)-0.4rem)] hidden overflow-hidden lg:block">
        <div data-slide className="flex flex-col items-center gap-3">
          <span className="hud text-[0.7rem] text-grey-1 [writing-mode:vertical-rl]">Scroll down</span>
          <PixelArrowDown className="h-3 w-3 text-grey-1" />
        </div>
      </div>
    </div>
  );
});

export default HeroScene;
