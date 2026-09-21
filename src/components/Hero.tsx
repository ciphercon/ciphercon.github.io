"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex h-svh min-h-[640px] w-full flex-col justify-end overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-black px-6 pb-16 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,255,61,0.12),_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative flex flex-col gap-4"
      >
        <span className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
          2026 Portfolio
        </span>
        <h1 className="text-[13vw] font-black leading-[0.85] tracking-tighter sm:text-[9vw]">
          Your Name
        </h1>
        <p className="max-w-md text-base text-foreground/70 sm:text-lg">
          Software engineer &amp; builder — placeholder tagline. Swap this
          copy, and the background gradient above for real photography.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-8 right-6 text-xs uppercase tracking-widest text-muted sm:right-10"
      >
        Scroll
      </motion.div>
    </section>
  );
}
