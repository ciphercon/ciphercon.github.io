"use client";

import { SITE } from "@/data/site";
import { scrollToAnchor } from "@/lib/store";
import SoundToggle from "@/components/SoundToggle";
import { Mark } from "@/components/ui/Glyphs";
import Scramble from "@/components/ui/Scramble";
import LocalTime from "./LocalTime";
import Menu from "./Menu";

/**
 * Fixed HUD header. Items sit on the page's vertical grid lines; colours
 * come from CSS variables that flip with `html[data-theme]`, so the header
 * stays readable over both the dark and the lime surfaces.
 */
export default function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[var(--header-h)]">
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          scrollToAnchor("hero");
        }}
        className="pointer-events-auto absolute left-[var(--edge)] top-1/2 flex -translate-y-1/2 items-center gap-2"
      >
        <Mark className="h-[17px] w-[17px] text-[var(--hd-mark)] transition-colors" />
        <span className="font-heading text-[15px] font-bold uppercase leading-none text-[var(--hd-logo)] transition-colors">
          <Scramble
            text={`${SITE.firstName} ${SITE.lastName}`}
            trigger="inview"
            preset="label"
            nowrap
          />
        </span>
      </a>

      <SoundToggle className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden lg:left-[calc(var(--edge)+var(--col-w))] lg:translate-x-0" />

      <p className="hud absolute left-[calc(var(--edge)+3*var(--col-w))] top-1/2 hidden -translate-y-1/2 text-[var(--hd-text)] transition-colors lg:block">
        <Scramble
          text={`${SITE.location.city}, ${SITE.location.country}`}
          trigger="inview"
          preset="label"
          delay={150}
          nowrap
          block
        />
        <LocalTime timeZone={SITE.location.timeZone} />
      </p>

      <p className="hud absolute left-[calc(var(--edge)+4*var(--col-w))] top-1/2 hidden -translate-y-1/2 text-[var(--hd-text)] transition-colors lg:block">
        <Scramble text={SITE.location.lat} trigger="inview" preset="label" delay={250} nowrap block />
        <Scramble text={SITE.location.lng} trigger="inview" preset="label" delay={320} nowrap block />
      </p>

      <div className="absolute right-[var(--edge)] top-1/2 -translate-y-1/2">
        <Menu />
      </div>
    </header>
  );
}
