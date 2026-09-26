"use client";

import { motion } from "framer-motion";
import GlitchText from "./GlitchText";
import CertificationOrbit from "./CertificationOrbit";

const EDUCATION = [
  {
    school: "IIT Guwahati (E&ICT Academy)",
    program: "Post Graduation Advance Certification, Cyber Security",
    detail: "Aug 2024 – Sep 2025 · Malware Analysis, Applied Cryptography, AI for Cyber Security",
  },
  {
    school: "Lovely Professional University",
    program: "B.Tech, Computer Science and Engineering",
    detail: "2015 – 2019 · Cyber Security",
  },
];

export default function Education() {
  return (
    <div>
      <div className="mx-auto max-w-xl">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          <GlitchText text="Education" />
        </h3>
        <ul className="space-y-4">
          {EDUCATION.map((item, i) => (
            <li key={item.school}>
              <p className="font-semibold">
                <GlitchText
                  text={item.program}
                  startDelay={i * 150}
                  tickMs={25}
                  lockEvery={2}
                  charsPerTick={2}
                />
              </p>
              <p className="text-sm text-foreground/60">
                <GlitchText
                  text={`${item.school} · ${item.detail}`}
                  startDelay={i * 150 + 200}
                  tickMs={20}
                  lockEvery={1}
                  charsPerTick={2}
                />
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Certifications orbit — same on phone, tablet, and desktop */}
      <div className="mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-8 flex max-w-md flex-col items-center text-center"
        >
          <span className="mb-4 inline-block rounded-sm bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-background">
            <GlitchText text="Click a Node" />
          </span>
          <h3 className="text-3xl font-black uppercase tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <GlitchText text="Certifications" />
          </h3>
        </motion.div>
        <CertificationOrbit />
      </div>
    </div>
  );
}
