"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { gsap, prefersReducedMotion, DESKTOP_QUERY } from "@/lib/gsap";
import { scrollToY } from "@/lib/store";
import { LEFT_COUNT, POSITIONS } from "@/data/experience";
import Scramble, { type ScrambleRef } from "@/components/ui/Scramble";
import GlitchCanvas, { type GlitchCanvasRef } from "@/components/fx/GlitchCanvas";
import { cn } from "@/lib/cn";
import type { SceneRef } from "./types";

function Plus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 11 11" className={cn("absolute h-[11px] w-[11px] text-grey-1", className)} aria-hidden="true">
      <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function Row({
  index,
  active,
  onSelect,
  side,
}: {
  index: number;
  active: boolean;
  onSelect: () => void;
  side: "left" | "right";
}) {
  const p = POSITIONS[index];
  const nameRef = useRef<ScrambleRef>(null);
  return (
    <button
      type="button"
      data-row={side}
      onClick={onSelect}
      onPointerEnter={() => nameRef.current?.glitch()}
      aria-pressed={active}
      className="chamfer-row group relative block h-[clamp(4.25rem,8vh,5.5rem)] w-full text-left"
    >
      <span className={cn("chamfer-row absolute inset-0 transition-colors duration-300", active ? "bg-cream" : "bg-[#1a1b20]")} />
      <span
        className={cn(
          "chamfer-row absolute inset-px transition-colors duration-300",
          active ? "bg-cream" : "bg-[#050506] group-hover:bg-[#0d0e10]"
        )}
      />
      <span className="relative flex h-full items-center gap-[clamp(0.9rem,1.6vw,2rem)] pl-[clamp(1rem,1.5vw,1.5rem)] pr-4">
        <span className={cn("hud text-[0.8rem] transition-colors", active ? "text-grey-1" : "text-grey-1")}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <span
            className={cn(
              "block font-heading text-[clamp(1rem,1.3vw,1.45rem)] font-medium uppercase leading-[1.05] transition-colors",
              active ? "text-ink" : "text-white"
            )}
          >
            <Scramble ref={nameRef} text={p.company} initiallyVisible preset="label" nowrap />
          </span>
          <span className="mt-1 block truncate font-heading text-[0.66rem] font-bold uppercase leading-tight tracking-[0.13em] text-grey-1">
            {p.role}
          </span>
        </span>
      </span>
    </button>
  );
}

