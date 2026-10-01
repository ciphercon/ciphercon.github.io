// Worked At selector. The first four sit in the left column, the rest on the
// right. `logo` is drawn into the glitch viewport; positions without a logo
// get a typeset wordmark instead.

export type Position = {
  company: string;
  role: string;
  period: string;
  logo: string | null;
  description: string;
};

export const POSITIONS: Position[] = [
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

export const LEFT_COUNT = 4;
