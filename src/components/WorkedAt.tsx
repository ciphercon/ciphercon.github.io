"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GlitchText from "./GlitchText";

const POSITIONS = [
  {
    company: "Microsoft",
    role: "Security Researcher II",
    period: "Oct 2022 — Present",
    logo: "/logos/microsoft.svg",
    description:
      "Threat hunting, incident response, and detection engineering across MDI, MDO, MDA, and MDE. Configures ASR rules, oversees Azure AD security, builds Security Copilot models, and contributes to XDR research.",
  },
  {
    company: "Crowe",
    role: "Cyber Security Analyst",
    period: "Jan 2022 — Oct 2022",
    logo: "/logos/crowe.png",
    description:
      "Managed Detection & Response: monitored and responded to alerts via Carbon Black, built SOAR playbooks in SIEMplify, and ran MITRE ATT&CK-based threat hunting across Carbon Black, Anomali, and Elastic.",
  },
  {
    company: "UnitedHealth Group",
    role: "Associate Security Analyst",
    period: "Mar 2021 — Jan 2022",
    logo: "/logos/unitedhealth-group.svg",
    description:
      "Identified and mitigated phishing, malware, and scam campaigns. Built Splunk dashboards and IOC queries, investigated cloud alerts on Azure Sentinel, and used MITRE ATT&CK to map incident techniques.",
  },
  {
    company: "Quick Heal",
    role: "Security Analyst Trainee",
    period: "Jul 2019 — Feb 2021",
    logo: "/logos/quick-heal.svg",
    description:
      "Investigated social engineering, phishing, and spam attacks; built malware signatures from client endpoint data; worked across NGFW, EDR, and sandboxing tools.",
  },
  {
    company: "Swisto",
    role: "Security Web Intern",
    period: "Jan 2019 — Jul 2019",
    logo: null,
    description:
      "Penetration testing, application security, and secure code review during a 10-month application testing and delivery program.",
  },
  {
    company: "Freelance",
    role: "Web Developer Trainee",
    period: "Sep 2018 — Jan 2019",
    logo: null,
    description: "Early web development work, Jalandhar, Punjab.",
  },
  {
    company: "Teach Tech Services",
    role: "Trainer (Part-time)",
    period: "Jul 2018 — Jul 2019",
    logo: null,
    description:
      "Conducted training on penetration testing, ethical hacking (beginner to advanced), digital forensics, and running a SOC business.",
  },
];

const LEFT = POSITIONS.slice(0, 4);
const RIGHT = POSITIONS.slice(4);

function ListItem({
  position,
  index,
  isActive,
  onSelect,
}: {
  position: (typeof POSITIONS)[number];
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-baseline gap-4 border px-5 py-4 text-left transition-colors ${
        isActive
          ? "border-accent bg-accent text-background"
          : "border-white/10 bg-transparent text-foreground hover:border-white/30"
      }`}
    >
      <span
        className={`text-xs ${isActive ? "text-background/60" : "text-muted"}`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span>
        <span className="block text-lg font-semibold leading-tight">
          <GlitchText text={position.company} />
        </span>
        <span
          className={`block text-xs uppercase tracking-widest ${
            isActive ? "text-background/70" : "text-muted"
          }`}
        >
          {position.role}
        </span>
      </span>
    </button>
  );
}

export default function WorkedAt() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = POSITIONS[activeIndex];

  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="mb-4 inline-block rounded-sm bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-background">
          <GlitchText text="I've Been" />
        </span>
        <h2 className="text-5xl font-black uppercase tracking-tight sm:text-6xl">
          <GlitchText text="Worked At" />
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr_1fr] lg:items-start">
        <div className="flex flex-col gap-3 lg:order-1">
          {LEFT.map((position, i) => (
            <ListItem
              key={position.company}
              position={position}
              index={i}
              isActive={activeIndex === i}
              onSelect={() => setActiveIndex(i)}
            />
          ))}
        </div>

        <div className="lg:order-2">
          <div className="relative flex min-h-[260px] items-center justify-center border border-white/15 p-6 sm:min-h-[300px] sm:p-10 lg:min-h-[340px]">
            <span className="absolute -left-1 -top-1 text-muted">+</span>
            <span className="absolute -right-1 -top-1 text-muted">+</span>
            <span className="absolute -bottom-1 -left-1 text-muted">+</span>
            <span className="absolute -bottom-1 -right-1 text-muted">+</span>

            <AnimatePresence mode="wait">
              <motion.p
                key={active.company}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="max-w-sm text-center text-sm leading-relaxed text-foreground/80 sm:text-base"
              >
                <GlitchText
                  text={active.description}
                  tickMs={30}
                  lockEvery={2}
                  charsPerTick={1}
                />
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:order-3">
          {RIGHT.map((position, i) => (
            <ListItem
              key={position.company}
              position={position}
              index={LEFT.length + i}
              isActive={activeIndex === LEFT.length + i}
              onSelect={() => setActiveIndex(LEFT.length + i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
