// Single source of truth for the copy used across the site. Everything a
// visitor reads lives in src/data/*, so wording can change without touching
// layout or animation code.

export const SITE = {
  firstName: "Abhishek",
  lastName: "Singh",
  role: "Security Researcher",
  company: "Microsoft",
  email: "abhisinghr98@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/abhishek-singh-26061997/",
    topmate: "https://topmate.io/abhishekrajawat",
    cv: "/cv.pdf",
  },
  location: {
    city: "Noida",
    country: "IN",
    timeZone: "Asia/Kolkata",
    // 28.5355° N, 77.3910° E
    lat: `28°32'07.8"N`,
    lng: `77°23'27.6"E`,
  },
} as const;

/** Hero scene. `bio` segments let single words carry their own style. */
export const HERO = {
  contact: [
    { left: "ABHISINGHR98", right: "@GMAIL.COM", href: `mailto:${SITE.email}` },
    { left: "TOPMATE.IO", right: "/ABHISHEKRAJAWAT", href: SITE.links.topmate },
  ],
  bio: [
    { text: "I'm a security researcher passionate about " },
    { text: "Defense", tone: "accent" },
    { text: " and " },
    { text: "<threat-hunting/>", tone: "code" },
    {
      text: ". Nothing excites me more than chasing adversaries through telemetry and turning noise into detections.",
    },
  ],
  // Small lines that bracket the giant name, like a caption.
  captionLeft: "A HUNTER",
  captionRight: "OF THREATS & 3AM ALERTS",
  // Big numeral bottom-right of the name block — career start year.
  badge: "'18",
  badgeLabel: "EST.",
} as const;

/**
 * Manifesto scene. Each line is justified edge-to-edge; `indent` lines start
 * one word-column in, mirroring the reference's stepped rhythm.
 */
export const MANIFESTO = {
  lines: [
    { words: ["I", "BELIEVE", "GOOD"] },
    { words: ["SECURITY", "ISN'T", "BUILT"] },
    { words: ["BY", "TOOLS", "ALONE."] },
    { words: ["IT'S", "FORGED", "THROUGH"] },
    { words: ["LATE-NIGHT", "HUNTS,"], indent: true },
    { words: ["FALSE", "POSITIVES,"], indent: true },
    { words: ["&", "ONE", "TOO", "MANY"] },
  ],
  // Rendered as a rising staircase to the right of the block.
  quote: ["“JUST ONE", "MORE", "QUERY”"],
} as const;

export const SELECTED_WORK = {
  tag: "Keep scrolling",
  title: ["Selected", "Work"],
  subtitle: "Tools, experiments and side quests from the trenches.",
  cta: { label: "Explore more", href: SITE.links.linkedin },
} as const;

export const FOOTER = {
  heading: ["Let's talk", "security."],
  actions: [
    { label: "Shoot a message", href: `mailto:${SITE.email}`, icon: null },
    { label: "Download CV", href: SITE.links.cv, icon: "download" },
    { label: "Book a 1:1", href: SITE.links.topmate, icon: "arrow" },
  ],
  groups: [
    { label: "Social", links: [{ label: "LinkedIn", href: SITE.links.linkedin }] },
    { label: "Mentoring", links: [{ label: "Topmate", href: SITE.links.topmate }] },
    { label: "Contact", links: [{ label: "Email", href: `mailto:${SITE.email}` }] },
  ],
  giant: "PORTFOLIO/ABHISHEK",
} as const;

/** Sections reachable from the menu, in page order. */
export const NAV = [
  { id: "hero", label: "Home" },
  { id: "manifesto", label: "Manifesto" },
  { id: "stats", label: "Stats" },
  { id: "work", label: "Selected Work" },
  { id: "experience", label: "Worked At" },
  { id: "vlogs", label: "Vlogs" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof NAV)[number]["id"];
