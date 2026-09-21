"use client";

import { motion } from "framer-motion";

const PROJECTS = [
  {
    title: "SecurText",
    tag: "LLM Tool",
    description: "ChatGPT-based incident investigation summarizer.",
    href: "#",
  },
  {
    title: "5-Day Threat Hunting Program",
    tag: "Program",
    description: "Structured framework for proactive threat detection using Elastic.",
    href: "#",
  },
  {
    title: "IOC Categorization Automation",
    tag: "Automation",
    description: "Python workflow automating IOC submission for SOC teams.",
    href: "#",
  },
  {
    title: "Mentoring at Topmate",
    tag: "Mentoring",
    description: "1:1 sessions on cybersecurity careers and interview prep.",
    href: "https://topmate.io/abhishekrajawat",
  },
];

export default function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PROJECTS.map((project) => (
        <motion.a
          key={project.title}
          href={project.href}
          target={project.href.startsWith("http") ? "_blank" : undefined}
          rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950"
        >
          <motion.div
            variants={{ rest: { y: 0 }, hover: { y: -4 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col justify-end p-6"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-accent">
              {project.tag}
            </span>
            <h3 className="mt-1 text-xl font-semibold">{project.title}</h3>
            <p className="mt-2 text-sm text-foreground/60">
              {project.description}
            </p>
          </motion.div>

          <motion.span
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-4 text-xs font-medium uppercase tracking-widest text-foreground/80"
          >
            Visit ↗
          </motion.span>
        </motion.a>
      ))}
    </div>
  );
}
