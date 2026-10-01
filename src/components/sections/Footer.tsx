"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { setTheme } from "@/lib/store";
import { FOOTER, SITE } from "@/data/site";
import Scramble, { type ScrambleRef } from "@/components/ui/Scramble";
import DotMatrix from "@/components/fx/DotMatrix";
import { ArrowUpRight, DownloadIcon } from "@/components/ui/Glyphs";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * Fixed beneath the page and revealed as the last section scrolls away
 * (curtain), sinking slightly into place. The scramble reveals are driven
 * by the reveal progress, since the footer is always "in view" while it's
 * covered.
 */
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const headRefs = useRef<(ScrambleRef | null)[]>([]);
  const linkRefs = useRef<(ScrambleRef | null)[]>([]);
  const wide = useMediaQuery("(min-width: 768px)");
  const [giantA, giantB] = FOOTER.giant.split("/");
  const giantLines = wide ? [FOOTER.giant] : [`${giantA}/`, giantB];

  useEffect(() => {
    const footer = footerRef.current;
    const inner = innerRef.current;
    const sentinel = document.getElementById("footer-sentinel");
    if (!footer || !inner || !sentinel) return;

    const setHeight = () => {
      document.documentElement.style.setProperty("--footer-h", `${footer.offsetHeight}px`);
      ScrollTrigger.refresh();
    };
    const ro = new ResizeObserver(setHeight);
    ro.observe(footer);

    let played = false;
    const st = ScrollTrigger.create({
      trigger: sentinel,
      start: "top bottom",
      end: () => `+=${footer.offsetHeight}`,
      onUpdate: (self) => {
        const p = self.progress;
        inner.style.transform = `translate3d(0, ${((1 - p) * 64).toFixed(1)}px, 0)`;
        const top = window.innerHeight - p * footer.offsetHeight;
        setTheme(top < 48 ? "lime" : "dark");
        if (p > 0.25 && !played) {
          played = true;
          headRefs.current.forEach((h, i) => h?.play({ delay: i * 140, flicker: i === headRefs.current.length - 1 }));
          linkRefs.current.forEach((l, i) => l?.play({ delay: 200 + i * 60 }));
        } else if (p === 0 && played) {
          played = false;
          headRefs.current.forEach((h) => h?.hide());
          linkRefs.current.forEach((l) => l?.hide());
        }
      },
    });

    return () => {
      ro.disconnect();
      st.kill();
    };
  }, []);

  let linkIndex = 0;

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="on-lime fixed inset-x-0 bottom-0 z-0 bg-lime text-ink"
    >
      <div ref={innerRef} className="will-change-transform">
        <div className="relative grid grid-cols-1 gap-10 px-[var(--edge)] pb-10 pt-10 lg:grid-cols-2 lg:gap-0 lg:pb-9 lg:pt-8">
          <span aria-hidden="true" className="absolute inset-y-0 left-1/2 hidden w-px bg-lime-box-stroke/40 lg:block" />
          <div>
            <h2 className="font-heading text-[clamp(2.4rem,4.1vw,4rem)] font-bold uppercase leading-[0.9] tracking-[-0.005em]">
              {FOOTER.heading.map((line, i) => (
                <Scramble
                  key={line}
                  ref={(r) => {
                    headRefs.current[i] = r;
                  }}
                  text={line}
                  preset="label"
                  block
                  nowrap
                />
              ))}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3 lg:mt-10 lg:gap-5">
              {FOOTER.actions.map((a) => (
                <a
                  key={a.label}
                  href={a.href}
                  target={a.href.startsWith("http") ? "_blank" : undefined}
                  rel={a.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  download={a.icon === "download" ? "" : undefined}
                  className="bracket inline-flex items-center gap-2 border border-lime-box-stroke/70 bg-lime-soft px-5 py-3 font-heading text-[0.95rem] font-semibold uppercase tracking-[0.06em] text-ink transition-colors [--bk:var(--red)] hover:bg-ink hover:text-lime lg:px-7 lg:py-3.5"
                >
                  {a.label}
                  {a.icon === "download" && <DownloadIcon className="h-4 w-4" />}
                  {a.icon === "arrow" && <ArrowUpRight className="h-3.5 w-3.5" />}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:pl-[calc(var(--col-w)*0.95)]">
            <dl className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-4 lg:gap-x-[4vw]">
              {FOOTER.groups.map((g) => (
                <div key={g.label} className="contents">
                  <dt className="hud-strong text-[0.8rem] text-purple-ink">{g.label}</dt>
                  <dd className="flex flex-wrap gap-x-8 gap-y-2">
                    {g.links.map((l) => {
                      const k = linkIndex++;
                      return (
                        <a
                          key={l.label}
                          href={l.href}
                          target={l.href.startsWith("http") ? "_blank" : undefined}
                          rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="hud-strong inline-flex items-center gap-2 text-[0.8rem] text-ink transition-colors hover:text-purple"
                        >
                          <Scramble
                            ref={(r) => {
                              linkRefs.current[k] = r;
                            }}
                            text={l.label}
                            preset="label"
                            nowrap
                          />
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      );
                    })}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="border-t border-lime-box-stroke/40 px-[calc(var(--edge)-0.25rem)] pb-3 pt-6">
          <h2 className="sr-only">{FOOTER.giant}</h2>
          {giantLines.map((line) => (
            <DotMatrix
              key={line}
              source={{ kind: "string", text: line, weight: 600 }}
              fit="stretch"
              shape="square"
              pitch={wide ? 7 : 5}
              dot={0.74}
              color="#0d1404"
              edgeColor="#4f7a18"
              hoverColor="#620ecc"
              className="mb-2 h-[clamp(4rem,12vh,9.5rem)] w-full md:mb-0 md:h-[clamp(4.5rem,14vh,9.5rem)]"
            />
          ))}
          <p className="hud mt-3 flex flex-col gap-1 text-[0.68rem] text-lime-deep sm:flex-row sm:justify-between">
            <span>
              © {new Date().getFullYear()} {SITE.firstName} {SITE.lastName}
            </span>
            <span>{SITE.role} · {SITE.company}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
