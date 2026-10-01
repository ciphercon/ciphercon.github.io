"use client";

import { useEffect, useRef, useState } from "react";
import { CERTIFICATIONS } from "@/data/certifications";
import Scramble from "@/components/ui/Scramble";
import { cn } from "@/lib/cn";

type Cert = (typeof CERTIFICATIONS)[number];

const RING_1_COUNT = 9;
const RING_1_RADIUS = 23; // % of container
const RING_2_RADIUS = 39;

const INFLUENCE_PX = 140; // dock-effect radius of influence
const MAX_SCALE = 1.5;

// Math.cos/sin aren't guaranteed bit-identical across JS engine builds
// (Node on the server vs the browser's V8 on the client), which caused a
// hydration mismatch on the last decimal digit. Rounding to a fixed
// precision guarantees the server and client strings always match.
function round(n: number) {
  return Math.round(n * 10000) / 10000;
}

function buildPositions() {
  const ring1 = CERTIFICATIONS.slice(0, RING_1_COUNT);
  const ring2 = CERTIFICATIONS.slice(RING_1_COUNT);
  const positions: { x: number; y: number }[] = [];

  ring1.forEach((_, i) => {
    const angle = (2 * Math.PI * i) / ring1.length - Math.PI / 2;
    positions.push({
      x: round(50 + RING_1_RADIUS * Math.cos(angle)),
      y: round(50 + RING_1_RADIUS * Math.sin(angle)),
    });
  });

  ring2.forEach((_, i) => {
    const angle = (2 * Math.PI * i) / ring2.length - Math.PI / 2 + Math.PI / ring2.length;
    positions.push({
      x: round(50 + RING_2_RADIUS * Math.cos(angle)),
      y: round(50 + RING_2_RADIUS * Math.sin(angle)),
    });
  });

  return positions;
}

const POSITIONS = buildPositions();

/**
 * Certifications as an orbit of chamfered tiles around a HUD core. Tiles
 * magnify near the cursor (dock effect); clicking one types its name into
 * the core, then its blurb, while a data line pulses out to the tile.
 */
export default function CertificationOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<"name" | "description">("name");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const applyScale = (mouseX: number | null, mouseY: number | null) => {
      const containerRect = container.getBoundingClientRect();
      bubbleRefs.current.forEach((el) => {
        if (!el) return;
        let scale = 1;
        if (mouseX !== null && mouseY !== null) {
          const r = el.getBoundingClientRect();
          const bx = r.left + r.width / 2 - containerRect.left;
          const by = r.top + r.height / 2 - containerRect.top;
          const dist = Math.hypot(mouseX - bx, mouseY - by);
          if (dist < INFLUENCE_PX) {
            scale = 1 + (MAX_SCALE - 1) * (1 - dist / INFLUENCE_PX);
          }
        }
        el.style.transform = `scale(${scale})`;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => applyScale(mouseX, mouseY));
    };

    const handleMouseLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => applyScale(null, null));
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleSelect = (i: number) => {
    const cert = CERTIFICATIONS[i];
    setSelected(i);
    setPhase("name");
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const nameDuration = cert.title.length * 22 + 900;
    timerRef.current = window.setTimeout(() => setPhase("description"), nameDuration);
  };

  const cert: Cert | null = selected === null ? null : CERTIFICATIONS[selected];

  return (
    <div ref={containerRef} className="relative mx-auto aspect-square w-full max-w-[min(1200px,108vh)]">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[RING_1_RADIUS, RING_2_RADIUS].map((r) => (
          <circle key={r} cx={50} cy={50} r={r} fill="none" stroke="#16171c" strokeWidth={0.15} vectorEffect="non-scaling-stroke" />
        ))}
        {POSITIONS.map((pos, i) => (
          <line
            key={i}
            x1={50}
            y1={50}
            x2={pos.x}
            y2={pos.y}
            stroke={selected === i ? "var(--lime)" : "#1d1e24"}
            strokeWidth={selected === i ? 1.5 : 1}
            strokeDasharray={selected === i ? "3 7" : undefined}
            vectorEffect="non-scaling-stroke"
            className={selected === i ? "animate-[dash-flow_0.9s_linear_infinite]" : undefined}
          />
        ))}
      </svg>

      {/* Core */}
      <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-stroke-1 bg-black p-[3%] text-center">
        <svg viewBox="0 0 100 100" className="absolute inset-[-7%] h-[114%] w-[114%] animate-[spin_40s_linear_infinite]" aria-hidden="true">
          <circle cx={50} cy={50} r={49} fill="none" stroke="var(--lime-deep)" strokeWidth={0.4} strokeDasharray="1.5 3.5" />
        </svg>
        {cert === null ? (
          <div key="idle">
            <p className="hud text-[clamp(0.5rem,1vw,0.8rem)] text-grey-1">Certifications</p>
            <p className="display mt-[0.15em] font-medium text-lime text-[clamp(2rem,6vw,5.5rem)]">
              {CERTIFICATIONS.length}
            </p>
          </div>
        ) : phase === "name" ? (
          <p key={`${selected}-name`} className="font-heading font-semibold uppercase leading-tight text-white text-[clamp(0.6rem,1.6vw,1.4rem)]">
            <Scramble text={cert.title} trigger="inview" preset="label" />
          </p>
        ) : (
          <p key={`${selected}-desc`} className="leading-snug text-grey-2/80 text-[clamp(0.5rem,1.05vw,0.95rem)]">
            <Scramble text={`${cert.blurb} — ${cert.issuer} · ${cert.date}.`} trigger="inview" preset="para" />
          </p>
        )}
      </div>

      {/* Tiles */}
      {CERTIFICATIONS.map((c, i) => {
        const pos = POSITIONS[i];
        const isActive = selected === i;
        return (
          <div
            key={c.title}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="animate-[float-bob_3.5s_ease-in-out_infinite]" style={{ animationDelay: `${(i % 7) * 0.4}s` }}>
              <button
                ref={(el) => {
                  bubbleRefs.current[i] = el;
                }}
                type="button"
                onClick={() => handleSelect(i)}
                aria-label={`${c.title} — ${c.issuer}`}
                style={{ transform: "scale(1)" }}
                className="group relative flex h-10 w-10 items-center justify-center sm:h-14 sm:w-14 md:h-20 md:w-20 lg:h-[5.5rem] lg:w-[5.5rem]"
              >
                <span
                  className={cn(
                    "chamfer-row absolute inset-0 transition-colors duration-300",
                    isActive ? "bg-lime" : "bg-stroke-1 group-hover:bg-lime"
                  )}
                />
                <span
                  className={cn(
                    "chamfer-row absolute inset-[2px] transition-colors duration-300",
                    isActive ? "bg-lime" : "bg-cream"
                  )}
                />
                {c.logo.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logo.src} alt="" className="relative h-[62%] w-[62%] object-contain" />
                ) : (
                  <span className="relative font-heading text-[8px] font-bold uppercase text-ink sm:text-xs md:text-base">
                    {c.logo.text}
                  </span>
                )}
                <span className="hud pointer-events-none absolute left-1/2 top-full mt-2 w-max max-w-[150px] -translate-x-1/2 text-center text-[7px] leading-tight text-grey-1 opacity-0 transition-opacity group-hover:opacity-100 sm:text-[9px] md:text-[10px]">
                  {c.title}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
