// Selected Work track. Cards are absolutely placed on a wide horizontal
// canvas: `x` and card sizes are in track units (u ≈ 1vw, shrunk on short
// screens so cards always fit vertically), `top` is a % of the viewport
// height. Order here is reading order (left → right).

export type CoverVariant =
  | "ioc"
  | "siem"
  | "qa"
  | "chat"
  | "chain"
  | "shop"
  | "identity"
  | "captcha"
  | "terminal"
  | "calendar";

export type Project = {
  title: string;
  tag: string;
  /** Highlighted tags render in the red "case study" style. */
  highlight?: boolean;
  description: string;
  href: string;
  cover: CoverVariant;
  x: number;
  top: number;
  size: "L" | "M";
};

const LINKEDIN = "https://www.linkedin.com/in/abhishek-singh-26061997/";

export const PROJECTS: Project[] = [
  {
    title: "IOC Categorization Tool",
    tag: "Automation",
    description: "Python + Selenium automation for open-source threat intel IOC submission.",
    href: LINKEDIN,
    cover: "ioc",
    x: 20.5,
    top: 56.5,
    size: "L",
  },
  {
    title: "5-Day Threat Hunt",
    tag: "Threat hunting",
    highlight: true,
    description: "Structured daily threat hunting program for the team, built on Elastic.",
    href: LINKEDIN,
    cover: "siem",
    x: 48,
    top: 14.5,
    size: "L",
  },
  {
    title: "Query Solution",
    tag: "App",
    description: "Platform connecting students with PhD experts for live doubt-clearing sessions.",
    href: LINKEDIN,
    cover: "qa",
    x: 64,
    top: 66,
    size: "M",
  },
  {
    title: "SecurText",
    tag: "LLM tool",
    highlight: true,
    description: "ChatGPT-based incident investigation summarizer.",
    href: LINKEDIN,
    cover: "chat",
    x: 85.5,
    top: 31,
    size: "M",
  },
  {
    title: "Supply Chain on Blockchain",
    tag: "Blockchain",
    description: "Hyperledger-based system for trustworthy courier and delivery tracking.",
    href: LINKEDIN,
    cover: "chain",
    x: 111.5,
    top: 45,
    size: "L",
  },
  {
    title: "Swisto",
    tag: "Web app",
    description: "Full-stack developer & pentester for a food/grocery delivery startup.",
    href: "https://www.swisto.in",
    cover: "shop",
    x: 141,
    top: 22,
    size: "M",
  },
  {
    title: "User Identification",
    tag: "Blockchain",
    description: "Blockchain-based user authentication with encrypted personal data blocks.",
    href: LINKEDIN,
    cover: "identity",
    x: 162,
    top: 57,
    size: "L",
  },
  {
    title: "Captcha Generator",
    tag: "Python",
    description: "Custom captcha generator built in Python.",
    href: LINKEDIN,
    cover: "captcha",
    x: 184.5,
    top: 13,
    size: "L",
  },
  {
    title: "Budget Tracker",
    tag: "C++",
    description: "Budget management tool built in C/C++ with a custom Windows API header.",
    href: LINKEDIN,
    cover: "terminal",
    x: 213,
    top: 67,
    size: "M",
  },
  {
    title: "Mentoring at Topmate",
    tag: "Mentoring",
    description: "1:1 sessions on cybersecurity careers and interview prep.",
    href: "https://topmate.io/abhishekrajawat",
    cover: "calendar",
    x: 236,
    top: 36,
    size: "M",
  },
];

/** Card widths in track units, and their aspect ratios (w / h). */
export const CARD_SIZE = {
  L: { w: 27, ratio: 1.38 },
  M: { w: 20, ratio: 1.335 },
} as const;
