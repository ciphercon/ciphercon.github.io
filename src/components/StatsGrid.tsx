"use client";

import { motion } from "framer-motion";

const CARD_CLIP =
  "polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px)";

type StatCard = {
  label: string;
  value: string;
  colStart: string;
  rowStart: string;
};

type ToolCard = {
  label: string;
  colStart: string;
  rowStart: string;
};

const STATS: StatCard[] = [
  { label: "Years of Experience", value: "6.8+", colStart: "lg:col-start-1", rowStart: "lg:row-start-1" },
  { label: "Certifications", value: "23+", colStart: "lg:col-start-2", rowStart: "lg:row-start-2" },
  { label: "Companies", value: "6+", colStart: "lg:col-start-3", rowStart: "lg:row-start-3" },
];

const TOOLS: ToolCard[] = [
  { label: "Azure Sentinel", colStart: "lg:col-start-3", rowStart: "lg:row-start-1" },
  { label: "MITRE ATT&CK", colStart: "lg:col-start-5", rowStart: "lg:row-start-1" },
  { label: "Splunk", colStart: "lg:col-start-4", rowStart: "lg:row-start-2" },
  { label: "Python / KQL", colStart: "lg:col-start-5", rowStart: "lg:row-start-3" },
];

function Card({
  label,
  value,
  colStart,
  rowStart,
}: {
  label: string;
  value?: string;
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
      className={`relative flex h-56 flex-col justify-between border-l-4 border-black/20 bg-[#7f9d43] p-5 sm:h-64 ${colStart} ${rowStart}`}
    >
      <span className="text-right text-xs font-bold uppercase tracking-widest text-black/80">
        {label}
      </span>
      {value && (
        <span className="text-6xl font-black leading-none text-black sm:text-7xl">
          {value}
        </span>
      )}
    </motion.div>
  );
}

export default function StatsGrid() {
  return (
    <section className="w-full bg-[#b6e83a] px-6 py-20 sm:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:grid-rows-3">
        {STATS.map((stat) => (
          <Card
            key={stat.label}
            label={stat.label}
            value={stat.value}
            colStart={stat.colStart}
            rowStart={stat.rowStart}
          />
        ))}
        {TOOLS.map((tool) => (
          <Card
            key={tool.label}
            label={tool.label}
            colStart={tool.colStart}
            rowStart={tool.rowStart}
          />
        ))}
      </div>
    </section>
  );
}
