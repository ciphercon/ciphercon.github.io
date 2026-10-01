"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, DESKTOP_QUERY, STACKED_QUERY } from "@/lib/gsap";
import { buildCells, cellsToPath, sweepFromRight, type Cell } from "@/lib/pixels";
import { registerAnchor, whenLoaded, loaderDone } from "@/lib/store";
import { useMediaQuery } from "@/lib/useMediaQuery";
import GlitchCanvas from "@/components/fx/GlitchCanvas";
import DotHalo from "@/components/fx/DotHalo";
import HeroScene from "./HeroScene";
import ManifestoScene from "./ManifestoScene";
import StatsGrid, { type StatsRef } from "./StatsGrid";
import SelectedWork from "./SelectedWork";
import WorkedAt from "./WorkedAt";
import type { SceneRef } from "./types";

type Intro = "hero" | "manifesto" | "none";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const EMPTY = "path('M0 0h0v0h0Z')";

/**
 * The pinned, scroll-driven part of the site (desktop):
 *
 *   hero ─▶ manifesto ─▶ [pixel wipe → lime] ─▶ stats ─▶ horizontal work
 *   track ─▶ [pixel wipe → dark] ─▶ worked at
 *
 * Three stacked layers inside one pinned viewport. Wipes reveal the next
 * layer through a block mask (clip-path), the track translates sideways,
 * and text scenes switch with timed scramble transitions when the scroll
 * position crosses their thresholds. Below 1200px the same layers simply
 * stack and reveal on scroll.
 */
