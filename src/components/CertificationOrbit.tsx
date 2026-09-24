"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import GlitchText from "./GlitchText";
import { CERTIFICATIONS } from "@/data/certifications";

type Cert = (typeof CERTIFICATIONS)[number];

const RING_1_COUNT = 9;
const RING_1_RADIUS = 26; // % of container
const RING_2_RADIUS = 44;

const INFLUENCE_PX = 180; // dock-effect radius of influence
const MAX_SCALE = 2.3;

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
    const angle =
      (2 * Math.PI * i) / ring2.length -
      Math.PI / 2 +
      Math.PI / ring2.length;
    positions.push({
      x: round(50 + RING_2_RADIUS * Math.cos(angle)),
      y: round(50 + RING_2_RADIUS * Math.sin(angle)),
    });
  });

  return positions;
}

const POSITIONS = buildPositions();

export default function CertificationOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const [selected, setSelected] = useState<Cert | null>(null);
  const [phase, setPhase] = useState<"name" | "description">("name");

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
    };
  }, []);

  const handleSelect = (cert: Cert) => {
    setSelected(cert);
    setPhase("name");
    const nameDuration = cert.title.length * 10 + 900;
    window.setTimeout(() => setPhase("description"), nameDuration);
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[1500px]"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {POSITIONS.map((pos, i) => (
          <line
            key={i}
            x1={50}
            y1={50}
            x2={pos.x}
            y2={pos.y}
            stroke="currentColor"
            strokeWidth={0.15}
            className="text-white/10"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Center */}
      <div
        className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-background p-6 text-center md:h-56 md:w-56 lg:h-64 lg:w-64 xl:h-80 xl:w-80"
      >
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-muted md:text-sm">
                <GlitchText text="Certifications" />
              </p>
              <p className="mt-2 text-4xl font-black text-accent md:text-5xl xl:text-6xl">
                <GlitchText text={String(CERTIFICATIONS.length)} />
              </p>
            </motion.div>
          ) : phase === "name" ? (
            <motion.p
              key={`${selected.title}-name`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-base font-semibold leading-snug md:text-lg xl:text-xl"
            >
              <GlitchText
                text={selected.title}
                tickMs={18}
                lockEvery={1}
                charsPerTick={2}
                scrambleTail
                mixColors
              />
            </motion.p>
          ) : (
            <motion.p
              key={`${selected.title}-desc`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs leading-relaxed text-foreground/80 md:text-sm xl:text-base"
            >
              <GlitchText
                text={`${selected.blurb} — ${selected.issuer} · ${selected.date}.`}
                tickMs={18}
                lockEvery={1}
                charsPerTick={2}
                scrambleTail
                mixColors
              />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bubbles */}
      {CERTIFICATIONS.map((cert, i) => {
        const pos = POSITIONS[i];
        const isActive = selected?.title === cert.title;
        return (
          <div
            key={cert.title}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div
              className="animate-[float-bob_3.5s_ease-in-out_infinite]"
              style={{ animationDelay: `${(i % 7) * 0.4}s` }}
            >
              <button
                ref={(el) => {
                  bubbleRefs.current[i] = el;
                }}
                type="button"
                onClick={() => handleSelect(cert)}
                style={{ transform: "scale(1)" }}
                className={`group relative flex h-16 w-16 items-center justify-center rounded-xl border-2 p-2.5 shadow-lg transition-colors md:h-20 md:w-20 lg:h-24 lg:w-24 ${
                  isActive
                    ? "border-accent bg-white"
                    : "border-white/15 bg-white hover:border-accent"
                }`}
              >
                {cert.logo.type === "image" ? (
                  <Image
                    src={cert.logo.src}
                    alt={`${cert.title} logo`}
                    fill
                    unoptimized
                    className="object-contain p-2 md:p-2.5"
                  />
                ) : (
                  <span className="text-sm font-black uppercase tracking-tight text-background md:text-base">
                    {cert.logo.text}
                  </span>
                )}

                <span className="pointer-events-none absolute left-1/2 top-full mt-2 w-max max-w-[160px] -translate-x-1/2 text-center text-[10px] font-medium uppercase leading-tight tracking-wide text-muted opacity-0 transition-opacity group-hover:opacity-100 md:text-xs">
                  {cert.title}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
