"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { STATS_GRID, STATS_GRID_COLS, type GridCard } from "@/data/stats";
import Scramble, { type ScrambleRef } from "@/components/ui/Scramble";
import Odometer, { type OdometerRef } from "@/components/ui/Odometer";
import DotMatrix from "@/components/fx/DotMatrix";
import { cn } from "@/lib/cn";

export type StatsRef = { show: () => void; reset: () => void };

/**
 * Card outline: a notch cut into the left edge and a chamfered bottom-right
 * corner. `--cu` scales the notch with the card height.
 */
const SHAPE =
  "polygon(0 0, 100% 0, 100% calc(100% - 9 * var(--cu)), calc(100% - 9 * var(--cu)) 100%, 0 100%, 0 calc(132 * var(--cu)), calc(12 * var(--cu)) calc(120 * var(--cu)), calc(12 * var(--cu)) calc(60 * var(--cu)), 0 calc(48 * var(--cu)))";

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative h-full w-full", className)} style={{ clipPath: SHAPE }}>
      <div className="absolute inset-0 bg-lime-box-stroke" />
      <div
        className="absolute inset-[1.5px] bg-lime-box transition-colors duration-300 group-hover:bg-purple"
        style={{ clipPath: SHAPE }}
      />
      <span className="absolute left-[6%] top-[7%] aspect-square h-[7%] bg-lime opacity-0 transition-opacity duration-300 [clip-path:polygon(0_0,100%_0,0_100%)] group-hover:opacity-100" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function CardTitle({ label, setRef }: { label: string; setRef: (r: ScrambleRef | null) => void }) {
  return (
    <span className="hud-strong absolute right-[7%] top-[7.5%] text-[clamp(0.68rem,0.95vw,1rem)] text-ink transition-colors duration-300 group-hover:text-white">
      <Scramble ref={setRef} text={label} preset="label" nowrap />
    </span>
  );
}

function ToolCard({
  card,
  setTitle,
}: {
  card: Extract<GridCard, { type: "tool" }>;
  setTitle: (r: ScrambleRef | null) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="group h-full"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Shell>
        <CardTitle label={card.label} setRef={setTitle} />
        <DotMatrix
          source={card.icon}
          pitch={5}
          dot={0.7}
          color={hover ? "#efe9ff" : "#1f3a08"}
          edgeColor={hover ? "#b9a3ff" : "#3b6114"}
          align="start"
          className="absolute bottom-[9%] left-[7%] h-[36%] w-[60%]"
        />
      </Shell>
    </div>
  );
}

const StatsGrid = forwardRef<StatsRef>(function StatsGrid(_, ref) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(ScrambleRef | null)[]>([]);
  const odoRefs = useRef<(OdometerRef | null)[]>([]);

  useImperativeHandle(ref, () => ({
    show: () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.killTweensOf(cards);
      const reduce = prefersReducedMotion();
      // Random-ish order so the board "boots up" rather than wipes.
      const order = cards.map((_, i) => (i * 7 + 3) % cards.length);
      cards.forEach((c, i) => {
        gsap.fromTo(
          c,
          { opacity: 0 },
          { opacity: 1, duration: reduce ? 0 : 0.45, delay: reduce ? 0 : order[i] * 0.05, ease: "steps(4)" }
        );
      });
      titleRefs.current.forEach((t, i) => t?.play({ delay: 120 + i * 50 }));
      odoRefs.current.forEach((o, i) => o?.play(200 + i * 90));
    },
    reset: () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.killTweensOf(cards);
      gsap.set(cards, { opacity: 0 });
      titleRefs.current.forEach((t) => t?.hide());
      odoRefs.current.forEach((o) => o?.reset());
    },
  }));

  return (
    <div
      id="stats"
      className="on-lime relative grid grid-cols-2 gap-2 px-[var(--edge)] py-16 [--card-h:calc((100vw-2*var(--edge)-0.5rem)/2/1.2)] [--cu:calc(var(--card-h)/230)] sm:grid-cols-3 sm:[--card-h:calc((100vw-2*var(--edge)-1rem)/3/1.2)] min-[56.25rem]:grid-cols-5 min-[56.25rem]:[--card-h:calc((100vw-2*var(--edge)-2rem)/5/1.2)] lg:block lg:h-full lg:shrink-0 lg:p-0 lg:[--card-h:min(calc(var(--col-w)/1.2),calc((100vh-var(--header-h)-4rem)/3))] lg:[--grid-top:calc(var(--header-h)+2rem+(100vh-var(--header-h)-4rem-3*var(--card-h))/2)]"
    >
      <div
        aria-hidden="true"
        className="hidden lg:block"
        style={{ width: `calc(2 * var(--edge) + ${STATS_GRID_COLS} * var(--col-w))` }}
      />
      {STATS_GRID.map((card, i) => {
        const pos = {
          "--l": `calc(var(--edge) + ${card.col} * var(--col-w))`,
          "--t": `calc(var(--grid-top) + ${card.row} * var(--card-h))`,
        } as React.CSSProperties;
        const setTitle = (r: ScrambleRef | null) => {
          titleRefs.current[i] = r;
        };
        return (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={cn(
              "relative h-[var(--card-h)] opacity-0 lg:absolute lg:left-[var(--l)] lg:top-[var(--t)] lg:w-[var(--col-w)]",
              card.type === "logo" && "max-lg:hidden"
            )}
            style={pos}
          >
            {card.type === "stat" && (
              <div className="group h-full">
                <Shell>
                  <CardTitle label={card.label} setRef={setTitle} />
                  <Odometer
                    ref={(r) => {
                      odoRefs.current[i] = r;
                    }}
                    value={card.value}
                    className="absolute bottom-[9%] left-[7%] font-heading font-medium text-ink transition-colors duration-300 group-hover:text-white text-[calc(var(--card-h)*0.4)]"
                  />
                </Shell>
              </div>
            )}
            {card.type === "tool" && <ToolCard card={card} setTitle={setTitle} />}
            {card.type === "logo" && (
              <div className="flex h-full items-center justify-center">
                <DotMatrix
                  source={{ kind: "glyph", name: "mark" }}
                  pitch={9}
                  dot={0.66}
                  shape="square"
                  chroma
                  color="#4a14b8"
                  className="h-[72%] w-[72%]"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default StatsGrid;
