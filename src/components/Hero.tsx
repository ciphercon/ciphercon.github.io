"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Hero() {
  return (
    <section className="relative flex h-svh min-h-[720px] w-full flex-col overflow-hidden bg-black">
      {/* Background photo */}
      <div
        className="absolute inset-y-0 right-0 w-full sm:w-[62%]"
        style={{
          maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 55%, transparent 100%)",
        }}
      >
        <Image
          src="/hero-photo.jpg"
          alt="Abhishek Singh"
          fill
          priority
          sizes="(min-width: 640px) 62vw, 100vw"
          className="object-cover object-top grayscale contrast-125 brightness-90"
        />
        {/* Fade top/bottom edges into black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/95" />
      </div>

      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.12] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Top bar: coordinates + from/country */}
      <div className="relative z-20 flex items-start justify-between px-6 pt-24 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-widest text-muted"
        >
          <GlitchText
            text="28.5355° N, 77.3910° E — Noida, India"
            tickMs={20}
            lockEvery={1}
            charsPerTick={2}
          />
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden flex-col items-end gap-1 text-right sm:flex"
        >
          <span className="text-[10px] uppercase tracking-widest text-muted">
            <GlitchText text="From" startDelay={300} />
          </span>
          <span className="text-3xl font-bold tracking-tight">
            <GlitchText text="IN" startDelay={500} />
          </span>
        </motion.div>
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="relative z-20 mt-10 max-w-md px-6 text-xl leading-snug text-foreground/90 sm:mt-16 sm:px-10 sm:text-2xl"
      >
        <GlitchText text="I'm a " startDelay={400} tickMs={35} lockEvery={2} charsPerTick={2} />
        <GlitchText
          text="Security Researcher"
          className="text-accent"
          startDelay={700}
          tickMs={35}
          lockEvery={2}
          charsPerTick={2}
        />
        <GlitchText
          text=" passionate about "
          startDelay={1500}
          tickMs={35}
          lockEvery={2}
          charsPerTick={2}
        />
        <GlitchText
          text="<threat-hunting/>"
          className="font-mono text-muted"
          startDelay={2200}
          tickMs={35}
          lockEvery={2}
          charsPerTick={2}
        />
      </motion.p>

      {/* Giant name, bottom */}
      <div className="relative z-20 mt-auto px-6 pb-10 sm:px-10">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="text-[15vw] font-black uppercase leading-[0.82] tracking-tighter sm:text-[9vw]"
        >
          <GlitchText text="Abhishek" startDelay={2900} />
          <br />
          <GlitchText text="Singh" startDelay={3600} />
        </motion.h1>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 4.1 }}
          className="mt-4 inline-block rounded-sm bg-accent px-5 py-2 text-sm font-semibold uppercase tracking-widest text-background sm:text-base"
        >
          <GlitchText
            text="Security Researcher at Microsoft"
            startDelay={4100}
            tickMs={35}
            lockEvery={2}
            charsPerTick={2}
          />
        </motion.span>
      </div>

      {/* Vertical scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-10 right-6 z-20 hidden [writing-mode:vertical-rl] text-xs uppercase tracking-widest text-muted sm:right-10 sm:block"
      >
        <GlitchText text="Scroll down" startDelay={1000} />
      </motion.div>
    </section>
  );
}
