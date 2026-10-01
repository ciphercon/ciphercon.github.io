"use client";

import { useEffect } from "react";
import { registerAnchor } from "@/lib/store";
import { VIDEOS, VLOGS_COPY } from "@/data/vlogs";
import Scramble from "@/components/ui/Scramble";
import PixelEdge from "@/components/fx/PixelEdge";
import GridLines from "@/components/chrome/GridLines";
import { WorkCard } from "@/components/stage/SelectedWork";

/** Lime section: interviews and talks, styled like the work cards. */
export default function Vlogs() {
  useEffect(() => {
    const el = document.getElementById("vlogs");
    if (!el) return;
    return registerAnchor("vlogs", () => el.getBoundingClientRect().top + window.scrollY);
  }, []);

  return (
    <section id="vlogs" data-surface="lime" className="on-lime relative bg-lime px-[var(--edge)] pb-32 pt-24 lg:pb-44 lg:pt-32">
      <PixelEdge color="#9df133" />
      <GridLines tone="lime" edgesOnly />

      <div className="relative max-w-[calc(var(--col-w)*2)]">
        <span className="tag bg-[#0b0c0a] text-lime">
          <Scramble text={VLOGS_COPY.tag} trigger="inview" preset="label" nowrap />
        </span>
        <h2 className="display mt-5 font-medium text-[#4a1fb8] text-[clamp(3.2rem,13vw,5rem)] lg:text-[min(5.4vw,9.4vh)]">
          {VLOGS_COPY.title.map((line, i) => (
            <Scramble key={line} text={line} trigger="inview" preset="display" delay={i * 160} block nowrap />
          ))}
        </h2>
        <p className="mt-6 max-w-[22rem] text-[0.95rem] text-[#2f4a0e]">{VLOGS_COPY.subtitle}</p>
      </div>

      <div className="relative mt-16 grid grid-cols-1 gap-14 sm:grid-cols-2 lg:mt-[-6vh] lg:grid-cols-3 lg:gap-x-[3vw] lg:pl-[calc(var(--col-w)*0.6)]">
        {VIDEOS.map((v, i) => (
          <WorkCard
            key={v.id}
            ratio={16 / 9}
            project={{ title: v.title, tag: v.channel, href: v.href }}
            cta="Watch"
            titleClassName="font-sans text-[0.95rem] font-medium leading-snug text-ink"
            className={i === 0 ? "lg:mt-[18vh]" : i === 1 ? "lg:mt-[34vh]" : "lg:mt-[4vh]"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`}
              alt=""
              decoding="async"
              fetchPriority="low"
              className="h-full w-full object-cover transition-[filter] duration-300 group-hover:brightness-110"
            />
          </WorkCard>
        ))}
      </div>
    </section>
  );
}
