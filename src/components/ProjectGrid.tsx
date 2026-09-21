"use client";

import { motion } from "framer-motion";

const GITHUB = "https://github.com/nulldevops007";

const PROJECTS = [
  {
    title: "5-Day Threat Hunting Exercise",
    tag: "Threat Hunting",
    description: "Structured daily threat hunting program for the team, built on Elastic.",
    href: GITHUB,
  },
  {
    title: "IOC Categorization Tool",
    tag: "Automation",
    description: "Python + Selenium automation for open-source threat intel IOC submission.",
    href: GITHUB,
  },
  {
    title: "SecurText",
    tag: "LLM Tool",
    description: "ChatGPT-based incident investigation summarizer.",
    href: GITHUB,
  },
  {
    title: "Query Solution",
    tag: "App",
    description: "Platform connecting students with PhD experts for live doubt-clearing sessions.",
    href: GITHUB,
  },
  {
    title: "Supply Chain Management on Blockchain",
    tag: "Blockchain",
    description: "Hyperledger-based system for trustworthy courier and delivery tracking.",
    href: GITHUB,
  },
  {
    title: "Swisto",
    tag: "Web App",
    description: "Full-stack developer & pentester for a food/grocery delivery startup.",
    href: "https://www.swisto.in",
  },
  {
    title: "User Identification System",
    tag: "Blockchain",
    description: "Blockchain-based user authentication with encrypted personal data blocks.",
    href: GITHUB,
  },
  {
    title: "Captcha Generator",
    tag: "Python",
    description: "Custom captcha generator built in Python.",
    href: GITHUB,
  },
  {
    title: "Budget Tracker",
    tag: "C++",
    description: "Budget management tool built in C/C++ with a custom Windows API header.",
    href: GITHUB,
  },
  {
    title: "Mentoring at Topmate",
    tag: "Mentoring",
    description: "1:1 sessions on cybersecurity careers and interview prep.",
    href: "https://topmate.io/abhishekrajawat",
  },
];

const CARD_CLIP = "polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px)";

export default function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PROJECTS.map((project, index) => {
        const isGreen = index % 2 === 1;

        return (
          <motion.a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            initial="rest"
            whileHover="hover"
            animate="rest"
            style={isGreen ? { clipPath: CARD_CLIP } : undefined}
            className={`group relative block aspect-[4/3] overflow-hidden ${
              isGreen
                ? "border-l-4 border-black/20 bg-[#7f9d43]"
                : "rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950"
            }`}
          >
            <motion.div
              variants={{ rest: { y: 0 }, hover: { y: -4 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col justify-end p-6"
            >
              <span
                className={`text-xs font-medium uppercase tracking-widest ${
                  isGreen ? "text-black/70" : "text-accent"
                }`}
              >
                {project.tag}
              </span>
              <h3
                className={`mt-1 text-xl font-semibold ${
                  isGreen ? "text-black" : "text-foreground"
                }`}
              >
                {project.title}
              </h3>
              <p
                className={`mt-2 text-sm ${
                  isGreen ? "text-black/60" : "text-foreground/60"
                }`}
              >
                {project.description}
              </p>
            </motion.div>

            <motion.span
              variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
              transition={{ duration: 0.2 }}
              className={`absolute right-4 top-4 text-xs font-medium uppercase tracking-widest ${
                isGreen ? "text-black/70" : "text-foreground/80"
              }`}
            >
              Visit ↗
            </motion.span>
          </motion.a>
        );
      })}
    </div>
  );
}
