"use client";

import * as Accordion from "@radix-ui/react-accordion";
import GlitchText from "./GlitchText";

const POSITIONS = [
  {
    id: "microsoft",
    role: "Security Researcher II · Threat Hunter 2 (M365 Defender Expert)",
    company: "Microsoft",
    period: "Oct 2022 — Present",
    description:
      "Proactive threat hunting, incident response, and detection engineering across MDI, MDO, MDA, and MDE. Configures ASR rules, oversees Azure AD security, builds Security Copilot models, and contributes to XDR research. Runs weekly TTP-based precision hunting and documents investigations end-to-end.",
  },
  {
    id: "crowe",
    role: "Cyber Security Analyst — Managed Detection & Response",
    company: "Crowe",
    period: "Jan 2022 — Oct 2022",
    description:
      "Monitored and responded to alerts via Carbon Black, built SOAR playbooks in SIEMplify, and analyzed ELK logs for threat prioritization. Ran MITRE ATT&CK-based threat hunting across Carbon Black, Anomali, and Elastic, plus phishing defense via Agari.",
  },
  {
    id: "uhg",
    role: "Associate Cyber Security Analyst",
    company: "UnitedHealth Group",
    period: "Mar 2021 — Jan 2022",
    description:
      "Identified and mitigated phishing, malware, and scam campaigns. Built Splunk dashboards and IOC queries, investigated cloud alerts on Azure Sentinel, and used MITRE ATT&CK to map incident techniques.",
  },
  {
    id: "quickheal",
    role: "Information Security Analyst Trainee",
    company: "Quick Heal",
    period: "Jul 2019 — Feb 2021",
    description:
      "Investigated social engineering, phishing, and spam attacks; built malware signatures from client endpoint data; worked across NGFW, EDR, and sandboxing tools. Developed in-house training courses for Quick Heal Academy.",
  },
  {
    id: "swisto",
    role: "Security Web Intern",
    company: "Swisto",
    period: "Jan 2019 — Jul 2019",
    description:
      "Penetration testing, application security, and secure code review during a 10-month application testing and delivery program.",
  },
  {
    id: "freelance",
    role: "Web Developer Trainee",
    company: "Freelance",
    period: "Sep 2018 — Jan 2019",
    description: "Early web development work, Jalandhar, Punjab.",
  },
  {
    id: "teachtech",
    role: "Trainer (Part-time)",
    company: "Teach Tech Services",
    period: "Jul 2018 — Jul 2019",
    description:
      "Conducted training on penetration testing, ethical hacking (beginner to advanced), digital forensics, and running a SOC business.",
  },
];

export default function ExperienceAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-white/10 border-y border-white/10">
      {POSITIONS.map((position) => (
        <Accordion.Item key={position.id} value={position.id}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-6 text-left">
              <span>
                <span className="block text-lg font-semibold">
                  <GlitchText text={position.role} tickMs={25} lockEvery={2} charsPerTick={2} />
                </span>
                <span className="block text-sm text-muted">
                  <GlitchText
                    text={`${position.company} · ${position.period}`}
                    startDelay={200}
                    tickMs={25}
                    lockEvery={2}
                    charsPerTick={2}
                  />
                </span>
              </span>
              <span className="shrink-0 font-mono text-xl text-muted transition-transform group-data-[state=open]:rotate-45">
                +
              </span>
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordion-down_0.3s_ease-out] data-[state=closed]:animate-[accordion-up_0.3s_ease-out]">
            <p className="max-w-xl pb-6 text-sm text-foreground/70">
              {position.description}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
