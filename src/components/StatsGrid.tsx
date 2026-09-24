"use client";

import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

const CARD_CLIP =
  "polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px)";

type StatCard = {
  label: string;
  value: string;
  colStart: string;
  rowStart: string;
};

const STATS: StatCard[] = [
  { label: "Years of Experience", value: "8+", colStart: "xl:col-start-1", rowStart: "xl:row-start-1" },
  { label: "Certifications", value: "23+", colStart: "xl:col-start-2", rowStart: "xl:row-start-2" },
  { label: "AI Projects", value: "10+", colStart: "xl:col-start-3", rowStart: "xl:row-start-1" },
  { label: "Publications", value: "3+", colStart: "xl:col-start-4", rowStart: "xl:row-start-2" },
  { label: "YouTube Views", value: "15M+", colStart: "xl:col-start-5", rowStart: "xl:row-start-1" },
];

function Card({
  label,
  value,
  colStart,
  rowStart,
}: {
  label: string;
  value: string;
  colStart: string;
  rowStart: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      style={{ clipPath: CARD_CLIP }}
      className={`relative flex h-44 flex-col justify-between overflow-hidden border-l-4 border-black/20 bg-[#7f9d43] p-4 sm:h-56 sm:p-5 xl:h-64 ${colStart} ${rowStart}`}
    >
      <span className="text-right text-[10px] font-bold uppercase tracking-widest text-black/80 sm:text-xs">
        <GlitchText text={label} tickMs={25} lockEvery={2} charsPerTick={2} />
      </span>
      <span className="text-4xl font-black leading-none text-black sm:text-5xl xl:text-6xl 2xl:text-7xl">
        <GlitchText text={value} startDelay={200} />
      </span>
    </motion.div>
  );
}

export default function StatsGrid() {
  return (
    <section className="w-full bg-[#b6e83a] px-6 py-20 sm:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5 xl:grid-rows-3">
        {STATS.map((stat) => (
          <Card
            key={stat.label}
            label={stat.label}
            value={stat.value}
            colStart={stat.colStart}
            rowStart={stat.rowStart}
          />
        ))}
      </div>
    </section>
  );
}
