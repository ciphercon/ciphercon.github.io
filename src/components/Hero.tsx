"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center px-6 py-32 sm:px-10">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs uppercase tracking-widest text-muted"
      >
        10.8231° N, 106.6297° E — Ho Chi Minh City
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
      >
        I&apos;m a regular person passionate about{" "}
        <span className="text-accent">Art</span> and{" "}
        <span className="font-mono text-muted">&lt;technology/&gt;</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-6 max-w-md text-base text-foreground/70"
      >
        Placeholder subline — a sentence about your role and focus. Replace
        with your own intro copy.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-10 left-6 text-xs uppercase tracking-widest text-muted sm:left-10"
      >
        Scroll down
      </motion.div>
    </section>
  );
}
