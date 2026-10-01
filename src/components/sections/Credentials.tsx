"use client";

import { useEffect } from "react";
import { registerAnchor } from "@/lib/store";
import { EDUCATION } from "@/data/education";
import { ABOUT, SKILLS } from "@/data/skills";
import Scramble from "@/components/ui/Scramble";
import PixelEdge from "@/components/fx/PixelEdge";
import DotHalo from "@/components/fx/DotHalo";
import GridLines from "@/components/chrome/GridLines";
import CertificationOrbit from "./CertificationOrbit";

function Heading({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="tag bg-lime text-ink">
        <Scramble text={tag} trigger="inview" preset="label" nowrap />
      </span>
      <h2 className="display mt-3 font-medium text-white text-[clamp(3rem,12vw,4.5rem)] lg:text-[min(5.8vw,10vh)]">
        <Scramble text={title} trigger="inview" preset="display" delay={120} nowrap />
      </h2>
    </div>
  );
}

/** Dark section: education rows, then the certifications orbit. */
export default function Credentials() {
  useEffect(() => {
    const el = document.getElementById("credentials");
    if (!el) return;
    const offs = [
      registerAnchor("credentials", () => el.getBoundingClientRect().top + window.scrollY),
      registerAnchor("contact", () => document.documentElement.scrollHeight - window.innerHeight),
    ];
    return () => offs.forEach((o) => o());
  }, []);

  return (
    <section id="credentials" data-surface="dark" className="relative bg-black px-[var(--edge)] pb-28 pt-28 lg:pb-40 lg:pt-36">
      <PixelEdge color="#000000" />
      <GridLines tone="dark" edgesOnly />
      <DotHalo className="pointer-events-none absolute inset-0 h-full w-full max-lg:hidden" />

      <div className="relative">
        <Heading tag="What I do" title="Expertise" />
        <p className="mx-auto mt-10 max-w-[44rem] text-center text-[1.05rem] leading-[1.6] text-grey-2/75 lg:text-[clamp(1rem,1.2vw,1.25rem)]">
          <Scramble text={ABOUT} trigger="inview" preset="para" block />
        </p>
        <ul className="mx-auto mt-10 flex max-w-[52rem] flex-wrap justify-center gap-2.5">
          {SKILLS.map((skill, i) => (
            <li key={skill} className="chamfer-row relative">
              <span className="chamfer-row absolute inset-0 bg-[#24262c]" />
              <span className="chamfer-row absolute inset-px bg-[#08090a]" />
              <span className="hud-strong relative block px-5 py-3 text-[0.72rem] text-grey-2">
                <Scramble text={skill} trigger="inview" preset="label" delay={i * 60} nowrap />
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-28 lg:mt-36">
          <Heading tag="I've studied" title="Education" />
        </div>
        <div className="mx-auto mt-12 grid max-w-[calc(var(--col-w)*3.2)] grid-cols-1 gap-4 md:grid-cols-2">
          {EDUCATION.map((e, i) => (
            <article key={e.school} className="chamfer-row relative min-h-[9.5rem]">
              <span className="chamfer-row absolute inset-0 bg-[#1a1b20]" />
              <span className="chamfer-row absolute inset-px bg-[#050506]" />
              <div className="relative flex h-full gap-5 px-6 py-6">
                <span className="hud text-[0.8rem] text-grey-1">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-heading text-[clamp(1.15rem,1.5vw,1.6rem)] font-medium uppercase leading-tight text-white">
                    <Scramble text={e.school} trigger="inview" preset="label" delay={i * 120} />
                  </h3>
                  <p className="hud-strong mt-1.5 text-[0.7rem] text-lime">{e.program}</p>
                  <p className="mt-3 text-[0.9rem] leading-snug text-grey-2/70">
                    {e.period} · {e.detail}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-28 lg:mt-36">
          <Heading tag="Click a node" title="Certifications" />
          <div className="mt-10">
            <CertificationOrbit />
          </div>
        </div>
      </div>
    </section>
  );
}