const WorkedAt = forwardRef<SceneRef>(function WorkedAt(_, ref) {
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<ScrambleRef>(null);
  const tagTextRef = useRef<ScrambleRef>(null);
  const descRef = useRef<ScrambleRef>(null);
  const glitchRef = useRef<GlitchCanvasRef>(null);
  const firstRender = useRef(true);
  const position = POSITIONS[active];

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    glitchRef.current?.glitch(420);
    descRef.current?.play();
  }, [active]);

  useImperativeHandle(ref, () => ({
    show: async () => {
      const root = rootRef.current;
      if (!root) return;
      setLive(true);
      gsap.set(root, { autoAlpha: 1 });
      const reduce = prefersReducedMotion();
      const left = root.querySelectorAll("[data-row='left']");
      const right = root.querySelectorAll("[data-row='right']");
      gsap.fromTo(left, { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: reduce ? 0 : 0.7, ease: "expo.out", stagger: 0.06, delay: 0.1 });
      gsap.fromTo(right, { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: reduce ? 0 : 0.7, ease: "expo.out", stagger: 0.06, delay: 0.1 });
      gsap.fromTo(frameRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: reduce ? 0 : 0.6, ease: "power3.out", delay: 0.15 });
      gsap.fromTo(tagRef.current, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: reduce ? 0 : 0.5, ease: "power3.out" });
      glitchRef.current?.glitch(600);
      await Promise.all([
        tagTextRef.current?.play(),
        titleRef.current?.play({ delay: 120, flicker: true }),
        descRef.current?.play({ delay: 380 }),
      ]);
    },
    hide: async () => {
      await Promise.all([titleRef.current?.reverse(), tagTextRef.current?.reverse(), descRef.current?.reverse()]);
    },
    reset: () => {
      const root = rootRef.current;
      if (!root) return;
      setLive(false);
      gsap.set(root.querySelectorAll("[data-row]"), { opacity: 0 });
      gsap.set(frameRef.current, { opacity: 0 });
      gsap.set(tagRef.current, { clipPath: "inset(0 100% 0 0)" });
      titleRef.current?.hide();
      tagTextRef.current?.hide();
      descRef.current?.hide();
    },
  }));

  const select = (i: number) => {
    setActive(i);
    // Stacked layout: the logo frame sits above the list, bring it into view.
    const frame = frameRef.current;
    if (frame && !window.matchMedia(DESKTOP_QUERY).matches) {
      const r = frame.getBoundingClientRect();
      const header = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.25;
      if (r.top < header || r.bottom > window.innerHeight) {
        scrollToY(window.scrollY + r.top - header - 16);
      }
    }
  };

  const rows = (from: number, to: number, side: "left" | "right") =>
    POSITIONS.slice(from, to).map((_, k) => {
      const i = from + k;
      return <Row key={i} index={i} side={side} active={active === i} onSelect={() => select(i)} />;
    });

  return (
    <div
      ref={rootRef}
      id="experience"
      className="invisible relative flex flex-col px-[var(--edge)] pb-24 pt-[calc(var(--header-h)+3rem)] lg:absolute lg:inset-0 lg:block lg:p-0"
    >
      <div className="order-1 flex flex-col items-center text-center lg:absolute lg:inset-x-0 lg:top-[calc(var(--header-h)+4.5vh)]">
        <span ref={tagRef} className="tag bg-lime text-ink [clip-path:inset(0_100%_0_0)]">
          <Scramble ref={tagTextRef} text="I've been" preset="label" nowrap />
        </span>
        <h2 className="display mt-3 font-medium text-white text-[clamp(3rem,12vw,4.5rem)] lg:mt-[1.6vh] lg:text-[min(5.8vw,10vh)]">
          <Scramble ref={titleRef} text="Worked at" preset="display" nowrap />
        </h2>
      </div>

      <div className="order-4 mt-12 flex flex-col max-lg:mx-auto max-lg:w-full max-lg:max-w-[40rem] gap-[1.3vh] lg:absolute lg:left-[var(--edge)] lg:top-[31.5vh] lg:mt-0 lg:w-[calc(var(--col-w)-0.75rem)]">
        {rows(0, LEFT_COUNT, "left")}
      </div>

      <div className="order-5 mt-[1.3vh] flex flex-col max-lg:mx-auto max-lg:w-full max-lg:max-w-[40rem] gap-[1.3vh] lg:absolute lg:right-[var(--edge)] lg:top-[31.5vh] lg:mt-0 lg:w-[calc(var(--col-w)-0.75rem)]">
        {rows(LEFT_COUNT, POSITIONS.length, "right")}
      </div>

      <div
        ref={frameRef}
        className="relative order-2 mt-12 aspect-[16/10] w-full max-lg:mx-auto max-lg:w-full max-lg:max-w-[40rem] border border-stroke-1 opacity-0 lg:absolute lg:left-1/2 lg:top-[31.5vh] lg:mt-0 lg:aspect-auto lg:h-[42vh] lg:w-[min(39vw,calc(var(--col-w)*2.05))] lg:-translate-x-1/2"
      >
        <Plus className="-left-[6px] -top-[6px]" />
        <Plus className="-right-[6px] -top-[6px]" />
        <Plus className="-bottom-[6px] -left-[6px]" />
        <Plus className="-bottom-[6px] -right-[6px]" />
        <span className="hud absolute left-3 top-2.5 text-[0.68rem] text-grey-1">
          {String(active + 1).padStart(2, "0")} / {String(POSITIONS.length).padStart(2, "0")}
        </span>
        <span className="hud absolute bottom-2.5 right-3 text-[0.68rem] text-grey-1">{position.period}</span>
        <GlitchCanvas
          ref={glitchRef}
          mode="logo"
          active={live}
          source={{ kind: "logo", src: position.logo, text: position.company }}
          className="absolute inset-[12%_14%] h-[76%] w-[72%]"
          every={[3.2, 7]}
        />
      </div>

      <p className="order-3 mx-auto mt-8 max-w-[36rem] text-center text-[1rem] leading-[1.55] text-grey-2/70 lg:absolute lg:left-1/2 lg:top-[calc(31.5vh+42vh+3.2vh)] lg:mt-0 lg:w-[min(38vw,40rem)] lg:max-w-none lg:-translate-x-1/2 lg:text-[clamp(0.95rem,1.12vw,1.15rem)]">
        <Scramble ref={descRef} text={position.description} preset="para" block />
      </p>
    </div>
  );
});

export default WorkedAt;
