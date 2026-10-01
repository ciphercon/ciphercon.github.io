"use client";

import { useEffect, useRef, useState } from "react";
import { CARD_SIZE, PROJECTS, type Project } from "@/data/projects";
import { SELECTED_WORK } from "@/data/site";
import Cover from "@/components/covers/Cover";
import PixelReveal from "@/components/fx/PixelReveal";
import Scramble from "@/components/ui/Scramble";
import { ArrowUpRight } from "@/components/ui/Glyphs";
import { cn } from "@/lib/cn";
import { DESKTOP_QUERY } from "@/lib/gsap";

/** Track units → CSS. `u` shrinks on short screens so cards always fit. */
const u = (n: number) => `calc(${n} * var(--u))`;

/** Width of the whole work canvas, in track units. */
export const WORK_WIDTH = Math.max(...PROJECTS.map((p) => p.x + CARD_SIZE[p.size].w)) + 22;

function Corners() {
  const base = "absolute h-[9px] w-[9px] text-lime-deep/70";
  const plus = (
    <svg viewBox="0 0 9 9" className="h-full w-full" aria-hidden="true">
      <path d="M4.5 0v9M0 4.5h9" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
  return (
    <>
      <span className={cn(base, "-left-[5px] -top-[5px]")}>{plus}</span>
      <span className={cn(base, "-right-[5px] -top-[5px]")}>{plus}</span>
      <span className={cn(base, "-bottom-[5px] -left-[5px]")}>{plus}</span>
      <span className={cn(base, "-bottom-[5px] -right-[5px]")}>{plus}</span>
    </>
  );
}

export function WorkCard({
  project,
  ratio,
  style,
  className,
  revealCover = "#9df133",
  cta = "Visit",
  titleClassName,
  children,
}: {
  project: Pick<Project, "title" | "tag" | "highlight" | "href">;
  ratio: number;
  style?: React.CSSProperties;
  className?: string;
  /** Surface colour the cover hides behind before its pixel reveal. */
  revealCover?: string;
  cta?: string;
  titleClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      data-card
      style={style}
      className={cn("group block", className)}
    >
      <div className="relative w-full" style={{ aspectRatio: String(ratio) }}>
        <div className="absolute inset-0 overflow-hidden">{children}</div>
        <PixelReveal cover={revealCover} className="absolute inset-0 h-full w-full" />
        <span
          className={cn(
            "tag absolute bottom-[6%] left-[4%] bg-[#111311] text-[0.68rem] transition-colors duration-300 group-hover:bg-purple",
            project.highlight ? "text-red group-hover:text-white" : "text-lime"
          )}
        >
          {project.tag}
        </span>
        <Corners />
      </div>
      <div className="mt-2.5 flex items-baseline justify-between gap-4">
        <h3
          className={
            titleClassName ??
            "font-heading text-[clamp(1.05rem,1.35vw,1.6rem)] font-medium uppercase leading-tight text-ink"
          }
        >
          {project.title}
        </h3>
        <span className="hud flex shrink-0 items-center gap-1 text-[0.72rem] text-lime-deep transition-colors group-hover:text-purple">
          {cta} <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}

type Rect = { x: number; y: number; w: number; h: number; top: number };

/** Builds the circuit traces between cards (desktop only). */
function useTraces(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [paths, setPaths] = useState<{ d: string[]; hub: [number, number] | null; size: [number, number] }>({
    d: [],
    hub: null,
    size: [0, 0],
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      if (!window.matchMedia(DESKTOP_QUERY).matches) {
        setPaths({ d: [], hub: null, size: [0, 0] });
        return;
      }
      const cards = [...el.querySelectorAll<HTMLElement>("[data-card]")];
      const rects: Rect[] = cards.map((c, i) => {
        const cover = c.firstElementChild as HTMLElement;
        return {
          x: c.offsetLeft,
          y: c.offsetTop,
          w: cover.offsetWidth,
          h: cover.offsetHeight,
          top: PROJECTS[i].top,
        };
      });
      const midY = (r: Rect) => r.y + r.h * 0.5;
      const jog = (x1: number, y1: number, x2: number, y2: number) => {
        const dy = y2 - y1;
        const gap = x2 - x1;
        const run = Math.min(Math.abs(dy), Math.max(0, gap - 24));
        const xm = x1 + (gap - run) / 2;
        const ySlope = Math.abs(dy) > run ? dy : Math.sign(dy) * run;
        // Horizontal, 45° (or steeper) jog, horizontal.
        return `M${x1} ${y1}H${xm}L${xm + run} ${y1 + ySlope}${
          Math.abs(dy) > run ? `V${y2}` : ""
        }H${x2}`;
      };

      const upper = rects.filter((r) => r.top < 40).sort((a, b) => a.x - b.x);
      const lower = rects.filter((r) => r.top >= 40).sort((a, b) => a.x - b.x);
      const d: string[] = [];
      for (const chain of [upper, lower]) {
        for (let i = 0; i < chain.length - 1; i++) {
          const a = chain[i];
          const b = chain[i + 1];
          d.push(jog(a.x + a.w, midY(a), b.x, midY(b)));
        }
      }
      let hub: [number, number] | null = null;
      if (upper[0] && lower[0]) {
        const L = lower[0];
        const U = upper[0];
        const hx = L.x + L.w * 0.52;
        const hy = Math.max(midY(U) + 40, L.y - el.offsetHeight * 0.1);
        hub = [hx, hy];
        d.push(`M${hx} ${hy}V${L.y}`);
        d.push(jog(hx, hy, U.x, midY(U)));
        // Lead-ins arriving from the gap before the canvas.
        const lead = Math.min(el.offsetLeft, 260);
        d.push(`M${-lead} ${midY(L)}H${L.x}`);
        d.push(`M${-lead * 0.7} ${hy + 46}H${hx - 76}L${hx - 30} ${hy}`);
      }
      const last = [...rects].sort((a, b) => b.x + b.w - (a.x + a.w))[0];
      if (last) d.push(`M${last.x + last.w} ${midY(last)}H${el.offsetWidth}`);
      setPaths({ d, hub, size: [el.offsetWidth, el.offsetHeight] });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return paths;
}

export default function SelectedWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { d, hub, size } = useTraces(containerRef);

  return (
    <div
      ref={containerRef}
      id="work"
      className="on-lime relative px-[var(--edge)] pb-24 pt-10 lg:h-full lg:shrink-0 lg:p-0"
      style={{ ["--work-w" as string]: u(WORK_WIDTH) }}
    >
      <div aria-hidden="true" className="hidden lg:block lg:h-full lg:w-[var(--work-w)]" />

      {size[0] > 0 && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 hidden overflow-visible lg:block"
          width={size[0]}
          height={size[1]}
        >
          {d.map((p, i) => (
            <path key={i} d={p} fill="none" stroke="var(--lime-path)" strokeWidth="2" />
          ))}
          {hub && (
            <rect
              x={hub[0] - 7}
              y={hub[1] - 7}
              width={14}
              height={14}
              transform={`rotate(45 ${hub[0]} ${hub[1]})`}
              fill="var(--lime)"
              stroke="var(--lime-path)"
              strokeWidth="2"
            />
          )}
        </svg>
      )}

      {/* Section header */}
      <div className="relative lg:absolute lg:left-[var(--edge)] lg:top-[calc(var(--header-h)+5vh)] lg:w-[calc(var(--col-w)*1.4)]">
        <span className="tag bg-[#0b0c0a] text-lime">
          <Scramble text={SELECTED_WORK.tag} trigger="inview" preset="label" nowrap />
        </span>
        <h2 className="display mt-5 font-medium text-[#4a1fb8] text-[clamp(3.2rem,13vw,5rem)] lg:text-[min(5.4vw,9.4vh)]">
          {SELECTED_WORK.title.map((line, i) => (
            <Scramble key={line} text={line} trigger="inview" preset="display" delay={i * 160} block nowrap />
          ))}
        </h2>
        <p className="mt-6 max-w-[22rem] text-[0.95rem] text-[#2f4a0e]">{SELECTED_WORK.subtitle}</p>
        <a
          href={SELECTED_WORK.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="bracket mt-7 inline-block border border-lime-box-stroke bg-lime-soft px-6 py-3 font-heading text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-ink transition-colors [--bk:var(--red)] hover:bg-ink hover:text-lime"
        >
          {SELECTED_WORK.cta.label}
        </a>
      </div>

      {/* Cards */}
      <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:mt-0 lg:block">
        {PROJECTS.map((p) => {
          const size = CARD_SIZE[p.size];
          return (
            <WorkCard
              key={p.title}
              project={p}
              className="lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:w-[var(--w)]"
              style={
                {
                  "--x": u(p.x),
                  "--y": `${p.top}vh`,
                  "--w": u(size.w),
                } as React.CSSProperties
              }
              ratio={size.ratio}
            >
              <Cover variant={p.cover} className="h-full w-full transition-[filter] duration-300 group-hover:brightness-125" />
            </WorkCard>
          );
        })}
      </div>
    </div>
  );
}
