"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

const VIDEOS = [
  {
    id: "nYno9KsB4lo",
    title:
      "Microsoft Cybersecurity Expert Reveals How to get into Cybersecurity | Roadmap | Certifications",
    channel: "Tutedude",
    href: "https://youtu.be/nYno9KsB4lo",
  },
  {
    id: "mo0H1g85u4E",
    title:
      "Govt. School to Microsoft! | How to Get Job in Tech Giant | Career Kaptain #2",
    channel: "Career Kaptain by PW",
    href: "https://youtu.be/mo0H1g85u4E",
  },
  {
    id: "fi7sJ-hL-LQ",
    title:
      "How Professionals Transformed Their Careers with Cyber Security Skills",
    channel: "Intellipaat",
    href: "https://youtu.be/fi7sJ-hL-LQ",
  },
];

export default function Vlogs() {
  return (
    <section className="w-full bg-[#b6e83a] px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <span className="mb-6 inline-block rounded-sm bg-black px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#b6e83a]">
          <GlitchText text="Keep Watching" />
        </span>

        <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tight text-black sm:text-7xl">
          <GlitchText text="Vlogs &" startDelay={200} />
          <br />
          <GlitchText text="Interviews" startDelay={500} />
        </h2>

        <p className="mt-5 max-w-md text-black/70">
          <GlitchText
            text="Talks and interviews on cybersecurity careers, threat hunting, and breaking into the field."
            startDelay={900}
            tickMs={25}
            lockEvery={2}
            charsPerTick={2}
          />
        </p>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-3">
          {VIDEOS.map((video, i) => (
            <motion.a
              key={video.id}
              href={video.href}
              target="_blank"
              rel="noopener noreferrer"
              initial="rest"
              whileHover="hover"
              animate="rest"
              className={i % 2 === 1 ? "block sm:mt-16" : "block"}
            >
              <motion.div
                variants={{ rest: { y: 0 }, hover: { y: -6 } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-xl"
              >
                <Image
                  src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
                  alt={video.title}
                  fill
                  unoptimized
                  className="object-cover"
                />

                <span className="absolute left-3 top-3 rounded-sm bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                  {video.channel}
                </span>

                <motion.span
                  variants={{
                    rest: { opacity: 0, scale: 0.85 },
                    hover: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-1 h-5 w-5 fill-black"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </motion.span>
              </motion.div>

              <h3 className="mt-4 text-base font-semibold leading-snug text-black">
                <GlitchText
                  text={video.title}
                  tickMs={20}
                  lockEvery={1}
                  charsPerTick={2}
                />
              </h3>
              <span className="mt-1 inline-block text-xs font-medium uppercase tracking-widest text-black/60">
                Watch ↗
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
