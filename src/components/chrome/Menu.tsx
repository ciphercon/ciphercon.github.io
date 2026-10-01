"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { buildCells, cellsToPath, sweepFromRight, type Cell } from "@/lib/pixels";
import { menuOpen, scrollToAnchor } from "@/lib/store";
import { NAV, SITE } from "@/data/site";
import { cn } from "@/lib/cn";
import Scramble, { type ScrambleRef } from "@/components/ui/Scramble";
import { Mark, PixelArrow } from "@/components/ui/Glyphs";
import SoundToggle from "@/components/SoundToggle";

const EMPTY = "path('M0 0h0v0h0Z')";

const MenuButton = forwardRef<
  HTMLButtonElement,
  {
    label: string;
    onClick?: () => void;
    className?: string;
    tone: "theme" | "lime";
    expanded?: boolean;
  }
>(function MenuButton({ label, onClick, className, tone, expanded }, ref) {
  const textRef = useRef<ScrambleRef>(null);
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-haspopup={expanded === undefined ? undefined : "dialog"}
      aria-expanded={expanded}
      onPointerEnter={() => textRef.current?.glitch()}
      className={cn(
        "bracket border px-6 py-2.5 font-heading text-[0.95rem] font-semibold uppercase tracking-[0.06em] transition-colors",
        tone === "theme"
          ? "border-[var(--hd-btn-border)] bg-[var(--hd-btn-bg)] text-[var(--hd-btn-fg)]"
          : "border-lime-box-stroke bg-lime-soft text-ink [--bk:#e0552b]",
        className
      )}
    >
      <Scramble ref={textRef} text={label} initiallyVisible nowrap preset="label" />
    </button>
  );
});

/**
 * Full-screen lime menu. It wipes in and out through the same block mask
 * as the scene transitions. Radix keeps it modal (focus trap, Escape,
 * aria-hidden on the page) only while it's mounted, so the panel mounts on
 * open and unmounts once the exit wipe has finished.
 */
export default function Menu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(ScrambleRef | null)[]>([]);
  const cellsRef = useRef<Cell[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const pendingRef = useRef<string | null>(null);
  const closingRef = useRef(false);

  const animate = (to: 0 | 1, done?: () => void) => {
    const panel = panelRef.current;
    tweenRef.current?.kill();
    if (!panel || prefersReducedMotion()) {
      if (panel) panel.style.clipPath = to ? "none" : EMPTY;
      done?.();
      return;
    }
    const W = window.innerWidth;
    const H = window.innerHeight;
    cellsRef.current = buildCells(W, H, Math.max(48, Math.round(W / 18)), sweepFromRight(0.4), 11);
    const state = { p: to === 1 ? 0 : 1 };
    tweenRef.current = gsap.to(state, {
      p: to,
      duration: 0.55,
      ease: "power2.inOut",
      onUpdate: () => {
        panel.style.clipPath = cellsToPath(cellsRef.current, state.p);
      },
      onComplete: () => {
        if (to === 1) panel.style.clipPath = "none";
        done?.();
      },
    });
  };

  useEffect(() => {
    menuOpen.set(open);
    if (!open) return;
    return () => {
      tweenRef.current?.kill();
    };
  }, [open]);

  // Radix's portal mounts the panel a render after `open` flips, so the
  // wipe starts from its open-autofocus hook, once the panel exists.
  const onPanelMounted = () => {
    animate(1);
    itemRefs.current.forEach((r, i) => r?.play({ delay: 180 + i * 45 }));
  };

  const closeMenu = () => {
    if (!open || closingRef.current) return;
    closingRef.current = true;
    animate(0, () => {
      closingRef.current = false;
      setOpen(false);
      const target = pendingRef.current;
      pendingRef.current = null;
      if (target) scrollToAnchor(target);
    });
  };

  const go = (id: string) => {
    pendingRef.current = id;
    closeMenu();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => (o ? setOpen(true) : closeMenu())}>
      <MenuButton
        ref={triggerRef}
        label="Menu"
        tone="theme"
        onClick={() => setOpen(true)}
        expanded={open}
        className="pointer-events-auto"
      />
      <Dialog.Portal>
        <Dialog.Content
          ref={panelRef}
          aria-describedby={undefined}
          onOpenAutoFocus={onPanelMounted}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            triggerRef.current?.focus({ preventScroll: true });
          }}
          className="on-lime fixed inset-0 z-[95] flex flex-col bg-lime text-ink [--hd-strong:var(--ink)] [--hd-text:var(--lime-deep)]"
          style={{ clipPath: EMPTY }}
        >
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>

          <div className="relative h-[var(--header-h)] shrink-0">
            <span className="absolute left-[var(--edge)] top-1/2 flex -translate-y-1/2 items-center gap-2">
              <Mark className="h-4 w-4 text-purple-ink" />
              <span className="font-heading text-[15px] font-bold uppercase text-purple-ink">
                {SITE.firstName} {SITE.lastName}
              </span>
            </span>
            <MenuButton
              label="Close"
              tone="lime"
              onClick={closeMenu}
              className="absolute right-[var(--edge)] top-1/2 -translate-y-1/2"
            />
          </div>

          <div className="grid flex-1 grid-cols-1 gap-10 overflow-y-auto px-[var(--edge)] pb-10 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <nav aria-label="Sections">
              <ol className="flex flex-col">
                {NAV.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.id)}
                      onPointerEnter={() => itemRefs.current[i]?.glitch()}
                      className="group flex w-full items-baseline gap-4 border-b border-lime-box-stroke/40 py-1.5 text-left lg:gap-6"
                    >
                      <span className="hud w-8 shrink-0 text-lime-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Scramble
                        ref={(r) => {
                          itemRefs.current[i] = r;
                        }}
                        text={item.label}
                        nowrap
                        preset="label"
                        className="display text-[clamp(2.4rem,6.2vh,5.2rem)] font-medium transition-colors group-hover:text-purple"
                      />
                      <PixelArrow className="ml-auto h-4 w-6 text-purple opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="flex flex-col gap-6 lg:w-[calc(var(--col-w)*1.2)]">
              <div>
                <p className="hud text-lime-deep">Ambient</p>
                <SoundToggle className="mt-1" />
              </div>
              <div>
                <p className="hud text-lime-deep">Write to me</p>
                <a href={`mailto:${SITE.email}`} className="hud-strong mt-1 block text-ink hover:text-purple">
                  {SITE.email}
                </a>
              </div>
              <div>
                <p className="hud text-lime-deep">Elsewhere</p>
                <div className="mt-1 flex flex-col gap-1">
                  <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer" className="hud-strong text-ink hover:text-purple">
                    LinkedIn ↗
                  </a>
                  <a href={SITE.links.topmate} target="_blank" rel="noopener noreferrer" className="hud-strong text-ink hover:text-purple">
                    Topmate ↗
                  </a>
                  <a href={SITE.links.cv} className="hud-strong text-ink hover:text-purple">
                    Download CV ↓
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