export default function Stage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const trackLayerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const workedLayerRef = useRef<HTMLDivElement>(null);

  const hero = useRef<SceneRef>(null);
  const manifesto = useRef<SceneRef>(null);
  const stats = useRef<StatsRef>(null);
  const worked = useRef<SceneRef>(null);

  const desktop = useMediaQuery(DESKTOP_QUERY);
  const [photoLive, setPhotoLive] = useState(true);
  const photoLiveRef = useRef(true);

  useEffect(() => {
    const setPhoto = (v: boolean) => {
      if (photoLiveRef.current !== v) {
        photoLiveRef.current = v;
        setPhotoLive(v);
      }
    };

    // ---- intro scene sequencer (shared by desktop + mobile) ----
    let introTarget: Intro = "none";
    let introCurrent: Intro = "none";
    let seq = 0;
    const timeout = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const setIntro = async (target: Intro) => {
      if (target === introTarget) return;
      introTarget = target;
      const my = ++seq;
      const hides: Promise<void>[] = [];
      if (introCurrent === "hero") hides.push(hero.current!.hide());
      if (introCurrent === "manifesto") hides.push(manifesto.current!.hide());
      introCurrent = "none";
      if (hides.length) await Promise.race([Promise.all(hides), timeout(1500)]);
      if (my !== seq) return;
      introCurrent = target;
      if (target === "hero") hero.current?.show();
      if (target === "manifesto") manifesto.current?.show();
    };

    hero.current?.reset();
    manifesto.current?.reset();
    stats.current?.reset();
    worked.current?.reset();

    const mm = gsap.matchMedia();

    // ---------------------------------------------------------------- desktop
    mm.add(DESKTOP_QUERY, () => {
      const stage = stageRef.current!;
      const track = trackRef.current!;
      const trackLayer = trackLayerRef.current!;
      const workedLayer = workedLayerRef.current!;
      const intro = introRef.current!;

      let S = { hero: 0, manifesto: 0, wipe1: 0, statsHold: 0, track: 0, wipe2: 0, worked: 0 };
      const T = { heroEnd: 0, wipe1Start: 0, wipe1End: 0, trackStart: 0, trackEnd: 0, wipe2End: 0, total: 0 };
      let cells1: Cell[] = [];
      let cells2: Cell[] = [];
      let lastP1 = -1;
      let lastP2 = -1;
      let statsShown = false;
      let workedShown = false;
      let loaded = loaderDone.get();

      const measure = () => {
        const H = window.innerHeight;
        const W = window.innerWidth;
        S = {
          hero: H * 0.75,
          manifesto: H * 1.05,
          wipe1: H * 0.9,
          statsHold: H * 0.3,
          track: Math.max(0, track.scrollWidth - W),
          wipe2: H * 0.9,
          worked: H * 0.45,
        };
        T.heroEnd = S.hero;
        T.wipe1Start = T.heroEnd + S.manifesto;
        T.wipe1End = T.wipe1Start + S.wipe1;
        T.trackStart = T.wipe1End + S.statsHold;
        T.trackEnd = T.trackStart + S.track;
        T.wipe2End = T.trackEnd + S.wipe2;
        T.total = T.wipe2End + S.worked;
        const size = Math.max(64, Math.round(W / 14));
        cells1 = buildCells(W, H, size, sweepFromRight(0.36), 21);
        cells2 = buildCells(W, H, size, sweepFromRight(0.36), 42);
        lastP1 = lastP2 = -1;
      };

      const applyWipe = (layer: HTMLElement, cells: Cell[], p: number) => {
        if (p <= 0) {
          layer.style.clipPath = EMPTY;
          layer.style.visibility = "hidden";
        } else if (p >= 1) {
          layer.style.clipPath = "none";
          layer.style.visibility = "visible";
        } else {
          layer.style.visibility = "visible";
          layer.style.clipPath = cellsToPath(cells, p);
        }
      };

      const update = (s: number) => {
        const p1 = clamp01((s - T.wipe1Start) / S.wipe1);
        const p2 = clamp01((s - T.trackEnd) / S.wipe2);
        if (p1 !== lastP1) {
          applyWipe(trackLayer, cells1, p1);
          lastP1 = p1;
        }
        if (p2 !== lastP2) {
          applyWipe(workedLayer, cells2, p2);
          lastP2 = p2;
        }
        intro.style.visibility = p1 >= 1 ? "hidden" : "visible";
        setPhoto(p1 < 1);
        gsap.set(track, { x: -Math.min(S.track, Math.max(0, s - T.trackStart)) });

        if (!loaded) return;
        // Text scenes.
        if (s < T.heroEnd) setIntro("hero");
        else if (s < T.wipe1Start + S.wipe1 * 0.3) setIntro("manifesto");
        else setIntro("none");

        if (p1 > 0.32 && !statsShown) {
          statsShown = true;
          stats.current?.show();
        } else if (p1 < 0.04 && statsShown) {
          statsShown = false;
          stats.current?.reset();
        }
        if (p2 > 0.42 && !workedShown) {
          workedShown = true;
          worked.current?.show();
        } else if (p2 < 0.04 && workedShown) {
          workedShown = false;
          worked.current?.reset();
        }
      };

      measure();
      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${T.total}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onRefresh: (self) => update(self.progress * T.total),
        onUpdate: (self) => update(self.progress * T.total),
      });

      const offLoaded = loaderDone.subscribe(() => {
        if (!loaderDone.get()) return;
        loaded = true;
        update(st.progress * T.total);
      });

      const work = document.getElementById("work");
      const unregister = [
        registerAnchor("hero", () => st.start),
        registerAnchor("manifesto", () => st.start + T.heroEnd + 4),
        registerAnchor("stats", () => st.start + T.wipe1End + 4),
        registerAnchor("work", () => {
          const off = work ? work.offsetLeft - window.innerWidth * 0.02 : 0;
          return st.start + T.trackStart + Math.min(S.track, Math.max(0, off));
        }),
        registerAnchor("experience", () => st.start + T.wipe2End + 4),
      ];

      return () => {
        offLoaded();
        unregister.forEach((u) => u());
        st.kill();
        gsap.set(track, { x: 0 });
        [trackLayer, workedLayer].forEach((l) => {
          l.style.clipPath = "";
          l.style.visibility = "";
        });
        intro.style.visibility = "";
      };
    });

    // ----------------------------------------------------------------- mobile
    mm.add(STACKED_QUERY, () => {
      const triggers: ScrollTrigger[] = [];
      let alive = true;
      // No pinning here: both intro scenes live in the flow, so they're
      // revealed independently instead of through the sequencer.
      whenLoaded().then(() => {
        if (alive) hero.current?.show();
      });
      const once = (id: string, fn: () => void) => {
        const el = document.getElementById(id);
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 72%",
            once: true,
            onEnter: () => whenLoaded().then(() => alive && fn()),
          })
        );
      };
      once("manifesto", () => manifesto.current?.show());
      once("stats", () => stats.current?.show());
      once("experience", () => worked.current?.show());

      const top = (id: string) => () => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const header = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.25;
        return Math.max(0, el.getBoundingClientRect().top + window.scrollY - header);
      };
      const unregister = ["hero", "manifesto", "stats", "work", "experience"].map((id) =>
        registerAnchor(id, id === "hero" ? () => 0 : top(id))
      );

      return () => {
        alive = false;
        triggers.forEach((t) => t.kill());
        unregister.forEach((u) => u());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section aria-label="Introduction, stats, selected work and experience" className="relative">
      <div ref={stageRef} className="relative lg:h-screen lg:overflow-hidden">
        {/* Layer A — dark intro */}
        <div ref={introRef} data-surface="dark" className="relative overflow-hidden bg-black lg:absolute lg:inset-0">
          <DotHalo className="pointer-events-none absolute inset-0 h-full w-full max-lg:hidden" />
          <GlitchCanvas
            source={{ kind: "image", src: "/hero-cutout.png" }}
            mode="photo"
            heightFrac={desktop ? 1.32 : 1.08}
            align={desktop ? [0.6, 0] : [0.5, 0]}
            active={photoLive}
            className="pointer-events-none absolute right-0 top-[33svh] h-[67svh] w-full opacity-80 lg:top-[10vh] lg:h-[90vh] lg:w-[70%] lg:opacity-100"
          />
          <HeroScene ref={hero} />
          <ManifestoScene ref={manifesto} />
        </div>

        {/* Layer B — lime track */}
        <div ref={trackLayerRef} data-surface="lime" className="relative bg-lime lg:invisible lg:absolute lg:inset-0">
          <div ref={trackRef} className="lg:flex lg:h-full lg:w-max lg:will-change-transform">
            <StatsGrid ref={stats} />
            <div aria-hidden="true" className="relative hidden h-full w-[calc(var(--col-w)*1.15)] shrink-0 lg:block">
              <span className="absolute left-[30%] top-[58%] h-[18%] w-px bg-lime-path" />
              <span className="absolute left-[30%] top-[76%] h-px w-[38%] bg-lime-path" />
              <span className="absolute left-[68%] top-[22%] text-lime-deep">+</span>
            </div>
            <SelectedWork />
          </div>
        </div>

        {/* Layer C — dark experience */}
        <div ref={workedLayerRef} data-surface="dark" className="relative bg-black lg:invisible lg:absolute lg:inset-0">
          <WorkedAt ref={worked} />
        </div>
      </div>
    </section>
  );
}
